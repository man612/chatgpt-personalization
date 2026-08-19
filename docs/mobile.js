(() => {
  "use strict";

  const mobileQuery = window.matchMedia("(max-width: 680px)");
  if (!mobileQuery.matches) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const editor = document.querySelector(".editor-panel");
  const preview = document.querySelector(".preview-panel");
  const download = document.querySelector("#download-button");

  const dock = document.createElement("nav");
  dock.className = "builder-mobile-dock";
  dock.setAttribute("aria-label", "Builder quick actions");
  dock.innerHTML = `
    <button type="button" data-target="editor"><span class="dock-icon">✎</span><span>Edit</span></button>
    <button type="button" class="dock-export"><span class="dock-icon">↓</span><span>Export JSON</span></button>
    <button type="button" data-target="preview"><span class="dock-icon">▤</span><span>Output</span></button>
  `;
  document.body.appendChild(dock);

  const scrollToElement = (element) => {
    if (!element) return;
    const top = element.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  };

  dock.querySelector('[data-target="editor"]')?.addEventListener("click", () => scrollToElement(editor));
  dock.querySelector('[data-target="preview"]')?.addEventListener("click", () => scrollToElement(preview));
  dock.querySelector(".dock-export")?.addEventListener("click", () => download?.click());

  const dockButtons = {
    editor: dock.querySelector('[data-target="editor"]'),
    preview: dock.querySelector('[data-target="preview"]'),
  };

  if ("IntersectionObserver" in window) {
    const panelObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      Object.values(dockButtons).forEach((button) => button?.classList.remove("is-current"));
      if (visible.target === editor) dockButtons.editor?.classList.add("is-current");
      if (visible.target === preview) dockButtons.preview?.classList.add("is-current");
    }, { threshold: [0.1, .2, .35], rootMargin: "-18% 0px -45% 0px" });
    if (editor) panelObserver.observe(editor);
    if (preview) panelObserver.observe(preview);
  }

  function enhanceRootSection(section) {
    if (!section || section.dataset.mobileEnhanced === "true") return;
    section.dataset.mobileEnhanced = "true";
    const legend = section.querySelector(":scope > legend");
    if (!legend) return;

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "section-toggle";
    toggle.setAttribute("aria-label", `Collapse ${legend.textContent.trim()}`);
    toggle.setAttribute("aria-expanded", "true");
    legend.appendChild(toggle);

    toggle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const collapsed = section.classList.toggle("is-collapsed");
      toggle.setAttribute("aria-expanded", String(!collapsed));
      toggle.setAttribute("aria-label", `${collapsed ? "Expand" : "Collapse"} ${legend.childNodes[0]?.textContent?.trim() || "section"}`);
    });
  }

  function enhanceAllSections(root = document) {
    root.querySelectorAll?.(".root-section").forEach(enhanceRootSection);
  }
  enhanceAllSections();

  function syncSelectLayer(selectShell) {
    const isOpen = selectShell.classList.contains("open");
    const controlDeck = selectShell.closest(".control-deck");
    const rootSection = selectShell.closest(".root-section");

    if (controlDeck) controlDeck.style.zIndex = isOpen ? "700" : "";
    if (rootSection) {
      rootSection.style.zIndex = isOpen ? "700" : "";
      rootSection.style.isolation = isOpen ? "auto" : "";
      rootSection.style.transform = isOpen ? "none" : "";
    }
    dock.style.zIndex = isOpen ? "900" : "900";
  }

  function enhanceSelectLayer(selectShell) {
    if (!selectShell || selectShell.dataset.mobileLayer === "true") return;
    selectShell.dataset.mobileLayer = "true";
    const observer = new MutationObserver(() => syncSelectLayer(selectShell));
    observer.observe(selectShell, { attributes: true, attributeFilter: ["class"] });
    syncSelectLayer(selectShell);
  }

  function enhanceAllSelectLayers(root = document) {
    root.querySelectorAll?.(".smart-select").forEach(enhanceSelectLayer);
  }
  enhanceAllSelectLayers();

  const sectionObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches(".root-section")) enhanceRootSection(node);
      enhanceAllSections(node);
      if (node.matches(".smart-select")) enhanceSelectLayer(node);
      enhanceAllSelectLayers(node);
    }));
  });
  const profileForm = document.querySelector("#profile-form");
  if (profileForm) sectionObserver.observe(profileForm, { childList: true, subtree: true });

  let lastY = window.scrollY;
  let quietTimer;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    const movingDown = y > lastY;
    if (movingDown && y > 260) dock.classList.add("is-quiet");
    else dock.classList.remove("is-quiet");
    clearTimeout(quietTimer);
    quietTimer = setTimeout(() => dock.classList.remove("is-quiet"), 260);
    lastY = y;
  }, { passive: true });
})();
