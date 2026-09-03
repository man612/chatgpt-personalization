(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobileExperience = window.matchMedia("(max-width: 680px)").matches;
  const supportsScrollTimeline = CSS.supports?.("animation-timeline: scroll()") || false;
  document.documentElement.classList.add("motion-ready");

  const pageEnter = document.createElement("div");
  pageEnter.className = "page-enter";
  pageEnter.setAttribute("aria-hidden", "true");
  document.body.prepend(pageEnter);
  window.setTimeout(() => pageEnter.remove(), 900);

  const revealSelectors = mobileExperience
    ? [".hero-stage", ".control-deck", ".status", ".explanation", ".footer-inner"]
    : [".hero-stage", ".control-deck", ".status", ".editor-panel", ".preview-panel", ".explanation", ".footer-inner"];

  revealSelectors.forEach((selector, selectorIndex) => {
    document.querySelectorAll(selector).forEach((element) => {
      element.setAttribute("data-reveal", "");
      element.style.setProperty("--reveal-delay", `${Math.min(selectorIndex, 4) * 45}ms`);
    });
  });

  const staggerSelectors = [".trust-row", ".hero-flow", ".output-stack"];
  staggerSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((container) => {
      container.setAttribute("data-stagger", "");
      [...container.children].forEach((child, index) => child.style.setProperty("--stagger-index", index));
    });
  });

  const revealNow = (root = document) => {
    root.querySelectorAll?.("[data-reveal], [data-stagger]").forEach((element) => element.classList.add("is-visible"));
  };

  if (!reduceMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.11, rootMargin: "0px 0px -6% 0px" });
    document.querySelectorAll("[data-reveal], [data-stagger]").forEach((element) => revealObserver.observe(element));
  } else {
    revealNow();
  }

  /* Desktop keeps the animated hide/reveal header. Mobile already has a sticky step navigator,
     so avoid a second main-thread scroll-linked state machine there. */
  if (!mobileExperience) {
    const header = document.querySelector(".site-header");
    let previousY = window.scrollY;
    let scrollTicking = false;

    function updateScrollUI() {
      const y = window.scrollY;
      if (!supportsScrollTimeline) {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        document.documentElement.style.setProperty("--page-progress", Math.min(1, y / max));
      }
      if (header) {
        header.classList.toggle("is-scrolled", y > 18);
        const movingDown = y > previousY;
        const shouldHide = movingDown && y > 190 && Math.abs(y - previousY) > 2;
        header.classList.toggle("is-hidden", shouldHide);
        if (!movingDown) header.classList.remove("is-hidden");
      }
      previousY = y;
      scrollTicking = false;
    }

    window.addEventListener("scroll", () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(updateScrollUI);
    }, { passive: true });
    updateScrollUI();
  }

  function addRipple(button) {
    if (!button || button.dataset.motionRipple === "true") return;
    button.dataset.motionRipple = "true";
    button.addEventListener("pointerdown", (event) => {
      const rect = button.getBoundingClientRect();
      button.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
      button.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
      button.classList.remove("is-rippling");
      requestAnimationFrame(() => button.classList.add("is-rippling"));
      setTimeout(() => button.classList.remove("is-rippling"), 680);
    });
  }

  function enhanceButtons(root = document) {
    root.querySelectorAll?.(".button, .copy-button, .text-button").forEach(addRipple);
  }
  enhanceButtons();

  let sectionObserver = null;
  function observeRootSections() {
    if (mobileExperience || !("IntersectionObserver" in window)) return;
    sectionObserver?.disconnect();
    const sections = [...document.querySelectorAll(".root-section")];
    if (!sections.length) return;
    sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      sections.forEach((section) => section.classList.toggle("is-current-section", section === visible.target));
    }, { threshold: [0.16, .32, .52], rootMargin: "-16% 0px -55% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
  }
  observeRootSections();

  const profileForm = document.querySelector("#profile-form");
  if (profileForm && !mobileExperience) {
    const dynamicObserver = new MutationObserver((mutations) => {
      let rootsChanged = false;
      mutations.forEach((mutation) => mutation.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches?.(".root-section") || node.querySelector?.(".root-section")) rootsChanged = true;
      }));
      if (rootsChanged) requestAnimationFrame(observeRootSections);
    });
    dynamicObserver.observe(profileForm, { childList: true, subtree: true });
  }

  const relabel = (selector, text, ariaLabel = text) => {
    const element = document.querySelector(selector);
    if (!element) return;
    element.textContent = text;
    element.setAttribute("aria-label", ariaLabel);
  };
  relabel("#reset-button", "Reset to preset", "Reset all edits to the currently selected starting preset");
  relabel("#download-button", "Save profile JSON ↓", "Save the current personalization profile as a JSON file");
  relabel("#validate-button", "Check profile", "Validate the current profile");
  relabel("#apply-json-button", "Apply JSON changes", "Apply the JSON editor contents to the visual builder");

  const previewHeading = document.querySelector(".preview-panel .panel-heading h2");
  const previewCaption = document.querySelector(".preview-panel .panel-caption");
  if (previewHeading) previewHeading.textContent = "Use in ChatGPT";
  if (previewCaption) previewCaption.textContent = "Apply product controls manually, then copy the three text fields to their matching Personalization fields.";

  const outputTargets = [
    ["settings-output", "Apply manually"],
    ["occupation-output", "Paste → Occupation"],
    ["about-output", "Paste → More about you"],
    ["instructions-output", "Paste → Custom Instructions"],
  ];
  outputTargets.forEach(([outputId, label]) => {
    const heading = document.querySelector(`#${outputId}`)?.closest(".output-card")?.querySelector(".output-heading > div");
    if (!heading || heading.querySelector(".output-target")) return;
    const target = document.createElement("span");
    target.className = "output-target";
    target.textContent = label;
    heading.appendChild(target);
  });

  const outputStack = document.querySelector(".output-stack");
  if (outputStack && !document.querySelector(".preview-use-note")) {
    const note = document.createElement("p");
    note.className = "preview-use-note";
    note.innerHTML = "<strong>Recommended order:</strong> match Product settings first, then paste Occupation, More about you, and Custom Instructions into the fields with the same names in ChatGPT Personalization.";
    outputStack.before(note);
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  });
})();
