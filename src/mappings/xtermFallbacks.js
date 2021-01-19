"use strict";

const { ANSI_DEFINITIONS: ANSI } = require("../definitions");

// defines ansi fallbacks for xterm codes when xterm is unavailable

function getAnsiFallbackRGB(r, g, b, background = false) {
  if (r == g && r == b && r < 3) {
    if (background) return ANSI.BACK_BLACK;
    return r >= 1 ? ANSI.HILITE + ANSI.BLACK : ANSI.UNHILITE + ANSI.BLACK;
  }

  if (r == g && r == b) {
    if (background) return ANSI.BACK_WHITE;
    return r >= 4 ? ANSI.HILITE + ANSI.WHITE : ANSI.UNHILITE + ANSI.WHITE;
  }

  if (r > g && r > b) {
    if (background) return ANSI.BACK_RED;
    return r >= 3 ? ANSI.HILITE + ANSI.RED : ANSI.UNHILITE + ANSI.RED;
  }

  if (r == g && r > b) {
    if (background) return ANSI.BACK_YELLOW;
    return r >= 3 ? ANSI.HILITE + ANSI.YELLOW : ANSI.UNHILITE + ANSI.YELLOW;
  }

  if (r == b && r > g) {
    if (background) return ANSI.BACK_MAGENTA;
    return r >= 3 ? ANSI.HILITE + ANSI.MAGENTA : ANSI.UNHILITE + ANSI.MAGENTA;
  }

  if (g > b) {
    if (background) return ANSI.BACK_GREEN;
    return g >= 3 ? ANSI.HILITE + ANSI.GREEN : ANSI.UNHILITE + ANSI.GREEN;
  }

  if (g == b) {
    if (background) return ANSI.BACK_CYAN;
    return g >= 3 ? ANSI.HILITE + ANSI.CYAN : ANSI.UNHILITE + ANSI.CYAN;
  }

  if (background) return ANSI.BACK_BLUE;
  return b >= 3 ? ANSI.HILITE + ANSI.BLUE : ANSI.UNHILITE + ANSI.BLUE;
}

function getAnsiFallbackGrayscale(letter, background) {
  const gray = Math.floor((letter.charCodeAt(0) - 97) / 5);
  return getAnsiFallbackRGB(gray, gray, gray, background);
}

function make_xterm_fallback_sequences(symbols) {
  // Determine the symbols
  const fg = symbols.foreground_symbol;
  const fg_gs = symbols.foreground_grayscale_symbol;

  const bg = symbols.background_symbol;
  const bg_gs = symbols.background_grayscale_symbol;

  // Create a map of all possible xterm values to their fallbacks.
  const XTERM_FALLBACKS = new Map();

  // Grayscale Values
  "abcdefghijklmnopqrstuvwxyz".split("").forEach((val) => {
    XTERM_FALLBACKS.set(`${fg_gs}${val}`, getAnsiFallbackGrayscale(val));
    XTERM_FALLBACKS.set(`${bg_gs}${val}`, getAnsiFallbackGrayscale(val, true));
  });

  // RGB Values
  for (let r = 0; r <= 5; r++) {
    for (let g = 0; g <= 5; g++) {
      for (let b = 0; b <= 5; b++) {
        XTERM_FALLBACKS.set(`${fg}${r}${g}${b}`, getAnsiFallbackRGB(r, g, b));
        XTERM_FALLBACKS.set(
          `${bg}${r}${g}${b}`,
          getAnsiFallbackRGB(r, g, b, true)
        );
      }
    }
  }

  // Bright ANSI backgrounds
  XTERM_FALLBACKS.set(`${bg}x`, ANSI.BACK_BLACK);
  XTERM_FALLBACKS.set(`${bg}r`, ANSI.BACK_RED);
  XTERM_FALLBACKS.set(`${bg}g`, ANSI.BACK_GREEN);
  XTERM_FALLBACKS.set(`${bg}y`, ANSI.BACK_YELLOW);
  XTERM_FALLBACKS.set(`${bg}b`, ANSI.BACK_BLUE);
  XTERM_FALLBACKS.set(`${bg}m`, ANSI.BACK_MAGENTA);
  XTERM_FALLBACKS.set(`${bg}c`, ANSI.BACK_CYAN);
  XTERM_FALLBACKS.set(`${bg}w`, ANSI.BACK_WHITE);

  // Custom XTERM Aliases
  Object.entries(symbols.xtermAliases).forEach(([alias, value]) => {
    // Obs - Each entry should have already been error-checked in xterm.js, so
    // all we need to do is insert the shadowed fallback values.
    const originalFg = `${fg}${value}`;
    const originalBg = `${bg}${value}`;

    const newFg = `${fg}${alias}`;
    const newBg = `${bg}${alias}`;

    // Add the new sequence
    XTERM_FALLBACKS.set(newFg, XTERM_FALLBACKS.get(originalFg));
    XTERM_FALLBACKS.set(newBg, XTERM_FALLBACKS.get(originalBg));
  });

  return XTERM_FALLBACKS;
}

module.exports = {
  getAnsiFallbackRGB,
  getAnsiFallbackGrayscale,
  make_xterm_fallback_sequences,
};
