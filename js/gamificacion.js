/* =====================================================================
   js/gamificacion.js · PUNTOS, NIVELES, RACHA E INSIGNIAS
   ---------------------------------------------------------------------
   Objetivo: que el progreso SE VEA y dé ganas de seguir. Todo funciona sin servidor y
   sin cuentas: se calcula a partir del progreso que la web ya guarda en el navegador.

   Idea clave (para comentar en clase): los puntos NO se guardan, se CALCULAN.
     XP = lecciones completadas + actividades resueltas + tests + bonus por módulo
   Ventaja: si desmarcas una lección los puntos bajan solos y nadie puede «hacer trampas»
   marcando y desmarcando. Lo único que se guarda (state.game) es lo que no se puede
   deducir: qué insignias ya se avisaron, los días con actividad (racha) y el último nivel.

   Cómo se engancha: app.js llama a Gamificacion.revisar() cada vez que guarda el progreso.
   revisar() recalcula, compara con lo guardado y, si hay novedades, enseña avisos.
   ===================================================================== */
"use strict";

const Gamificacion = (() => {
  /* ---------- Niveles: cada uno pide más XP que el anterior ---------- */
  const NIVELES = [
    { xp: 0,    nombre: "Primeros pasos" },
    { xp: 100,  nombre: "Aprendizaje en marcha" },
    { xp: 300,  nombre: "Primer programa compilado" },
    { xp: 600,  nombre: "Cazabugs" },
    { xp: 1000, nombre: "Ya programas de verdad" },
    { xp: 1600, nombre: "Constructor de clases" },
    { xp: 2400, nombre: "Dominio de colecciones" },
    { xp: 3400, nombre: "Pensamiento LINQ" },
    { xp: 4600, nombre: "Código limpio" },
    { xp: 6000, nombre: "Gran maestría en C#" },
  ];

  // Puntos de cada logro (valores pensados para que un nivel suponga unas pocas lecciones al principio)
  const PTS = { leccion: 20, porMinuto: 1, actividad: 30, testBase: 5, testMax: 10, modulo: 100 };

  const dosDigitos = (n) => String(n).padStart(2, "0");
  const dia = (d = new Date()) => `${d.getFullYear()}-${dosDigitos(d.getMonth() + 1)}-${dosDigitos(d.getDate())}`;
  const minutos = (l) => parseInt(l.duracion, 10) || 0;

  /* ---------- 1. Estadísticas calculadas a partir del progreso ---------- */
  function estadisticas() {
    const hechas = lessons.filter((l) => state.done[l.id]);
    const resueltas = Object.keys((state.training && state.training.solved) || {}).filter((k) => {
      const id = k.slice(0, k.lastIndexOf("."));
      return state.training.solved[k] && lessonById.has(id);
    }).length;

    let xpTests = 0, perfectos = 0, buenos = 0;
    for (const [id, q] of Object.entries(state.quiz || {})) {
      if (!lessonById.has(id) || !q.total) continue;
      const frac = q.best / q.total;
      xpTests += PTS.testBase + Math.round(PTS.testMax * frac);
      if (frac === 1) perfectos++;
      if (frac >= 0.8) buenos++;
    }

    const modulosHechos = COURSE.modulos.filter((m) => m.lecciones.length && m.lecciones.every((l) => state.done[l.id]));
    const xp = hechas.reduce((s, l) => s + PTS.leccion + PTS.porMinuto * minutos(l), 0)
      + resueltas * PTS.actividad + xpTests + modulosHechos.length * PTS.modulo;

    // Racha: días seguidos con actividad, contando hasta hoy o hasta ayer (todavía no se ha roto)
    const dias = new Set((state.game && state.game.dias) || []);
    let racha = 0;
    const cursor = new Date();
    if (!dias.has(dia(cursor))) cursor.setDate(cursor.getDate() - 1);
    while (dias.has(dia(cursor))) { racha++; cursor.setDate(cursor.getDate() - 1); }

    return { xp, hechas: hechas.length, resueltas, perfectos, buenos, racha, modulosHechos: new Set(modulosHechos.map((m) => m.id)) };
  }

  function nivelDe(xp) {
    let i = 0;
    while (i + 1 < NIVELES.length && xp >= NIVELES[i + 1].xp) i++;
    const sig = NIVELES[i + 1] || null;
    const desde = NIVELES[i].xp;
    return { n: i + 1, nombre: NIVELES[i].nombre, sig, pct: sig ? Math.round(((xp - desde) / (sig.xp - desde)) * 100) : 100, faltan: sig ? sig.xp - xp : 0 };
  }

  /* ---------- 2. Insignias: id, icono, nombre, descripción y cómo se comprueba ---------- */
  // cond(s) devuelve [conseguido, objetivo] para poder enseñar «3 / 10» en las que faltan.
  function insignias() {
    const lista = [
      { id: "primer-paso", icono: "🚀", t: "Primer paso", d: "Completa tu primera lección", cond: (s) => [s.hechas, 1] },
      { id: "lecc-10", icono: "📗", t: "En racha de estudio", d: "Completa 10 lecciones", cond: (s) => [s.hechas, 10] },
      { id: "lecc-25", icono: "📘", t: "Cuarto de camino", d: "Completa 25 lecciones", cond: (s) => [s.hechas, 25] },
      { id: "lecc-50", icono: "📙", t: "Más de la mitad", d: "Completa 50 lecciones", cond: (s) => [s.hechas, 50] },
      { id: "act-1", icono: "🧩", t: "Manos a la obra", d: "Resuelve tu primera actividad", cond: (s) => [s.resueltas, 1] },
      { id: "act-10", icono: "🛠️", t: "Picando código", d: "Resuelve 10 actividades", cond: (s) => [s.resueltas, 10] },
      { id: "act-50", icono: "⚙️", t: "Máquina de resolver", d: "Resuelve 50 actividades", cond: (s) => [s.resueltas, 50] },
      { id: "test-100", icono: "🎯", t: "Tiro perfecto", d: "Saca el 100 % en un test", cond: (s) => [s.perfectos, 1] },
      { id: "test-5", icono: "📚", t: "Estudiante aplicado", d: "Saca un 80 % o más en 5 tests", cond: (s) => [s.buenos, 5] },
      { id: "racha-3", icono: "🔥", t: "Tres días seguidos", d: "Estudia 3 días seguidos", cond: (s) => [s.racha, 3] },
      { id: "racha-7", icono: "⚡", t: "Una semana entera", d: "Estudia 7 días seguidos", cond: (s) => [s.racha, 7] },
    ];
    COURSE.modulos.forEach((m, i) => {
      if (!m.lecciones.length) return;
      lista.push({
        id: "mod-" + m.id, icono: "🏅", t: modLabel(m, i), d: "Completa todas las lecciones del módulo", modulo: true,
        cond: (s) => [m.lecciones.filter((l) => state.done[l.id]).length, m.lecciones.length],
      });
    });
    lista.push({ id: "curso", icono: "🏆", t: "Curso completado", d: "Completa todas las lecciones del curso", modulo: true, cond: (s) => [s.hechas, lessons.length] });
    return lista;
  }

  /* ---------- 3. Revisar: recalcular, comparar con lo guardado y avisar ---------- */
  function revisar(silencioso = false) {
    const s = estadisticas();
    const nivel = nivelDe(s.xp);
    const primera = !state.game;
    const g = (state.game = state.game || { xp: s.xp, nivel: nivel.n, insignias: [], dias: [] });
    const avisos = [];

    // Racha: si ha subido el XP hoy, hoy cuenta como día de estudio
    if (!primera && s.xp > g.xp && !g.dias.includes(dia())) {
      g.dias.push(dia());
      g.dias = g.dias.slice(-120);              // con 120 días de memoria sobra para calcular rachas
      s.racha = estadisticas().racha;
    }
    if (!silencioso && !primera && s.xp > g.xp) avisos.push({ tipo: "xp", texto: `+${s.xp - g.xp} XP` });

    const nuevas = insignias().filter((b) => b.cond(s)[0] >= b.cond(s)[1] && !g.insignias.includes(b.id));
    if (nuevas.length) g.insignias.push(...nuevas.map((b) => b.id));
    if (!silencioso && !primera) nuevas.forEach((b) => avisos.push({ tipo: "insignia", b }));
    if (!silencioso && !primera && nivel.n > g.nivel) avisos.push({ tipo: "nivel", nivel });

    const cambio = g.xp !== s.xp || g.nivel !== nivel.n || nuevas.length || primera;
    g.xp = s.xp;
    g.nivel = Math.max(g.nivel, nivel.n);       // un nivel conseguido no se «pierde» al desmarcar
    if (cambio) store.set(STORAGE_KEY, state);  // se guarda directamente: llamar a saveState() crearía un bucle

    pintarChip(s, nivel);
    if (avisos.length) mostrar(avisos);
    return s;
  }

  /* ---------- 4. Avisos (toasts) y confeti ---------- */
  const zona = document.createElement("div");
  zona.className = "gm-toasts";
  zona.setAttribute("aria-live", "polite");
  document.body.appendChild(zona);

  function toast(html, clase, ms = 4200) {
    const el = document.createElement("div");
    el.className = "gm-toast " + clase;
    el.innerHTML = html;
    zona.appendChild(el);
    setTimeout(() => { el.classList.add("fuera"); setTimeout(() => el.remove(), 400); }, ms);
  }

  const sinMovimiento = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  function confeti(n = 36) {
    if (sinMovimiento()) return;                 // respeta a quien pide menos animaciones
    const colores = ["#a78bfa", "#7c3aed", "#facc15", "#34d399", "#f472b6", "#60a5fa"];
    for (let i = 0; i < n; i++) {
      const p = document.createElement("span");
      p.className = "gm-confeti";
      p.style.cssText = `left:${Math.random() * 100}vw;background:${colores[i % colores.length]};animation-delay:${Math.random() * 0.5}s;animation-duration:${1.8 + Math.random() * 1.4}s;transform:rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 3600);
    }
  }

  function mostrar(avisos) {
    let fiesta = false;
    for (const a of avisos) {
      if (a.tipo === "xp") toast(`<b>${esc(a.texto)}</b>`, "xp", 2200);
      if (a.tipo === "insignia") {
        toast(`<span class="gm-ico">${a.b.icono}</span><span><small>Nueva insignia</small><b>${esc(a.b.t)}</b></span>`, "insignia");
        if (a.b.modulo) fiesta = true;
      }
      if (a.tipo === "nivel") {
        toast(`<span class="gm-ico">⭐</span><span><small>¡Subes al nivel ${a.nivel.n}!</small><b>${esc(a.nivel.nombre)}</b></span>`, "nivel", 5500);
        fiesta = true;
      }
    }
    if (fiesta) confeti();
  }

  /* ---------- 5. Indicador en la cabecera ---------- */
  const chip = document.createElement("button");
  chip.type = "button";
  chip.id = "xpChip";
  chip.className = "gm-chip";
  chip.addEventListener("click", () => abrirPanel());
  const progreso = document.querySelector(".progress-wrap");
  progreso.parentNode.insertBefore(chip, progreso.nextSibling);

  function pintarChip(s, nivel) {
    chip.innerHTML = `<span class="gm-star" aria-hidden="true">⭐</span><span class="gm-lv">Nv ${nivel.n}</span><span class="gm-xp">${s.xp} XP</span>${s.racha > 0 ? `<span class="gm-racha" title="Días seguidos">🔥${s.racha}</span>` : ""}<span class="gm-bar" aria-hidden="true"><i style="width:${nivel.pct}%"></i></span>`;
    chip.setAttribute("aria-label", `Nivel ${nivel.n}, ${nivel.nombre}. ${s.xp} puntos. Racha de ${s.racha} días. Abrir mis logros`);
    chip.title = `Nivel ${nivel.n}: ${nivel.nombre}` + (nivel.sig ? ` · te faltan ${nivel.faltan} XP para el siguiente` : "");
  }

  /* ---------- 6. Panel «Mis logros» ---------- */
  const panel = document.createElement("div");
  panel.className = "sr-modal gm-panel";
  panel.hidden = true;
  document.body.appendChild(panel);
  let opener = null;

  function cuerpoPanel() {
    const s = estadisticas();
    const nivel = nivelDe(s.xp);
    const todas = insignias();
    const ganadas = new Set((state.game && state.game.insignias) || []);
    const pendientes = todas.filter((b) => !ganadas.has(b.id))
      .map((b) => { const [a, t] = b.cond(s); return { b, a, t, f: a / t }; })
      .sort((x, y) => y.f - x.f).slice(0, 3);

    const tarjeta = (b) => {
      const [a, t] = b.cond(s);
      const ok = ganadas.has(b.id);
      return `<li class="gm-badge ${ok ? "ok" : ""}" title="${esc(b.d)}">
        <span class="gm-ico" aria-hidden="true">${ok ? b.icono : "🔒"}</span>
        <b>${esc(b.t)}</b><small>${ok ? "Conseguida" : `${Math.min(a, t)} / ${t}`}</small>
        <span class="sr-only">${esc(b.d)}</span></li>`;
    };
    return `
      <div class="sr-box gm-box" role="dialog" aria-modal="true" aria-label="Mis logros">
        <div class="sr-head"><h2 class="gm-h">Mis logros</h2><button type="button" class="icon-btn sr-close" id="gmClose" aria-label="Cerrar">✕</button></div>
        <div class="gm-scroll">
          <div class="gm-nivel">
            <div class="gm-big">⭐ Nivel ${nivel.n}</div>
            <div class="gm-nombre">${esc(nivel.nombre)}</div>
            <div class="gm-meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${nivel.pct}"><i style="width:${nivel.pct}%"></i></div>
            <div class="gm-meter-txt">${s.xp} XP${nivel.sig ? ` · te faltan <b>${nivel.faltan} XP</b> para «${esc(nivel.sig.nombre)}»` : " · ¡nivel máximo!"}</div>
          </div>
          <ul class="gm-stats">
            <li><b>🔥 ${s.racha}</b><small>días seguidos</small></li>
            <li><b>✅ ${s.hechas}</b><small>de ${lessons.length} lecciones</small></li>
            <li><b>🧩 ${s.resueltas}</b><small>actividades</small></li>
            <li><b>🎯 ${s.perfectos}</b><small>tests al 100 %</small></li>
          </ul>
          ${pendientes.length ? `<h3>Próximas metas</h3><ul class="gm-metas">${pendientes.map((p) => `<li><span>${p.b.icono} <b>${esc(p.b.t)}</b> <small>${esc(p.b.d)}</small></span><span class="gm-meter peq"><i style="width:${Math.round(Math.min(p.f, 1) * 100)}%"></i></span><small>${Math.min(p.a, p.t)} / ${p.t}</small></li>`).join("")}</ul>` : ""}
          <h3>Insignias (${ganadas.size} de ${todas.length})</h3>
          <ul class="gm-badges">${todas.map(tarjeta).join("")}</ul>
          <p class="gm-nota">Los puntos se calculan con tu progreso: lección completada, actividad resuelta y test realizado (+${PTS.modulo} XP extra por cada módulo terminado). Se guardan solo en este dispositivo.</p>
        </div>
      </div>`;
  }

  function abrirPanel() {
    opener = document.activeElement;
    panel.innerHTML = cuerpoPanel();
    panel.hidden = false;
    document.body.classList.add("sr-open");
    panel.querySelector("#gmClose").addEventListener("click", cerrarPanel);
    panel.querySelector("#gmClose").focus();
  }
  function cerrarPanel() {
    panel.hidden = true;
    document.body.classList.remove("sr-open");
    if (opener && opener.focus) opener.focus();
  }
  panel.addEventListener("click", (e) => { if (e.target === panel) cerrarPanel(); });
  document.addEventListener("keydown", (e) => { if (!panel.hidden && e.key === "Escape") { e.preventDefault(); cerrarPanel(); } });

  /* ---------- 7. Tarjeta de la portada ---------- */
  function pintarPortada() {
    const cont = document.getElementById("logrosHome");
    if (!cont) return;
    const s = estadisticas();
    const nivel = nivelDe(s.xp);
    const todas = insignias();
    const ganadas = ((state.game && state.game.insignias) || []).map((id) => todas.find((b) => b.id === id)).filter(Boolean);
    const ultimas = ganadas.slice(-6).reverse();
    cont.innerHTML = `
      <h2>Tu progreso</h2>
      <div class="gm-home">
        <div class="gm-home-nivel">
          <div class="gm-big">⭐ Nivel ${nivel.n}</div>
          <div class="gm-nombre">${esc(nivel.nombre)}</div>
          <div class="gm-meter" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${nivel.pct}"><i style="width:${nivel.pct}%"></i></div>
          <div class="gm-meter-txt">${s.xp} XP${nivel.sig ? ` · ${nivel.faltan} para el nivel ${nivel.n + 1}` : ""}</div>
        </div>
        <ul class="gm-stats">
          <li><b>🔥 ${s.racha}</b><small>días seguidos</small></li>
          <li><b>🏅 ${ganadas.length}</b><small>insignias</small></li>
        </ul>
      </div>
      ${s.hechas === 0 && s.xp === 0
        ? `<p class="gm-vacio">Completa tu primera lección y empieza a ganar puntos, subir de nivel y conseguir insignias.</p>`
        : ultimas.length ? `<ul class="gm-recientes">${ultimas.map((b) => `<li title="${esc(b.d)}"><span aria-hidden="true">${b.icono}</span> ${esc(b.t)}</li>`).join("")}</ul>` : ""}
      <button type="button" class="btn" id="gmVerTodo">🏅 Ver todos mis logros</button>`;
    cont.querySelector("#gmVerTodo").addEventListener("click", abrirPanel);
  }

  // Al cargar la web: se calcula en silencio (sin avisos) para no «premiar» de golpe el progreso antiguo
  revisar(true);
  pintarPortada();     // la portada ya se dibujó antes de cargar este archivo: se rellena ahora
  return { revisar, pintarPortada, abrirPanel, estadisticas, nivelDe };
})();
