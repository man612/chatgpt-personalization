(() => {
  "use strict";

  const mobileQuery = window.matchMedia("(max-width: 680px)");
  if (!mobileQuery.matches) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const controlDeck = document.querySelector(".control-deck");
  const status = document.querySelector("#status");
  const editor = document.querySelector(".editor-panel");
  const editorHeading = editor?.querySelector(".panel-heading h2");
  const editorCaption = editor?.querySelector(".panel-caption");
  const preview = document.querySelector(".preview-panel");
  const profileForm = document.querySelector("#profile-form");
  const templateSelect = document.querySelector("#template-select");
  const limitSelect = document.querySelector("#limit-select");
  const jsonDetails = document.querySelector(".json-details");

  body.classList.add("mobile-flow");

  const steps = [
    { id: "setup", label: "Setup", title: "Choose a starting point", caption: "Pick a reusable preset and the Custom Instructions character target." },
    { id: "product", label: "Product", title: "Product settings", caption: "Match ChatGPT controls such as Personality, Characteristics, and Memory." },
    { id: "identity", label: "About you", title: "About you", caption: "Add durable context that helps ChatGPT understand your work, background, and recurring use." },
    { id: "instructions", label: "Response", title: "Response behavior", caption: "Define how explanations, research, technical work, UI/UX reviews, and writing should behave." },
    { id: "output", label: "Use in ChatGPT", title: "Use in ChatGPT", caption: "Apply the product controls, then paste each rendered text field into the matching Personalization field." },
  ];

  const flowNav = document.createElement("nav");
  flowNav.className = "mobile-flow-nav";
  flowNav.setAttribute("aria-label", "Personalization builder steps");
  flowNav.innerHTML = `
    <button type="button" class="mobile-back" aria-label="Previous step">←</button>
    <div class="mobile-step-copy" aria-live="polite">
      <small></small>
      <strong></strong>
      <span class="mobile-step-track" aria-hidden="true">${steps.map(() => "<i></i>").join("")}</span>
    </div>
    <button type="button" class="mobile-next">Next</button>
  `;
  controlDeck?.before(flowNav);

  const backButton = flowNav.querySelector(".mobile-back");
  const nextButton = flowNav.querySelector(".mobile-next");
  const stepMeta = flowNav.querySelector(".mobile-step-copy small");
  const stepLabel = flowNav.querySelector(".mobile-step-copy strong");
  const stepBars = [...flowNav.querySelectorAll(".mobile-step-track i")];
  let currentStep = 0;

  function scrollToFlow() {
    const top = flowNav.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function setStep(index, shouldScroll = true) {
    currentStep = Math.max(0, Math.min(steps.length - 1, index));
    const step = steps[currentStep];
    body.dataset.mobileStep = step.id;
    stepMeta.textContent = `Step ${currentStep + 1} of ${steps.length}`;
    stepLabel.textContent = step.label;
    backButton.disabled = currentStep === 0;
    nextButton.disabled = currentStep === steps.length - 1;
    nextButton.textContent = currentStep === steps.length - 1 ? "Done" : "Next";
    stepBars.forEach((bar, barIndex) => {
      bar.classList.toggle("done", barIndex < currentStep);
      bar.classList.toggle("current", barIndex === currentStep);
    });

    if (editorHeading && step.id !== "output" && step.id !== "setup") editorHeading.textContent = step.title;
    if (editorCaption && step.id !== "output" && step.id !== "setup") editorCaption.textContent = step.caption;

    if (shouldScroll) requestAnimationFrame(scrollToFlow);
  }

  backButton.addEventListener("click", () => setStep(currentStep - 1));
  nextButton.addEventListener("click", () => setStep(currentStep + 1));
  setStep(0, false);

  /* Advanced JSON belongs with setup/persistence on mobile, not inside every editing step. */
  if (jsonDetails && controlDeck) {
    jsonDetails.classList.add("mobile-json-details");
    controlDeck.appendChild(jsonDetails);
  }

  /* One native top-layer dialog owns all remaining select menus on mobile.
     This avoids z-index wars and containment bugs from fixed descendants. */
  const dialog = document.createElement("dialog");
  dialog.className = "mobile-choice-dialog";
  dialog.innerHTML = `
    <div class="mobile-dialog-head">
      <div><small>Choose one</small><strong>Options</strong></div>
      <button type="button" class="mobile-dialog-close" aria-label="Close">×</button>
    </div>
    <div class="mobile-dialog-options"></div>
  `;
  body.appendChild(dialog);

  const dialogTitle = dialog.querySelector(".mobile-dialog-head strong");
  const dialogOptions = dialog.querySelector(".mobile-dialog-options");
  const dialogClose = dialog.querySelector(".mobile-dialog-close");
  let dialogSelect = null;
  let dialogTrigger = null;

  function selectLabel(select) {
    const explicit = select.getAttribute("aria-labelledby");
    if (explicit) {
      const label = document.getElementById(explicit);
      if (label) return label.textContent.trim();
    }
    const fieldLabel = select.closest(".field")?.querySelector("label");
    return fieldLabel?.textContent.trim() || "Choose an option";
  }

  function closeDialog() {
    if (dialog.open) dialog.close();
  }

  function renderDialogOptions(select) {
    dialogOptions.innerHTML = "";
    Array.from(select.children).forEach((child) => {
      if (child.tagName === "OPTGROUP") {
        const group = document.createElement("div");
        group.className = "mobile-dialog-group";
        group.textContent = child.label;
        dialogOptions.appendChild(group);
        Array.from(child.children).forEach((option) => appendDialogOption(select, option));
      } else if (child.tagName === "OPTION") {
        appendDialogOption(select, child);
      }
    });
  }

  function appendDialogOption(select, option) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "mobile-dialog-option";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(option.value === select.value));
    const strong = document.createElement("strong");
    strong.textContent = option.textContent;
    button.appendChild(strong);
    if (option.dataset.description) {
      const small = document.createElement("small");
      small.textContent = option.dataset.description;
      button.appendChild(small);
    }
    button.addEventListener("click", () => {
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      closeDialog();
    });
    dialogOptions.appendChild(button);
  }

  function openDialogFor(select) {
    const shell = select.closest(".smart-select");
    const trigger = shell?.querySelector(".select-trigger");
    if (!shell || !trigger) return;
    dialogSelect = select;
    dialogTrigger = trigger;
    dialogTitle.textContent = selectLabel(select);
    renderDialogOptions(select);
    trigger.setAttribute("aria-expanded", "true");
    dialog.showModal();
  }

  dialogClose.addEventListener("click", closeDialog);
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => {
    dialogTrigger?.setAttribute("aria-expanded", "false");
    const target = dialogTrigger;
    dialogSelect = null;
    dialogTrigger = null;
    target?.focus({ preventScroll: true });
  });

  function enhanceDialogSelect(select) {
    const shell = select?.closest(".smart-select");
    const trigger = shell?.querySelector(".select-trigger");
    if (!select || !shell || !trigger || shell.dataset.mobileChoice === "dialog") return;
    shell.dataset.mobileChoice = "dialog";

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      openDialogFor(select);
    }, true);

    trigger.addEventListener("keydown", (event) => {
      if (!["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openDialogFor(select);
    }, true);
  }

  function enhanceChoiceCards(select) {
    const shell = select?.closest(".smart-select");
    if (!select || !shell || shell.dataset.mobileChoice === "cards") return;
    shell.dataset.mobileChoice = "cards";
    shell.classList.add("mobile-control-replaced");

    const group = document.createElement("div");
    group.className = "mobile-direct-choices";
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-label", selectLabel(select));

    const buttons = Array.from(select.options).map((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mobile-choice-card";
      button.setAttribute("role", "radio");
      const strong = document.createElement("strong");
      strong.textContent = option.textContent;
      button.appendChild(strong);
      if (option.dataset.description) {
        const small = document.createElement("small");
        small.textContent = option.dataset.description;
        button.appendChild(small);
      }
      button.addEventListener("click", () => {
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      group.appendChild(button);
      return { button, option };
    });

    const sync = () => buttons.forEach(({ button, option }) => button.setAttribute("aria-checked", String(option.value === select.value)));
    select.addEventListener("change", sync);
    shell.appendChild(group);
    sync();
  }

  function enhanceSwitch(select) {
    const shell = select?.closest(".smart-select");
    if (!select || !shell || shell.dataset.mobileChoice === "switch") return;
    shell.dataset.mobileChoice = "switch";
    shell.classList.add("mobile-control-replaced");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "mobile-switch-control";
    button.setAttribute("role", "switch");
    button.innerHTML = `<span class="mobile-switch-copy"><strong></strong><small></small></span><span class="mobile-switch-track" aria-hidden="true"></span>`;
    const state = button.querySelector("strong");
    const hint = button.querySelector("small");

    const sync = () => {
      const on = select.value === "true";
      button.setAttribute("aria-checked", String(on));
      state.textContent = on ? "On" : "Off";
      hint.textContent = on ? "Enabled for this profile" : "Disabled for this profile";
    };
    button.addEventListener("click", () => {
      select.value = select.value === "true" ? "false" : "true";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    });
    select.addEventListener("change", sync);
    shell.appendChild(button);
    sync();
  }

  function enhanceSegmented(select) {
    const shell = select?.closest(".smart-select");
    if (!select || !shell || shell.dataset.mobileChoice === "segments") return;
    shell.dataset.mobileChoice = "segments";
    shell.classList.add("mobile-control-replaced");

    const labels = {
      less: "Less",
      slightly_less: "Slight −",
      neutral: "Neutral",
      slightly_more: "Slight +",
      more: "More",
    };
    const group = document.createElement("div");
    group.className = "mobile-segmented";
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-label", selectLabel(select));

    const buttons = Array.from(select.options).map((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-label", option.textContent);
      button.textContent = labels[option.value] || option.textContent;
      button.addEventListener("click", () => {
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      group.appendChild(button);
      return { button, option };
    });

    const sync = () => buttons.forEach(({ button, option }) => button.setAttribute("aria-checked", String(option.value === select.value)));
    select.addEventListener("change", sync);
    shell.appendChild(group);
    sync();
  }

  function enhanceSelect(select) {
    if (!(select instanceof HTMLSelectElement)) return;
    if (select === limitSelect) { enhanceChoiceCards(select); return; }
    if (select.id.startsWith("field-product-memory-")) { enhanceSwitch(select); return; }
    if (select.id.startsWith("field-product-characteristics-")) { enhanceSegmented(select); return; }
    enhanceDialogSelect(select);
  }

  enhanceSelect(templateSelect);
  enhanceSelect(limitSelect);

  const placeholders = {
    "field-identity-occupation": "Example: Office operations staff and freelance UI/UX designer",
    "field-identity-background": "One relevant background detail per line",
    "field-identity-experience": "What you already know, how you learned, or where you are still a beginner",
    "field-identity-recurring_uses": "One recurring ChatGPT use per line",
    "field-identity-stable_preferences": "One long-term preference per line",
  };

  function autosize(textarea) {
    if (!(textarea instanceof HTMLTextAreaElement)) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 92), 260)}px`;
  }

  function enhanceFormUI(root = profileForm) {
    if (!root) return;
    root.querySelectorAll("select").forEach(enhanceSelect);
    root.querySelectorAll("textarea").forEach((textarea) => {
      if (placeholders[textarea.id]) textarea.placeholder = placeholders[textarea.id];
      autosize(textarea);
    });
  }

  /* Keep native typing immediate, but coalesce expensive validation/render preview work. */
  if (profileForm) {
    const replayedInputs = new WeakSet();
    const pendingInputs = new Map();

    profileForm.addEventListener("input", (event) => {
      if (replayedInputs.has(event)) return;
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      if (target instanceof HTMLTextAreaElement) autosize(target);

      event.stopImmediatePropagation();
      const existing = pendingInputs.get(target);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(() => {
        pendingInputs.delete(target);
        const replay = new Event("input", { bubbles: true });
        replayedInputs.add(replay);
        target.dispatchEvent(replay);
      }, 110);
      pendingInputs.set(target, timer);
    }, true);

    const observer = new MutationObserver((mutations) => {
      let needsEnhancement = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) needsEnhancement = true;
      });
      if (needsEnhancement) requestAnimationFrame(() => enhanceFormUI(profileForm));
    });
    observer.observe(profileForm, { childList: true, subtree: true });
  }

  enhanceFormUI();
})();
