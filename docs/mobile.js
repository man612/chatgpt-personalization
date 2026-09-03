(() => {
  "use strict";

  const mobileQuery = window.matchMedia("(max-width: 680px)");
  if (!mobileQuery.matches) return;

  const i18n = window.BuilderI18n;
  const tr = (key, vars, fallback) => i18n?.t?.(key, vars, fallback) || fallback || key;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;
  const controlDeck = document.querySelector(".control-deck");
  const editor = document.querySelector(".editor-panel");
  const editorHeading = editor?.querySelector(".panel-heading h2");
  const editorCaption = editor?.querySelector(".panel-caption");
  const preview = document.querySelector(".preview-panel");
  const profileForm = document.querySelector("#profile-form");
  const templateSelect = document.querySelector("#template-select");
  const limitSelect = document.querySelector("#limit-select");
  const jsonDetails = document.querySelector(".json-details");

  body.classList.add("mobile-flow");

  const steps = ["setup", "product", "identity", "instructions", "output"];
  function stepData(id) {
    return {
      id,
      label: tr(`step_${id}_label`, {}, id),
      title: tr(`step_${id}_title`, {}, id),
      caption: tr(`step_${id}_caption`, {}, ""),
    };
  }

  const replayedInputs = new WeakSet();
  const pendingInputs = new Map();

  function flushPendingInput(target) {
    const timer = pendingInputs.get(target);
    if (!timer) return;
    clearTimeout(timer);
    pendingInputs.delete(target);
    const replay = new Event("input", { bubbles: true });
    replayedInputs.add(replay);
    target.dispatchEvent(replay);
  }

  function flushPendingInputs() {
    [...pendingInputs.keys()].forEach(flushPendingInput);
  }

  const flowNav = document.createElement("nav");
  flowNav.className = "mobile-flow-nav";
  flowNav.setAttribute("aria-label", tr("mobile_steps", {}, "Personalization builder steps"));
  flowNav.innerHTML = `
    <div class="mobile-flow-top">
      <button type="button" class="mobile-back" aria-label="${tr("previous_step", {}, "Previous step")}">←</button>
      <div class="mobile-step-copy" aria-live="polite">
        <small></small>
        <strong></strong>
      </div>
      <button type="button" class="mobile-next">${tr("next", {}, "Next")}</button>
    </div>
    <div class="mobile-step-tabs" aria-label="${tr("jump_steps", {}, "Jump to a builder step")}">
      <span class="mobile-step-indicator" aria-hidden="true"></span>
      ${steps.map((id, index) => {
        const step = stepData(id);
        return `<button type="button" class="mobile-step-tab" data-step-index="${index}" aria-label="${tr("go_step", { number: index + 1, label: step.label }, `Go to step ${index + 1}: ${step.label}`)}"><span>${index + 1}</span><small>${step.label}</small></button>`;
      }).join("")}
    </div>
  `;
  controlDeck?.before(flowNav);

  const backButton = flowNav.querySelector(".mobile-back");
  const nextButton = flowNav.querySelector(".mobile-next");
  const stepMeta = flowNav.querySelector(".mobile-step-copy small");
  const stepLabel = flowNav.querySelector(".mobile-step-copy strong");
  const stepTabs = [...flowNav.querySelectorAll(".mobile-step-tab")];
  const stepIndicator = flowNav.querySelector(".mobile-step-indicator");
  let currentStep = 0;
  let stepAnimation = null;
  let indicatorFrame = 0;

  function getStepSurface(stepId) {
    if (stepId === "setup") return controlDeck;
    if (stepId === "product") return profileForm?.querySelector(".section-product") || editor;
    if (stepId === "identity") return profileForm?.querySelector(".section-identity") || editor;
    if (stepId === "instructions") return profileForm?.querySelector(".section-instructions") || editor;
    if (stepId === "output") return preview;
    return null;
  }

  function scrollToFlow() {
    const top = flowNav.getBoundingClientRect().top + window.scrollY - 74;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function positionStepIndicator(animate = true) {
    cancelAnimationFrame(indicatorFrame);
    indicatorFrame = requestAnimationFrame(() => {
      const active = stepTabs[currentStep];
      if (!active || !stepIndicator) return;
      const hostRect = active.parentElement.getBoundingClientRect();
      const rect = active.getBoundingClientRect();
      if (!animate) stepIndicator.classList.add("no-transition");
      stepIndicator.style.width = `${rect.width}px`;
      stepIndicator.style.transform = `translate3d(${rect.left - hostRect.left}px,0,0)`;
      if (!animate) requestAnimationFrame(() => stepIndicator.classList.remove("no-transition"));
    });
  }

  function updateStepChrome() {
    const step = stepData(steps[currentStep]);
    body.dataset.mobileStep = step.id;
    flowNav.setAttribute("aria-label", tr("mobile_steps", {}, "Personalization builder steps"));
    flowNav.querySelector(".mobile-step-tabs").setAttribute("aria-label", tr("jump_steps", {}, "Jump to a builder step"));
    stepMeta.textContent = tr("step_meta", { current: currentStep + 1, total: steps.length }, `Step ${currentStep + 1} of ${steps.length}`);
    stepLabel.textContent = step.title;
    backButton.disabled = currentStep === 0;
    backButton.setAttribute("aria-label", tr("previous_step", {}, "Previous step"));
    nextButton.disabled = currentStep === steps.length - 1;
    nextButton.textContent = currentStep === steps.length - 1 ? tr("done", {}, "Done") : tr("next", {}, "Next");

    stepTabs.forEach((button, index) => {
      const data = stepData(steps[index]);
      button.querySelector("small").textContent = data.label;
      button.setAttribute("aria-label", tr("go_step", { number: index + 1, label: data.label }, `Go to step ${index + 1}: ${data.label}`));
      const active = index === currentStep;
      if (active) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
      button.classList.toggle("is-complete", index < currentStep);
      button.classList.toggle("is-current", active);
    });

    if (editorHeading && step.id !== "output" && step.id !== "setup") editorHeading.textContent = step.title;
    if (editorCaption && step.id !== "output" && step.id !== "setup") editorCaption.textContent = step.caption;
  }

  function animateStepSurface(surface, direction) {
    if (!surface || reduceMotion || typeof surface.animate !== "function") return;
    stepAnimation?.cancel?.();
    const offset = direction >= 0 ? 18 : -18;
    const animation = surface.animate([
      { opacity: 0, transform: `translate3d(${offset}px,0,0) scale(.992)` },
      { opacity: 1, transform: "translate3d(0,0,0) scale(1)" },
    ], {
      duration: 260,
      easing: "cubic-bezier(.22,1,.36,1)",
      fill: "both",
    });
    stepAnimation = animation;
    animation.finished.catch(() => {}).finally(() => {
      if (stepAnimation === animation) stepAnimation = null;
    });
  }

  function setStep(index, shouldScroll = true, animate = true) {
    flushPendingInputs();
    const target = Math.max(0, Math.min(steps.length - 1, index));
    if (target === currentStep) {
      if (shouldScroll) scrollToFlow();
      return;
    }
    const direction = target > currentStep ? 1 : -1;
    currentStep = target;
    updateStepChrome();
    positionStepIndicator(animate && !reduceMotion);
    requestAnimationFrame(() => {
      animateStepSurface(getStepSurface(steps[currentStep]), direction);
      if (shouldScroll) scrollToFlow();
    });
  }

  backButton.addEventListener("click", () => setStep(currentStep - 1));
  nextButton.addEventListener("click", () => setStep(currentStep + 1));
  stepTabs.forEach((button) => {
    button.addEventListener("click", () => setStep(Number(button.dataset.stepIndex)));
  });

  updateStepChrome();
  positionStepIndicator(false);
  window.addEventListener("resize", () => positionStepIndicator(false), { passive: true });

  if (jsonDetails && controlDeck) {
    jsonDetails.classList.add("mobile-json-details");
    controlDeck.appendChild(jsonDetails);
  }

  const dialog = document.createElement("dialog");
  dialog.className = "mobile-choice-dialog";
  dialog.innerHTML = `
    <div class="mobile-dialog-head">
      <div><small></small><strong></strong></div>
      <button type="button" class="mobile-dialog-close">×</button>
    </div>
    <div class="mobile-dialog-options"></div>
  `;
  body.appendChild(dialog);

  const dialogKicker = dialog.querySelector(".mobile-dialog-head small");
  const dialogTitle = dialog.querySelector(".mobile-dialog-head strong");
  const dialogOptions = dialog.querySelector(".mobile-dialog-options");
  const dialogClose = dialog.querySelector(".mobile-dialog-close");
  let dialogSelect = null;
  let dialogTrigger = null;
  let dialogClosing = false;

  function updateDialogStatic() {
    dialogKicker.textContent = tr("choose_one", {}, "Choose one");
    dialogClose.setAttribute("aria-label", tr("close", {}, "Close"));
    if (dialogSelect) dialogTitle.textContent = selectLabel(dialogSelect);
  }
  updateDialogStatic();

  function selectLabel(select) {
    const explicit = select.getAttribute("aria-labelledby");
    if (explicit) {
      const label = document.getElementById(explicit);
      if (label) return label.textContent.trim();
    }
    const fieldLabel = select.closest(".field")?.querySelector("label");
    return fieldLabel?.textContent.trim() || tr("choose_option", {}, "Choose an option");
  }

  function finishDialogClose() {
    if (!dialog.open) return;
    dialog.close();
  }

  function closeDialog() {
    if (!dialog.open || dialogClosing) return;
    if (reduceMotion || typeof dialog.animate !== "function") {
      finishDialogClose();
      return;
    }
    dialogClosing = true;
    dialog.classList.add("is-closing");
    const animation = dialog.animate([
      { opacity: 1, transform: "translate3d(0,0,0) scale(1)" },
      { opacity: 0, transform: "translate3d(0,16px,0) scale(.985)" },
    ], { duration: 150, easing: "cubic-bezier(.4,0,1,1)" });
    animation.finished.catch(() => {}).finally(finishDialogClose);
  }

  function animateSelected(button) {
    if (reduceMotion || typeof button.animate !== "function") return Promise.resolve();
    const animation = button.animate([
      { transform: "scale(1)" },
      { transform: "scale(.975)" },
      { transform: "scale(1)" },
    ], { duration: 150, easing: "cubic-bezier(.2,.8,.2,1)" });
    return animation.finished.catch(() => {});
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
    button.addEventListener("click", async () => {
      select.value = option.value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
      [...dialogOptions.querySelectorAll('.mobile-dialog-option')].forEach((item) => item.setAttribute("aria-checked", "false"));
      button.setAttribute("aria-checked", "true");
      await animateSelected(button);
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
    updateDialogStatic();
    renderDialogOptions(select);
    trigger.setAttribute("aria-expanded", "true");
    dialog.showModal();
    requestAnimationFrame(() => {
      dialogOptions.querySelector('[aria-checked="true"]')?.scrollIntoView({ block: "nearest" });
    });
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
    dialog.classList.remove("is-closing");
    dialogClosing = false;
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

  const choiceGroups = new Set();
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
      const small = document.createElement("small");
      button.append(strong, small);
      button.addEventListener("click", () => {
        if (select.value === option.value) return;
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
        animateSelected(button);
      });
      group.appendChild(button);
      return { button, option, strong, small };
    });
    const record = { group, buttons, select };
    const sync = () => {
      group.setAttribute("aria-label", selectLabel(select));
      buttons.forEach(({ button, option, strong, small }) => {
        button.setAttribute("aria-checked", String(option.value === select.value));
        strong.textContent = option.textContent;
        small.textContent = option.dataset.description || "";
        small.hidden = !option.dataset.description;
      });
    };
    record.sync = sync;
    choiceGroups.add(record);
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
      state.textContent = on ? tr("option_on", {}, "On") : tr("option_off", {}, "Off");
      hint.textContent = on ? tr("option_enabled", {}, "Enabled for this profile") : tr("option_disabled", {}, "Disabled for this profile");
    };
    button.addEventListener("click", () => {
      select.value = select.value === "true" ? "false" : "true";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      animateSelected(button);
    });
    select.addEventListener("change", sync);
    shell.appendChild(button);
    sync();
  }

  const segmentedGroups = new Set();
  function positionSegmentIndicator(record, animate = true) {
    const { group, buttons, select, indicator } = record;
    const selected = buttons.find(({ option }) => option.value === select.value)?.button;
    if (!selected || !group.isConnected) return;
    if (!animate) indicator.classList.add("no-transition");
    indicator.style.width = `${selected.offsetWidth}px`;
    indicator.style.transform = `translate3d(${selected.offsetLeft}px,0,0)`;
    if (!animate) requestAnimationFrame(() => indicator.classList.remove("no-transition"));
  }

  function enhanceSegmented(select) {
    const shell = select?.closest(".smart-select");
    if (!select || !shell || shell.dataset.mobileChoice === "segments") return;
    shell.dataset.mobileChoice = "segments";
    shell.classList.add("mobile-control-replaced");
    const group = document.createElement("div");
    group.className = "mobile-segmented";
    group.setAttribute("role", "radiogroup");
    group.setAttribute("aria-label", selectLabel(select));
    const indicator = document.createElement("span");
    indicator.className = "mobile-segment-indicator";
    indicator.setAttribute("aria-hidden", "true");
    group.appendChild(indicator);
    const buttons = Array.from(select.options).map((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.setAttribute("role", "radio");
      button.setAttribute("aria-label", option.textContent);
      button.textContent = option.textContent;
      button.addEventListener("click", () => {
        if (select.value === option.value) return;
        select.value = option.value;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      });
      group.appendChild(button);
      return { button, option };
    });
    const record = { group, buttons, select, indicator };
    segmentedGroups.add(record);
    const sync = () => {
      group.setAttribute("aria-label", selectLabel(select));
      buttons.forEach(({ button, option }) => {
        button.setAttribute("aria-checked", String(option.value === select.value));
        button.setAttribute("aria-label", option.textContent);
        button.textContent = option.textContent;
      });
      requestAnimationFrame(() => positionSegmentIndicator(record, !reduceMotion));
    };
    record.sync = sync;
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

  function placeholderFor(id) {
    const keys = {
      "field-identity-occupation": "placeholder_occupation",
      "field-identity-background": "placeholder_background",
      "field-identity-experience": "placeholder_experience",
      "field-identity-recurring_uses": "placeholder_uses",
      "field-identity-stable_preferences": "placeholder_preferences",
    };
    return keys[id] ? tr(keys[id], {}, "") : "";
  }

  const supportsFieldSizing = CSS.supports?.("field-sizing: content") || false;
  const autosizeQueue = new Set();
  let autosizeFrame = 0;

  function autosizeNow(textarea) {
    if (!(textarea instanceof HTMLTextAreaElement) || supportsFieldSizing) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(Math.max(textarea.scrollHeight, 92), 280)}px`;
  }

  function scheduleAutosize(textarea) {
    if (!(textarea instanceof HTMLTextAreaElement) || supportsFieldSizing) return;
    autosizeQueue.add(textarea);
    if (autosizeFrame) return;
    autosizeFrame = requestAnimationFrame(() => {
      autosizeQueue.forEach(autosizeNow);
      autosizeQueue.clear();
      autosizeFrame = 0;
    });
  }

  function enhanceFormUI(root = profileForm) {
    if (!root) return;
    root.querySelectorAll("select").forEach(enhanceSelect);
    root.querySelectorAll("textarea").forEach((textarea) => {
      const placeholder = placeholderFor(textarea.id);
      if (placeholder) textarea.placeholder = placeholder;
      scheduleAutosize(textarea);
    });
    requestAnimationFrame(() => {
      segmentedGroups.forEach((record) => {
        if (!record.group.isConnected) { segmentedGroups.delete(record); return; }
        record.sync?.();
        positionSegmentIndicator(record, false);
      });
    });
  }

  if (profileForm) {
    profileForm.addEventListener("input", (event) => {
      if (replayedInputs.has(event)) return;
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
      if (target instanceof HTMLTextAreaElement) scheduleAutosize(target);
      event.stopImmediatePropagation();
      const existing = pendingInputs.get(target);
      if (existing) clearTimeout(existing);
      const timer = setTimeout(() => flushPendingInput(target), 150);
      pendingInputs.set(target, timer);
    }, true);

    profileForm.addEventListener("blur", (event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) flushPendingInput(target);
    }, true);

    const observer = new MutationObserver((mutations) => {
      if (!mutations.some((mutation) => mutation.addedNodes.length)) return;
      requestAnimationFrame(() => enhanceFormUI(profileForm));
    });
    observer.observe(profileForm, { childList: true, subtree: true });
  }

  window.addEventListener("resize", () => {
    requestAnimationFrame(() => {
      segmentedGroups.forEach((record) => {
        if (!record.group.isConnected) { segmentedGroups.delete(record); return; }
        positionSegmentIndicator(record, false);
      });
    });
  }, { passive: true });

  document.addEventListener("builder:localechange", () => {
    updateStepChrome();
    updateDialogStatic();
    choiceGroups.forEach((record) => {
      if (!record.group.isConnected) { choiceGroups.delete(record); return; }
      record.sync?.();
    });
    enhanceFormUI(profileForm);
    positionStepIndicator(false);
  });

  enhanceFormUI();
})();
