"use strict";

const { ESCAPE } = require("../definitions");

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
  return (
    ESCAPE + `[${background ? 4 : 3}8;5;${134 + letter.charCodeAt(0)}m`
  );
}

// Build a map of all possible xterm sequences.
const XTERM_SEQUENCES = new Map();

// Grayscale Values
"abcdefghijklmnopqrstuvwxyz".split("").forEach(val => {
  XTERM_SEQUENCES.set(`|=${val}`, getGrayscaleXterm(val));
  XTERM_SEQUENCES.set(`|[=${val}`, getGrayscaleXterm(val, true));
});

// RGB Values
for (let r = 0; r <= 5; r++) {
  for (let g = 0; g <= 5; g++) {
    for (let b = 0; b <= 5; b++) {
      XTERM_SEQUENCES.set(`|${r}${g}${b}`, getRGBXterm(r, g, b));
      XTERM_SEQUENCES.set(`|[${r}${g}${b}`, getRGBXterm(r, g, b, true));
    }
  }
}

// Bright ANSI Background Substitutions
XTERM_SEQUENCES.set("|[x", getRGBXterm(2, 2, 2, true));
XTERM_SEQUENCES.set("|[r", getRGBXterm(5, 0, 0, true));
XTERM_SEQUENCES.set("|[g", getRGBXterm(0, 5, 0, true));
XTERM_SEQUENCES.set("|[y", getRGBXterm(5, 5, 0, true));
XTERM_SEQUENCES.set("|[b", getRGBXterm(0, 0, 5, true));
XTERM_SEQUENCES.set("|[m", getRGBXterm(5, 0, 5, true));
XTERM_SEQUENCES.set("|[c", getRGBXterm(0, 5, 5, true));
XTERM_SEQUENCES.set("|[w", getRGBXterm(5, 5, 5, true));

// Matchers
const XTERM_COLOR_REGEX = /\|\[?([0-5])([0-5])([0-5])/g;
const XTERM_GRAYSCALE_REGEX = /\|\[?=([a-z])/g;
const XTERM_BGSUB_REGEX = new RegExp(
  "(" +
    "xrgybmcw"
      .split("")
      .map(val => `\\|\\[${val}`)
      .join("|") +
    ")",
  "g"
);

module.exports = {
  getRGBXterm,
  getGrayscaleXterm,
  XTERM_SEQUENCES,
  XTERM_COLOR_REGEX,
  XTERM_GRAYSCALE_REGEX,
  XTERM_BGSUB_REGEX
};
