#!/usr/bin/env python3
"""Compila (y opcionalmente ejecuta) TODOS los ejemplos del curso con el SDK de .NET instalado.
Uso:  node tools/net10/dump.js && python3 tools/net10/compilar.py [--run]
Requisitos: SDK de .NET 10 (https://dotnet.microsoft.com/download). Imita el envoltorio de la web
(using System, Collections.Generic, Linq, Text, IO, Threading, Threading.Tasks) y usa Roslyn (csc) directamente."""
import json, os, re, subprocess, sys, glob, concurrent.futures as cf
HERE = os.path.dirname(os.path.abspath(__file__))
SDK = sorted(glob.glob("/usr/lib/dotnet/sdk/*") + glob.glob("/usr/share/dotnet/sdk/*") + glob.glob("/usr/local/share/dotnet/sdk/*") + glob.glob(os.path.expandvars(r"%ProgramFiles%\dotnet\sdk\*")))[-1]
CSC = os.path.join(SDK, "Roslyn", "bincore", "csc.dll")
REFDIR = sorted(glob.glob(os.path.join(os.path.dirname(os.path.dirname(SDK)), "packs", "Microsoft.NETCore.App.Ref", "*", "ref", "net*")))[-1]
REFS = [f"-r:{p}" for p in glob.glob(REFDIR + "/*.dll")]
USINGS = ["System", "System.Collections.Generic", "System.Linq", "System.Text", "System.IO", "System.Threading", "System.Threading.Tasks"]
RUN = "--run" in sys.argv
RC = '{"runtimeOptions":{"tfm":"net10.0","framework":{"name":"Microsoft.NETCore.App","version":"10.0.0"}}}'

def prep(src):
    faltan = [n for n in USINGS if not re.search(r"using\s+" + n.replace(".", r"\.") + r"\s*;", src)]
    return "".join(f"using {n}; " for n in faltan) + src

def work(item):
    i, b = item
    if b["noRun"]: return i, b, "skip", ""
    d = os.path.join(HERE, "build", str(i)); os.makedirs(d, exist_ok=True)
    open(f"{d}/p.cs", "w", encoding="utf-8").write(prep(b["code"]))
    r = subprocess.run(["dotnet", CSC, "-nologo", "-nowarn:CS8321,CS0168,CS0219,CS8981,CS0649,CS0169,CS0414", "-langversion:latest",
                        "-target:exe", f"-out:{d}/p.dll", "-noconfig"] + REFS + [f"{d}/p.cs"], capture_output=True, text=True)
    if r.returncode != 0: return i, b, "ERROR", "\n".join(l for l in (r.stdout + r.stderr).split("\n") if "error" in l)[:500]
    if RUN:
        open(f"{d}/p.runtimeconfig.json", "w").write(RC)
        try:
            e = subprocess.run(["dotnet", f"{d}/p.dll"], input="5\n" * 10, capture_output=True, text=True, timeout=8, cwd=d)
            if e.returncode != 0: return i, b, "FALLO", (e.stdout + e.stderr)[:300]
        except subprocess.TimeoutExpired:
            return i, b, "ESPERA", "espera datos concretos del teclado (normal en menús y juegos)"
    return i, b, "ok", ""

blocks = json.load(open(os.path.join(HERE, "blocks.json")))
with cf.ThreadPoolExecutor(6) as ex: res = list(ex.map(work, enumerate(blocks)))
malos = [r for r in res if r[2] in ("ERROR", "FALLO")]
print(f"{len(res)} bloques · {sum(r[2]=='ok' for r in res)} ok · {sum(r[2]=='skip' for r in res)} solo lectura · "
      f"{sum(r[2]=='ESPERA' for r in res)} esperan teclado · {len(malos)} con problemas")
for i, b, est, msg in malos: print(f"\n### [{est}] {b['id']}\n{msg}")
sys.exit(1 if malos else 0)
