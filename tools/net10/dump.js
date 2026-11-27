// Extrae todos los bloques de código (ejemplos y soluciones) de data/course.js a blocks.json
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.resolve(__dirname, "..", "..");
const ctx = {}; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "data/course.js"), "utf8") + ";this.COURSE=COURSE;", ctx);
const out = [];
for (const m of ctx.COURSE.modulos) for (const l of m.lecciones) {
  (l.ejemplos || []).forEach((e, i) => out.push({ id: `${l.id} · ej${i + 1}: ${e.titulo}`, code: e.codigo, noRun: !!e.noRun }));
  (l.actividades || []).forEach((a, i) => (a.soluciones || []).forEach((s, j) => out.push({ id: `${l.id} · act${i + 1} sol${j + 1}: ${s.titulo || ""}`, code: s.codigo, noRun: !!s.noRun })));
}
fs.writeFileSync(path.join(__dirname, "blocks.json"), JSON.stringify(out));
console.log(out.length, "bloques");
