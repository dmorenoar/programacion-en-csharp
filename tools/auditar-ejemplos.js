/* Auditoría de la vía rápida: ¿qué ejemplos/soluciones pueden ir por Mono?
   Uso (sin navegador):   node tools/auditar-ejemplos.js
   Ejecútalo SIEMPRE tras añadir o cambiar un módulo en data/course.js.
   Muestra los bloques que irán por .NET (lento, ~5 s) y el motivo probable,
   para poder reescribirlos de forma equivalente y que vayan por Mono (~1 s). */
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.join(__dirname, "..");
const ctx = { console, localStorage: { getItem: () => null, setItem() {} }, document: {}, window: {}, navigator: {} };
vm.createContext(ctx);
// course.js y editor-kit.js declaran const globales: se cargan juntos para compartir ámbito.
const code = fs.readFileSync(path.join(root, "data/course.js"), "utf8") + "\n" +
             fs.readFileSync(path.join(root, "js/editor-kit.js"), "utf8") +
             "\n;globalThis.__R = { COURSE, EditorKit };";
vm.runInContext(code, ctx);
const { COURSE, EditorKit } = ctx.__R;

const motivos = [
  [/\bRandom\.Shared\b/, "Random.Shared (es moderno: se queda en .NET)"],
  [/\bswitch\s*\{|\bis\s+not\b|\bnew\s*\(\s*\)|\bwith\s*\{|\binit\s*;|\busing\s+var\b|\bawait\b|\basync\b/, "sintaxis C# 8+ (moderna: se queda en .NET, NO rebajarla)"],
  [/:[CNPEGXD]\d*\}|ToString\("[CNPEGXD]/, "formato dependiente de cultura (:C :N :P…) → moderno y válido: se queda en .NET"],
  [/Console\.(ReadKey|Clear|SetCursor)/, "Console.ReadKey/Clear/SetCursor"],
  [/\b(string|int|bool|char|object|long)\?\s*\w|\^\s*\d|\bargs\b/, "nullable / índice ^ / args"],
  [/\b(double|float)\b|\d\.\d|Math\.(Sqrt|Pow|PI)/, "decimal que se imprime «crudo» → usa (int), :F2 o ToString(\"F2\")"],
];

const bloques = [];
for (const l of COURSE.modulos.flatMap((m) => m.lecciones)) {
  (l.ejemplos || []).forEach((e, i) => bloques.push([`${l.id} · ejemplo ${i + 1}: ${e.titulo}`, e.codigo]));
  (l.actividades || []).forEach((a, i) => a.soluciones.forEach((s, j) => bloques.push([`${l.id} · act ${i + 1} sol ${j + 1}: ${s.titulo}`, s.codigo])));
}
let mono = 0;
for (const [nombre, codigo] of bloques) {
  if (EditorKit.monoSource(codigo) !== null) { mono++; continue; }
  const limpio = codigo.replace(/\/\/.*$/gm, "");
  const m = motivos.filter(([re]) => re.test(limpio)).map(([, t]) => t);
  console.log("  .NET  " + nombre + "\n        → " + (m.join("; ") || "revisar a mano"));
}
console.log(`\n${mono} de ${bloques.length} bloques van por la vía rápida (Mono).`);
