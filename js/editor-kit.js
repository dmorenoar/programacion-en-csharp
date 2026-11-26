/* =====================================================================
   js/editor-kit.js · PIEZAS COMUNES DE LOS EDITORES (panel «Probar» y vista «Codificar»)
   ---------------------------------------------------------------------
   Para no escribir dos veces lo mismo, aquí viven:
     · EditorKit.attach()   comportamiento de editor (Tab, sangría, pares de llaves…)
     · EditorKit.execute()  envío del código al compilador (Judge0) y lectura del resultado
   Se carga ANTES que app.js; usa COURSE y highlight() solo cuando se llaman (más tarde).
   ===================================================================== */

const EditorKit = (() => {

  /* ---------- Comportamiento del editor ---------- */

  // Inserta texto en el cursor. execCommand conserva el «deshacer» (Ctrl+Z); si el
  // navegador no lo permite, usamos setRangeText.
  function insert(area, text) {
    area.focus();
    if (!document.execCommand || !document.execCommand("insertText", false, text)) {
      area.setRangeText(text, area.selectionStart, area.selectionEnd, "end");
      area.dispatchEvent(new Event("input"));
    }
  }

  // Pares que se cierran solos: al escribir "(" aparece "()" con el cursor dentro.
  const PAIRS = { "(": ")", "[": "]", "{": "}", '"': '"', "'": "'" };

  // Devuelve [inicio, fin] del bloque de líneas completas que toca la selección.
  function lineRange(area) {
    const v = area.value;
    const start = v.lastIndexOf("\n", area.selectionStart - 1) + 1;
    let end = v.indexOf("\n", area.selectionEnd);
    if (end === -1) end = v.length;
    return [start, end];
  }

  // Aplica una función a cada línea seleccionada (sirve para sangrar y para comentar)
  function mapLines(area, fn) {
    const [s, e] = lineRange(area);
    const block = area.value.slice(s, e).split("\n").map(fn).join("\n");
    area.setRangeText(block, s, e, "select");
    area.dispatchEvent(new Event("input"));
  }

  /**
   * Convierte un <textarea> en un editor «amable» para programar.
   * opciones: { onRun: () => ... }  (se llama con Ctrl/Cmd + Intro)
   */
  function attach(area, { onRun } = {}) {
    area.addEventListener("keydown", (e) => {
      const mod = e.ctrlKey || e.metaKey;
      const v = area.value, s = area.selectionStart, end = area.selectionEnd;

      // Ctrl + Intro → ejecutar
      if (mod && e.key === "Enter") { e.preventDefault(); if (onRun) onRun(); return; }

      // Ctrl + / → comentar / descomentar las líneas seleccionadas
      if (mod && e.key === "/") {
        e.preventDefault();
        const [a, b] = lineRange(area);
        const lines = v.slice(a, b).split("\n").filter((l) => l.trim());
        const allCommented = lines.length && lines.every((l) => /^\s*\/\//.test(l));
        mapLines(area, (l) => (!l.trim() ? l : allCommented ? l.replace(/^(\s*)\/\/ ?/, "$1") : l.replace(/^(\s*)/, "$1// ")));
        return;
      }

      // Tab / Shift+Tab → sangrar o des-sangrar (varias líneas si hay selección)
      if (e.key === "Tab") {
        e.preventDefault();
        if (s !== end && v.slice(s, end).includes("\n") || e.shiftKey) {
          mapLines(area, (l) => (e.shiftKey ? l.replace(/^( {1,4}|\t)/, "") : "    " + l));
        } else insert(area, "    ");
        return;
      }

      // Intro → conserva la sangría; tras "{" la aumenta; entre "{" y "}" abre el bloque
      if (e.key === "Enter" && !mod) {
        e.preventDefault();
        const lineStart = v.lastIndexOf("\n", s - 1) + 1;
        const indent = (v.slice(lineStart, s).match(/^\s*/) || [""])[0];
        if (v[s - 1] === "{" && v[end] === "}") {
          insert(area, "\n" + indent + "    \n" + indent);
          const pos = s + 1 + indent.length + 4;      // cursor en la línea del medio
          area.setSelectionRange(pos, pos);
        } else insert(area, "\n" + indent + (v[s - 1] === "{" ? "    " : ""));
        return;
      }

      // Cierre automático de pares y «saltar» sobre el cierre ya escrito
      if (!mod && !e.altKey && e.key.length === 1) {
        const closing = Object.values(PAIRS).includes(e.key);
        if (s === end && closing && v[s] === e.key) { e.preventDefault(); area.setSelectionRange(s + 1, s + 1); return; }
        if (PAIRS[e.key]) {
          const next = v[end] || "\n";
          const prev = v[s - 1] || " ";
          // Comillas: no autocerrar si va pegada a una palabra (p. ej. al escribir un apóstrofo)
          const quote = e.key === '"' || e.key === "'";
          if (!(quote && /\w/.test(prev)) && /[\s)\]};,]|^$/.test(next)) {
            e.preventDefault();
            const sel = v.slice(s, end);
            insert(area, e.key + sel + PAIRS[e.key]);
            area.setSelectionRange(s + 1, s + 1 + sel.length);
            return;
          }
        }
        // Al escribir "}" al principio de una línea sangrada, quitamos un nivel de sangría
        if (e.key === "}" && s === end && /^ +$/.test(v.slice(v.lastIndexOf("\n", s - 1) + 1, s))) {
          e.preventDefault();
          const ls = v.lastIndexOf("\n", s - 1) + 1;
          area.setRangeText("}", Math.max(s - 4, ls), end, "end");
          area.dispatchEvent(new Event("input"));
        }
      }
    });
  }

  /* ---------- Compilador (Judge0) ---------- */

  // btoa/atob solo entienden Latin-1; para tildes, ñ y € pasamos por UTF-8.
  const toB64 = (text) => {
    let bin = "";
    new TextEncoder().encode(text).forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin);
  };
  const fromB64 = (b64) => {
    if (!b64) return "";
    return new TextDecoder().decode(Uint8Array.from(atob(b64), (c) => c.charCodeAt(0)));
  };

  // Añadimos los using habituales EN LA MISMA LÍNEA 1 (así los números de línea de los
  // errores siguen coincidiendo con los del editor).
  function prepare(source) {
    const usings = ["System", "System.Collections.Generic", "System.Linq", "System.Text"]
      .filter((ns) => !new RegExp(`using\\s+${ns.replace(/\./g, "\\.")}\\s*;`).test(source))
      .map((ns) => `using ${ns};`)
      .join(" ");
    return usings ? usings + " " + source : source;
  }

  // Quita las rutas internas del servidor para que el error sea legible
  const tidy = (t) => t.replace(/\/[\w./-]*\/(\w+\.cs)/g, "$1").replace(/\[\/[^\]]*\]/g, "").trim();

  // ¿El programa lee datos del teclado?
  const needsInput = (source) => /Console\.(ReadLine|Read|ReadKey)\s*\(/.test(source);

  /**
   * Compila y ejecuta. Devuelve SIEMPRE un objeto (nunca lanza):
   *   { text, kind: "ok" | "err" | "warn", title?, meta?, errorLines: [nº de línea…] }
   */
  // Trucos para que se note más rápido (el grueso del tiempo es compilar en el servidor):
  //  1) «preconnect»: abrimos la conexión segura con el compilador nada más cargar la página
  //  2) memoria de resultados: ejecutar EXACTAMENTE el mismo código y entrada es instantáneo
  const cache = new Map();
  let useJson = false;          // pasa a true si el servidor rechaza el formulario
  (function preconnect() {
    try {
      const cfg = COURSE.compilador || {};
      if (!cfg.url) return;
      const l = document.createElement("link");
      l.rel = "preconnect"; l.href = new URL(cfg.url).origin; l.crossOrigin = "";
      document.head.appendChild(l);
    } catch { /* URL no válida: no pasa nada */ }
  })();

  // Mantiene «caliente» la conexión con el compilador: si llevas un rato sin ejecutar, la conexión
  // se cierra y la siguiente ejecución pagaría de nuevo el arranque. Se llama al enfocar/escribir.
  let lastWarm = 0;
  function warm() {
    const cfg = COURSE.compilador || {};
    if (!cfg.url || Date.now() - lastWarm < 25000) return;
    lastWarm = Date.now();
    fetch(`${cfg.url}/about`, { mode: "cors", cache: "no-store" }).catch(() => {});
    if (fast.enabled) fastLanguageId();          // buscamos el id de Mono con antelación
  }

  /* ---------- «Vía rápida» (EXPERIMENTAL): C# con Mono ----------
     Mono compila bastante más rápido que .NET en el servidor, pero es un C# antiguo (≈ C# 7) y
     algunas salidas difieren (p. ej. los números con decimales). Por eso:
       · solo se usa con programas «sencillos» (sin decimales, sin sintaxis moderna, sin clases propias);
       · SOLO se da por buena si termina bien; ante cualquier error se repite con .NET (la referencia);
       · se puede desactivar con el botón ⚡ del editor.
     El id del lenguaje Mono se busca solo en GET /languages (o COURSE.compilador.rapido.languageId). */
  const FAST_KEY = "curso-csharp:fast";
  const fast = {
    enabled: (() => { try { return localStorage.getItem(FAST_KEY) !== "off"; } catch { return true; } })(),
    idPromise: null,
    listeners: [],
  };
  function setFast(on) {
    fast.enabled = !!on;
    try { localStorage.setItem(FAST_KEY, on ? "on" : "off"); } catch { /* sin almacenamiento */ }
    fast.listeners.forEach((f) => f(fast.enabled));
  }

  function fastLanguageId() {
    const cfg = COURSE.compilador || {};
    if (cfg.rapido && cfg.rapido.activo === false) return Promise.resolve(null);
    if (!fast.idPromise) {
      fast.idPromise = (cfg.rapido && cfg.rapido.languageId
        ? Promise.resolve(cfg.rapido.languageId)
        : fetch(`${cfg.url}/languages`, { mode: "cors" })
            .then((r) => (r.ok ? r.json() : []))
            .then((list) => { const m = list.find((l) => /c#/i.test(l.name) && /mono/i.test(l.name)); return m ? m.id : null; }))
        .catch(() => null);
    }
    return fast.idPromise;
  }

  // Devuelve el código listo para Mono o null si el programa NO es apto para la vía rápida
  function monoSource(source) {
    const noComments = source.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
    const modern = [
      /\b(double|float|Math\.|Random)\b|\bMath\./,        // decimales: Mono formatea distinto
      /\d\.\d/, /\b\d+[dDfF]\b/,                         // literales con decimales
      /^\s*(public\s+|internal\s+|static\s+|abstract\s+|sealed\s+)*(class|struct|enum|interface|record|namespace)\b/m,   // tipos propios
      /\bswitch\s*\{|\bis\s+not\b|\bnew\s*\(\s*\)|\bwith\s*\{|\binit\s*;|\busing\s+var\b|\bawait\b|\basync\b/,   // C# 8+
      /\b(string|int|bool|char|object|long)\?\s*\w|\^\s*\d|\.\.\s*\w|\w\s*\.\.|\brecord\b|\bargs\b/,              // nullables, rangos, args
      /static\s+(void|int)\s+Main\b/,                                                                              // ya trae su Main
      /Console\.(ReadKey|Clear|SetCursor)/,
    ];
    if (modern.some((re) => re.test(noComments))) return null;

    // Las líneas «using …;» de arriba se quedan fuera de la clase; el resto va dentro de Main
    const lines = source.split("\n"), head = [], body = [];
    let inHead = true;
    lines.forEach((ln) => {
      if (inHead && /^\s*using\s+[\w.]+\s*;\s*$/.test(ln)) head.push(ln);
      else { if (ln.trim() && !/^\s*\/\//.test(ln)) inHead = false; body.push(ln); }
    });
    const usings = ["System", "System.Collections.Generic", "System.Linq", "System.Text"]
      .filter((ns) => !head.some((h) => h.includes(`using ${ns};`))).map((ns) => `using ${ns};`);
    return usings.join(" ") + " " + head.join(" ") + " class Program { static void Main() { " + body.join("\n") + "\n} }";
  }

  /* ---------- Envío a Judge0 ---------- */

  // Petición «simple» (formulario): el navegador NO hace la consulta previa (preflight OPTIONS)
  // y nos ahorramos una ida y vuelta completa. Si el servidor no la acepta, caemos a JSON.
  async function submit(languageId, code, stdin, ctl) {
    const cfg = COURSE.compilador || {};
    const payload = { language_id: languageId, source_code: toB64(code), stdin: toB64((stdin || "").replace(/\r?\n?$/, "\n")) };   // cada ReadLine consume una línea
    const endpoint = `${cfg.url}/submissions?base64_encoded=true&wait=true`;
    const custom = cfg.headers && Object.keys(cfg.headers).length > 0;
    const asJson = () => fetch(endpoint, {
      method: "POST",
      headers: Object.assign({ "Content-Type": "application/json" }, cfg.headers || {}),
      body: JSON.stringify(payload),
      signal: ctl.signal,
    });
    let res;
    if (useJson || custom) res = await asJson();
    else {
      res = await fetch(endpoint, { method: "POST", body: new URLSearchParams(payload), signal: ctl.signal });
      if (!res.ok && res.status !== 429) { useJson = true; res = await asJson(); }
    }
    if (res.status === 429) return { limited: true };
    if (!res.ok) throw new Error("HTTP " + res.status);
    return { json: await res.json() };
  }

  async function execute(source, stdin) {
    const cfg = COURSE.compilador || {};
    const key = cfg.url + "\u0000" + source + "\u0000" + (stdin || "");
    if (cache.has(key)) {
      const hit = cache.get(key);
      return Object.assign({}, hit, { meta: (hit.meta ? hit.meta + " · " : "") + "resultado guardado (instantáneo)" });
    }
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), cfg.timeoutMs || 30000);
    try {
      let result = null;

      // 1) Vía rápida (Mono), solo si está activada y el programa es apto
      const mono = fast.enabled ? monoSource(source) : null;
      if (mono) {
        const id = await fastLanguageId();
        if (id) {
          const r = await submit(id, mono, stdin, ctl);
          if (r.limited) return { kind: "err", errorLines: [], text: "Demasiadas ejecuciones seguidas en el servicio gratuito. Espera un minuto y vuelve a probar." };
          if (r.json.status && r.json.status.id === 3) {           // solo si terminó BIEN
            result = interpret(r.json);
            result.meta = "⚡ vía rápida (Mono) · " + result.meta;
          }
          // cualquier otro resultado (error de compilación o de ejecución) → lo decide .NET
        }
      }

      // 2) .NET: la referencia (mensajes de error y comportamiento actuales de C#)
      if (!result) {
        const r = await submit(cfg.languageId, prepare(source), stdin, ctl);
        if (r.limited) return { kind: "err", errorLines: [], text: "Demasiadas ejecuciones seguidas en el servicio gratuito. Espera un minuto y vuelve a probar." };
        result = interpret(r.json);
      }

      if (cache.size >= 40) cache.delete(cache.keys().next().value);   // memoria acotada
      cache.set(key, result);
      return result;
    } catch (err) {
      let text;
      if (err.name === "AbortError") text = "El servidor tardó demasiado. Inténtalo de nuevo en un momento.";
      else if (!navigator.onLine) text = "Sin conexión: para ejecutar código necesitas Internet (el resto del curso sí funciona offline).";
      else text = "No se pudo contactar con el compilador (" + err.message + "). Comprueba tu conexión o inténtalo más tarde.";
      return { kind: "err", errorLines: [], text };
    } finally {
      clearTimeout(timer);
    }
  }

  // Judge0: status.id → 3 = OK, 5 = tiempo agotado, 6 = error de compilación, >6 = error en ejecución
  function interpret(r) {
    const stdout = fromB64(r.stdout), stderr = fromB64(r.stderr);
    const compile = fromB64(r.compile_output), message = fromB64(r.message);
    const id = r.status && r.status.id;
    const meta = r.time ? `programa ${r.time} s · ${Math.round((r.memory || 0) / 1024)} MB` : "";

    if (id === 6) {
      const text = tidy(compile) || "Error de compilación.";
      // "Program.cs(3,5): error CS1002" → línea 3
      const errorLines = [...text.matchAll(/\((\d+),\d+\):\s*error/g)].map((m) => +m[1]);
      return { kind: "err", title: "Error de compilación", text, meta, errorLines };
    }
    if (id === 5) return { kind: "err", text: (stdout ? stdout + "\n" : "") + "⏱ Tiempo límite superado (¿bucle infinito?).", meta, errorLines: [] };

    let text = stdout;
    if (stderr || (id && id > 6)) text += (text && !text.endsWith("\n") ? "\n" : "") + tidy(stderr || message || (r.status && r.status.description) || "");
    return { kind: id === 3 ? "ok" : "err", text: text || "(El programa terminó sin mostrar nada)", meta, errorLines: [] };
  }

  /* ---------- Menú desplegable propio ---------- */
  // Los <select> nativos + diálogos (confirm) dentro de «change» dan problemas en algunos
  // navegadores (el desplegable se queda bloqueado). Por eso usamos un menú propio:
  // botones normales, sin ventanas modales, estilables y con el mismo aspecto en todos los sistemas.

  let openMenu = null;

  function closeMenu() {
    if (!openMenu) return;
    openMenu.el.remove();
    openMenu.btn.setAttribute("aria-expanded", "false");
    document.removeEventListener("pointerdown", openMenu.onOutside, true);
    document.removeEventListener("keydown", openMenu.onKey, true);
    window.removeEventListener("resize", closeMenu);
    openMenu = null;
  }

  /**
   * Convierte un botón en un menú desplegable.
   * getEntries() devuelve una lista (se calcula al abrir, así siempre está al día) con:
   *   { group: "Título del grupo", items: [ { text, onSelect, keep? } ] }   → grupo con encabezado
   *   { text, onSelect, keep? }                                              → opción suelta
   * keep: true → el menú no se cierra al elegir (útil para «A+»).
   */
  function menu(button, getEntries) {
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      if (openMenu && openMenu.btn === button) return closeMenu();
      closeMenu();

      const el = document.createElement("div");
      el.className = "ed-menu";
      el.setAttribute("role", "menu");
      const addItem = (item) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "ed-menu-item";
        b.setAttribute("role", "menuitem");
        b.textContent = item.text;
        b.addEventListener("click", () => { if (!item.keep) closeMenu(); item.onSelect(); });
        el.appendChild(b);
      };
      getEntries().forEach((entry) => {
        if (entry.items) {
          if (!entry.items.length) return;
          const h = document.createElement("div");
          h.className = "ed-menu-group";
          h.textContent = entry.group;
          el.appendChild(h);
          entry.items.forEach(addItem);
        } else addItem(entry);
      });
      if (!el.children.length) return;

      document.body.appendChild(el);
      // Posición fija bajo el botón, sin salirse de la pantalla
      const r = button.getBoundingClientRect();
      el.style.top = Math.round(r.bottom + 4) + "px";
      el.style.maxHeight = Math.max(160, window.innerHeight - r.bottom - 16) + "px";
      el.style.left = Math.max(8, Math.min(r.left, window.innerWidth - el.offsetWidth - 8)) + "px";
      button.setAttribute("aria-expanded", "true");

      const onOutside = (e) => { if (!el.contains(e.target) && !button.contains(e.target)) closeMenu(); };
      const onKey = (e) => {
        if (e.key === "Escape") { e.stopPropagation(); closeMenu(); button.focus(); }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {          // navegación con el teclado
          e.preventDefault();
          const items = [...el.querySelectorAll(".ed-menu-item")];
          const i = items.indexOf(document.activeElement);
          items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length].focus();
        }
      };
      document.addEventListener("pointerdown", onOutside, true);
      document.addEventListener("keydown", onKey, true);
      window.addEventListener("resize", closeMenu);
      openMenu = { el, btn: button, onOutside, onKey };
    });
  }

  return { attach, insert, execute, needsInput, prepare, menu, warm, monoSource, fast: { get enabled() { return fast.enabled; }, set: setFast, onChange: (f) => fast.listeners.push(f) } };
})();
