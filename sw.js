/* =====================================================================
   sw.js · Service Worker (lo que convierte la web en PWA "offline")
   ---------------------------------------------------------------------
   Un service worker es un script que el navegador ejecuta aparte de la
   página y que puede interceptar TODAS las peticiones de red de la web.

   Estrategia elegida: "NETWORK FIRST" (red primero)
     1) Intenta descargar el archivo de internet (así el alumnado siempre
        ve la última versión del curso cuando añadas temas nuevos).
     2) Si funciona, guarda una copia en caché.
     3) Si no hay conexión, sirve la copia guardada.

   Alternativas (para comentar en clase):
     · "Cache first": más rápida y más offline, pero hay que cambiar VERSION
       cada vez que publiques contenido nuevo, o el alumnado verá lo viejo.
     · "Stale-while-revalidate": enseña lo guardado al instante y actualiza
       en segundo plano; la actualización se ve en la visita siguiente.

   Los vídeos de Drive/YouTube NO se guardan (son de otro dominio y pesan
   mucho): sin conexión se ve la teoría y las actividades, pero no el vídeo.
   ===================================================================== */

const VERSION = "v21";                       // súbela si cambias la LISTA de archivos de abajo
const CACHE = `curso-csharp-${VERSION}`;

// Archivos imprescindibles: se descargan al instalar para que funcione offline desde la primera visita
const CORE = [
  "./",
  "index.html",
  "css/styles.css",
  "css/theme.css",
  "css/home.css",
  "img/hero-code.svg",
  "css/playground.css",
  "css/editor.css",
  "css/training.css",
  "js/editor-pane.js",
  "js/training.js",
  "css/profile.css",
  "js/profile.js",
  "js/editor-kit.js",
  "js/playground.js",
  "js/app.js",
  "data/course.js",
  "manifest.webmanifest",
  "icons/favicon.svg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("curso-csharp-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Solo gestionamos GET del mismo origen; lo demás (Drive, YouTube…) pasa directo a la red
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req, { cache: "no-cache" })                 // "no-cache": revalida con el servidor (la caché HTTP de GitHub Pages dura 10 min)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();               // una respuesta solo se puede leer una vez: guardamos un clon
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(req).then(
          (cached) => cached || (req.mode === "navigate" ? caches.match("index.html") : Response.error())
        )
      )
  );
});
