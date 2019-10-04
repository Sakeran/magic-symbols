"use strict";

const { ANSI_DEFINITIONS: ANSI } = require("./definitions");

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
    return r >= 3
      ? ANSI.HILITE + ANSI.MAGENTA
      : ANSI.UNHILITE + ANSI.MAGENTA;
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

// Create a map of all possible xterm values to their fallbacks.
const XTERM_FALLBACKS = new Map();

// Grayscale Values
"abcdefghijklmnopqrstuvwxyz".split("").forEach(val => {
  XTERM_FALLBACKS.set(`|=${val}`, getAnsiFallbackGrayscale(val));
  XTERM_FALLBACKS.set(`|[=${val}`, getAnsiFallbackGrayscale(val, true));
});

// RGB Values
for (let r = 0; r <= 5; r++) {
  for (let g = 0; g <= 5; g++) {
    for (let b = 0; b <= 5; b++) {
      XTERM_FALLBACKS.set(`|${r}${g}${b}`, getAnsiFallbackRGB(r, g, b));
      XTERM_FALLBACKS.set(`|[${r}${g}${b}`, getAnsiFallbackRGB(r, g, b, true));
    }
  }
}

// Bright ANSI backgrounds
XTERM_FALLBACKS.set("|[x", ANSI.BACK_BLACK);
XTERM_FALLBACKS.set("|[r", ANSI.BACK_RED);
XTERM_FALLBACKS.set("|[g", ANSI.BACK_GREEN);
XTERM_FALLBACKS.set("|[y", ANSI.BACK_YELLOW);
XTERM_FALLBACKS.set("|[b", ANSI.BACK_BLUE);
XTERM_FALLBACKS.set("|[m", ANSI.BACK_MAGENTA);
XTERM_FALLBACKS.set("|[c", ANSI.BACK_CYAN);
XTERM_FALLBACKS.set("|[w", ANSI.BACK_WHITE);

module.exports = {
  getAnsiFallbackRGB,
  getAnsiFallbackGrayscale,
  XTERM_FALLBACKS
};
