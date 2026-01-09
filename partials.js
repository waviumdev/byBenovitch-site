function getBasePrefix() {
  const path = location.pathname;
 
  // Si on est à la racine ou sur une page racine
  if (path === "/" || path.split("/").filter(Boolean).length === 1) {
    return "";
  }

  // Sinon on remonte d’un niveau par dossier
  const depth = path.split("/").filter(Boolean).length - 1;
  return "../".repeat(depth);
}

async function loadPartial(selector, url) {
  const el = document.querySelector(selector);
  if (!el) return;

  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) return;
  el.innerHTML = await res.text();
}

function rewriteLinks(prefix) {
  document.querySelectorAll("[data-href]").forEach(el => {
    const target = el.getAttribute("data-href");
    if (!target) return;

    const url = prefix + target.replace(/^\//, "");

    if (el.tagName === "A") {
      el.setAttribute("href", url);
    }
    else if (el.tagName === "IMG") {
      el.setAttribute("src", url);
    }
  });
}

function rewriteCSS(prefix) {
  document.querySelectorAll('link[data-href]').forEach(link => {
    const target = link.getAttribute('data-href');
    if (!target) return;
    link.setAttribute('href', prefix + target.replace(/^\//, ""));
  });
}

function initHeaderUI() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggle = header.querySelector(".nav-toggle");
  const menu = header.querySelector(".menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

function initFooterYear() {
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
}

(async function boot() {
  const prefix = getBasePrefix();

  // CSS en premier
  rewriteCSS(prefix);

  await loadPartial("#site-header", `${prefix}partials/header.html`);
  await loadPartial("#site-footer", `${prefix}partials/footer.html`);

  rewriteLinks(prefix);
  initHeaderUI();
  initFooterYear();
})();

