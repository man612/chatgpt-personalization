(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.ProfileRenderer = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const DEFAULT_LONG_FIELD_LIMIT = 1500;

  function nonemptyStrings(values) {
    if (!Array.isArray(values)) return [];
    return values
      .filter((value) => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  function sentence(value) {
    const text = typeof value === "string" ? value.trim() : "";
    if (!text) return "";
    return /[.!?]$/.test(text) ? text : `${text}.`;
  }

  function sentences(values) {
    return nonemptyStrings(values).map(sentence).join(" ");
  }

  function serialList(values) {
    const cleaned = nonemptyStrings(values);
    if (!cleaned.length) return "";
    if (cleaned.length === 1) return cleaned[0];
    if (cleaned.length === 2) return `${cleaned[0]} and ${cleaned[1]}`;
    return `${cleaned.slice(0, -1).join(", ")}, and ${cleaned.at(-1)}`;
  }

  function toneText(values) {
    const simple = [];
    const qualified = [];

    for (const value of nonemptyStrings(values)) {
      const lowered = value.toLowerCase();
      const wordCount = value.split(/\s+/).filter(Boolean).length;
      if (wordCount <= 2 && ![" without ", " when ", " but "].some((part) => lowered.includes(part))) {
        simple.push(value);
      } else {
        qualified.push(value);
      }
    }

    const parts = [];
    if (simple.length) parts.push(`Use a ${serialList(simple)} tone.`);
    for (const item of qualified) {
      parts.push(sentence(item.charAt(0).toUpperCase() + item.slice(1)));
    }
    return parts.join(" ");
  }

  function renderProfile(profile) {
    const about = profile && typeof profile.about === "object" && !Array.isArray(profile.about)
      ? profile.about
      : {};
    const response = profile && typeof profile.response === "object" && !Array.isArray(profile.response)
      ? profile.response
      : {};
    const structure = response && typeof response.structure === "object" && !Array.isArray(response.structure)
      ? response.structure
      : {};

    const aboutParagraphs = [];
    const background = sentences(about.background);
    if (background) aboutParagraphs.push(background);

    const experience = sentence(about.experience);
    if (experience) aboutParagraphs.push(experience);

    const uses = serialList(about.recurring_uses);
    if (uses) aboutParagraphs.push(`Common uses include ${uses}.`);

    const preferences = sentences(about.stable_preferences);
    if (preferences) aboutParagraphs.push(preferences);

    const responseParagraphs = [];
    const openingParts = [];
    const language = sentence(response.language);
    if (language) openingParts.push(language);

    const tone = toneText(response.tone);
    if (tone) openingParts.push(tone);

    const audience = typeof response.audience === "string" ? response.audience.trim() : "";
    if (audience) openingParts.push(`Write for ${audience}.`);
    if (openingParts.length) responseParagraphs.push(openingParts.join(" "));

    const structureText = sentences([
      structure.long_answers,
      structure.body,
      structure.lists,
      structure.tables,
    ]);
    if (structureText) responseParagraphs.push(structureText);

    const technical = sentences(response.technical);
    if (technical) responseParagraphs.push(technical);

    const research = sentences(response.research);
    if (research) responseParagraphs.push(research);

    const avoid = serialList(response.avoid);
    if (avoid) responseParagraphs.push(`Avoid ${avoid}.`);

    return {
      occupation: typeof profile?.occupation === "string" ? profile.occupation.trim() : "",
      more_about_you: aboutParagraphs.join("\n\n"),
      response_preferences: responseParagraphs.join("\n\n"),
    };
  }

  function renderedFieldFindings(rendered, longFieldLimit = DEFAULT_LONG_FIELD_LIMIT) {
    const findings = [];
    if (!rendered.occupation) {
      findings.push({ level: "warning", code: "EMPTY_FIELD", message: "Occupation is empty." });
    }

    for (const [name, value] of [
      ["More about you", rendered.more_about_you],
      ["Response preferences", rendered.response_preferences],
    ]) {
      const length = value.length;
      if (length > longFieldLimit) {
        findings.push({
          level: "error",
          code: "FIELD_LIMIT",
          message: `${name} is ${length} characters; the configured limit is ${longFieldLimit}.`,
        });
      } else if (length > Math.floor(longFieldLimit * 0.9)) {
        findings.push({
          level: "warning",
          code: "FIELD_NEAR_LIMIT",
          message: `${name} is ${length} characters; the configured limit is ${longFieldLimit}.`,
        });
      }
    }
    return findings;
  }

  return {
    DEFAULT_LONG_FIELD_LIMIT,
    renderProfile,
    renderedFieldFindings,
  };
});
