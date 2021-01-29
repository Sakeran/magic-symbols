"use strict";

const { ESCAPE } = require("../definitions");
const { make_xterm_fallback_sequences } = require("./xtermFallbacks");

const escapeRegExp = require("../escape_re");

function getRGBXterm(r, g, b, background = false) {
  return ESCAPE + `[${background ? 4 : 3}8;5;${16 + 36 * r + 6 * g + b}m`;
}

function getGrayscaleXterm(letter, background = false) {
  if (letter === "a") {
    return ESCAPE + `[${background ? 4 : 3}8;5;16m`;
  }
  if (letter === "z") {
    return ESCAPE + `[${background ? 4 : 3}8;5;231m`;
  }
  return ESCAPE + `[${background ? 4 : 3}8;5;${134 + letter.charCodeAt(0)}m`;
}

function init_xterm_mappings(symbols) {
  // Determine the symbols
  const fg = symbols.foreground_symbol;
  const fg_gs = symbols.foreground_grayscale_symbol;

  const bg = symbols.background_symbol;
  const bg_gs = symbols.background_grayscale_symbol;

  // Build a map of all possible xterm sequences.
  const SEQUENCES = new Map();

  // Grayscale Values
  "abcdefghijklmnopqrstuvwxyz".split("").forEach((val) => {
    SEQUENCES.set(`${fg_gs}${val}`, getGrayscaleXterm(val));
    SEQUENCES.set(`${bg_gs}${val}`, getGrayscaleXterm(val, true));
  });

  // RGB Values
  for (let r = 0; r <= 5; r++) {
    for (let g = 0; g <= 5; g++) {
      for (let b = 0; b <= 5; b++) {
        SEQUENCES.set(`${fg}${r}${g}${b}`, getRGBXterm(r, g, b));
        SEQUENCES.set(`${bg}${r}${g}${b}`, getRGBXterm(r, g, b, true));
      }
    }
  }

  // Bright ANSI Background Substitutions
  SEQUENCES.set(`${bg}x`, getRGBXterm(2, 2, 2, true));
  SEQUENCES.set(`${bg}r`, getRGBXterm(5, 0, 0, true));
  SEQUENCES.set(`${bg}g`, getRGBXterm(0, 5, 0, true));
  SEQUENCES.set(`${bg}y`, getRGBXterm(5, 5, 0, true));
  SEQUENCES.set(`${bg}b`, getRGBXterm(0, 0, 5, true));
  SEQUENCES.set(`${bg}m`, getRGBXterm(5, 0, 5, true));
  SEQUENCES.set(`${bg}c`, getRGBXterm(0, 5, 5, true));
  SEQUENCES.set(`${bg}w`, getRGBXterm(5, 5, 5, true));

  // Custom XTERM Aliases

  let custom_aliases = [];

  Object.entries(symbols.xtermAliases).forEach(([alias, value]) => {
    // Obs - If the given value is valid, then it already exists in SEQUENCES, so
    // we can simply add a new key with the same value.
    const originalFg = `${fg}${value}`;
    const originalBg = `${bg}${value}`;

    if (!SEQUENCES.get(originalFg)) {
      throw new Error(
        `XTERM alias ("${alias}" -> "${value}") has an invalid value.`
      );
    }

    const newFg = `${fg}${alias}`;
    const newBg = `${bg}${alias}`;

    // Ensure neither alias is already in SEQUENCES
    if (SEQUENCES.get(newFg) || SEQUENCES.get(newBg)) {
      throw new Error(
        `XTERM alias ("${alias}" -> "${value}") is invalid, because the code is already defined.`
      );
    }

    // Add the new sequence
    SEQUENCES.set(newFg, SEQUENCES.get(originalFg));
    SEQUENCES.set(newBg, SEQUENCES.get(originalBg));

    custom_aliases.push(alias);
  });

  // Sort custom aliases by length (Longer aliases should be considered first)
  custom_aliases = custom_aliases
    .sort((a, b) => b.length - a.length)
    .map((a) => escapeRegExp(a));

  // Create REGEX Matchers

  // Escaped versions of given symbols
  const efg = escapeRegExp(fg);
  const efg_gs = escapeRegExp(fg_gs);

  const ebg = escapeRegExp(bg);
  const ebg_gs = escapeRegExp(bg_gs);

  const COLOR_REGEX = `(?:${efg}|${ebg})(?:[0-5][0-5][0-5]${
    custom_aliases.length ? "|" + custom_aliases.join("|") : ""
  })`;

  const GRAYSCALE_REGEX = `(?:${efg_gs}|${ebg_gs})[a-z]`;

  const BGSUB_REGEX = `(?:${"xrgybmcw"
    .split("")
    .map((val) => `${ebg}${val}`)
    .join("|")})`;

  return {
    SEQUENCES,
    FALLBACK_SEQUENCES: make_xterm_fallback_sequences(symbols),
    COLOR_REGEX,
    GRAYSCALE_REGEX,
    BGSUB_REGEX,
  };
}

module.exports = {
  init_xterm_mappings,
  getGrayscaleXterm,
  getRGBXterm,
};
