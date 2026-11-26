/* =====================================================================
   js/profile.js · PERFIL «ARCADE» DEL PROFESOR
   ---------------------------------------------------------------------
   Ventana modal con el perfil de web-damv adaptado al estilo del curso:
   · Mario (SVG de píxeles) que SALTA al abrir y al pulsarlo
   · sonido de moneda (audio/coin.mp3) y una moneda que sube y se desvanece
   · barras de estadísticas que se llenan "a bloques" (efecto 8 bits)

   Se carga ANTES que app.js porque este necesita MARIO_SVG al pintar la portada.
   El modal se construye la primera vez que se abre (no pesa al cargar la web).
   ===================================================================== */

// Sprite 16×16: cada <path> pinta píxeles de un color. shape-rendering="crispEdges"
// evita el suavizado para que se vean los cuadrados nítidos.
const MARIO_SVG = `<svg class="mario" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">
  <path d="M5 1h6v1H5V1zM4 2h9v1H4V2z" fill="#f00"/>
  <path d="M4 3h5v1H4V3zM3 4h2v1H3V4zM3 5h1v1H3V5zM7 5h1v1H7V5zM3 6h1v1H3V6z" fill="#840"/>
  <path d="M9 3h3v1H9V3z" fill="#840"/>
  <path d="M5 4h8v1H5V4z" fill="#fca"/>
  <path d="M4 5h8v2H4V5z" fill="#fca"/>
  <path d="M4 7h6v1H4V7z" fill="#fca"/>
  <path d="M9 4h1v2H9V4z" fill="#000"/>
  <path d="M10 6h3v1h-3V6z" fill="#840"/>
  <path d="M9 7h1v1H9V7z" fill="#840"/>
  <path d="M4 8h8v1H4V8z" fill="#f00"/>
  <path d="M3 9h10v1H3V9zM2 10h12v1H2v-1z" fill="#f00"/>
  <path d="M4 9h2v4H4V9z" fill="#00f"/>
  <path d="M10 9h2v4h-2V9z" fill="#00f"/>
  <path d="M6 11h4v1H6v-1z" fill="#00f"/>
  <path d="M5 10h1v1H5v-1zM10 10h1v1h-1v-1z" fill="#ff0"/>
  <path d="M3 14h3v1H3v-1zM10 14h3v1h-3v-1z" fill="#840"/>
</svg>`;

const Profile = (() => {
  let modal = null, lastFocus = null, coin = null;

  // ¿Sonido activado? Se recuerda en el navegador (por defecto sí: el usuario acaba de hacer clic)
  const soundOn = () => { try { return localStorage.getItem("curso-csharp:sound") !== "off"; } catch { return true; } };
  const setSound = (on) => { try { localStorage.setItem("curso-csharp:sound", on ? "on" : "off"); } catch {} };

  const bar = (s) => `
    <div class="stat">
      <div class="stat-row"><span><strong>${esc(s.nombre)}</strong><em> · ${esc(s.desc)}</em></span><b>${s.valor}%</b></div>
      <div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s.valor}" aria-label="${esc(s.nombre)}">
        <span style="--w:${s.valor}%; --c:${esc(s.color)}"></span>
      </div>
    </div>`;

  function build() {
    const p = COURSE.profesor;
    const lessons = COURSE.modulos.reduce((n, m) => n + m.lecciones.length, 0);
    const acts = COURSE.modulos.reduce((n, m) => n + m.lecciones.reduce((k, l) => k + l.actividades.length, 0), 0);

    modal = document.createElement("div");
    modal.className = "profile-modal";
    modal.hidden = true;
    modal.innerHTML = `
      <div class="profile-card" role="dialog" aria-modal="true" aria-labelledby="profileName">
        <button type="button" class="profile-close" aria-label="Cerrar perfil">✕</button>

        <header class="profile-head">
          <button type="button" class="hero-mario" aria-label="Mario: pulsa para saltar" title="¡Púlsame!">
            <span class="coin" aria-hidden="true"></span>
            ${MARIO_SVG}
          </button>
          <div>
            <span class="profile-badge">${esc(p.insignia || "Profesor")}</span>
            <span class="profile-ver">${esc(p.version || "")}</span>
            <h2 id="profileName">${esc(p.nombre)}</h2>
            <div class="profile-role">${esc(p.rol || "")}</div>
            <p>${esc(p.presentacion || p.bio || "")}</p>
          </div>
        </header>

        <div class="profile-facts">
          <div><b>${COURSE.modulos.length}</b><span>módulos</span></div>
          <div><b>${lessons}</b><span>lecciones</span></div>
          <div><b>${acts}</b><span>actividades</span></div>
        </div>

        <div class="profile-body">
          <h3>Estadísticas del sistema</h3>
          ${(p.estadisticas || []).map(bar).join("")}
          <h3>Habilidades especiales</h3>
          ${(p.habilidades || []).map(bar).join("")}
          ${p.lema ? `<div class="mission"><strong>Registro de misión</strong><q>${esc(p.lema)}</q></div>` : ""}
        </div>

        <footer class="profile-foot">
          <button type="button" class="link-btn sound-toggle" aria-pressed="${soundOn()}">${soundOn() ? "🔊 Sonido activado" : "🔇 Sonido desactivado"}</button>
          <button type="button" class="btn primary profile-ok">Volver al curso</button>
        </footer>
      </div>`;
    document.body.appendChild(modal);

    // Cierre: clic en el fondo, en ✕, en «Volver», o tecla Escape (ver keydown más abajo)
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.closest(".profile-close, .profile-ok")) close();
      if (e.target.closest(".hero-mario")) hop(true);
      const t = e.target.closest(".sound-toggle");
      if (t) {
        const on = !soundOn();
        setSound(on);
        t.textContent = on ? "🔊 Sonido activado" : "🔇 Sonido desactivado";
        t.setAttribute("aria-pressed", String(on));
        if (on) beep();
      }
    });
  }

  // Sonido de moneda. Un Audio nuevo por reproducción permite repetirlo rápido sin cortarse.
  function beep() {
    if (!soundOn()) return;
    try {
      coin = coin || new Audio("audio/coin.mp3");
      const a = coin.cloneNode();
      a.volume = 0.6;
      a.play().catch(() => {});       // si el navegador lo bloquea o no hay archivo, no pasa nada
    } catch {}
  }

  // Salto: quitamos y volvemos a poner la clase para REINICIAR la animación CSS.
  // (El "reflow" forzado con offsetWidth es el truco clásico para eso.)
  function hop(withSound) {
    const el = modal.querySelector(".hero-mario");
    el.classList.remove("jump");
    void el.offsetWidth;
    el.classList.add("jump");
    if (withSound) beep();
  }

  function open() {
    if (!modal) build();
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("profile-open");
    // Reiniciamos las barras para que se vuelvan a llenar cada vez que se abre
    modal.querySelectorAll(".bar").forEach((b) => b.classList.remove("on"));
    requestAnimationFrame(() => requestAnimationFrame(() => modal.querySelectorAll(".bar").forEach((b) => b.classList.add("on"))));
    hop(true);
    modal.querySelector(".profile-close").focus();
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("profile-open");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  // Delegación: cualquier elemento con data-profile abre el perfil (se crean al pintar la portada)
  document.addEventListener("click", (e) => { if (e.target.closest("[data-profile]")) open(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  return { open, close };
})();
