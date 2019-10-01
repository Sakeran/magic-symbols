// ANSI / xterm256 definitions

const RESET = "\u001b[0m";
const HILITE = "\u001b[1m";
const UNHILITE = "\u001b[22m";
const UNDERLINE = "\u001b[4m";
const REVERSE = "\u001b[1m";

const BLACK = "\u001b[30m";
const RED = "\u001b[31m";
const GREEN = "\u001b[32m";
const YELLOW = "\u001b[33m";
const BLUE = "\u001b[34m";
const MAGENTA = "\u001b[35m";
const CYAN = "\u001b[36m";
const WHITE = "\u001b[36m";

const ANSI_DEFINITIONS = {
  RESET,
  HILITE,
  UNHILITE,
  UNDERLINE,
  REVERSE,
  BLACK,
  RED,
  GREEN,
  YELLOW,
  BLUE,
  MAGENTA,
  CYAN,
  WHITE
};

ANSI_SYNTAX = {
  "|n": RESET,
  "|u": UNDERLINE,

  "|h": HILITE,
  "|H": UNHILITE,

  "|x": HILITE + BLACK,
  "|r": HILITE + RED,
  "|g": HILITE + GREEN,
  "|y": HILITE + YELLOW,
  "|b": HILITE + BLUE,
  "|m": MAGENTA,
  "|c": HILITE + CYAN,
  "|w": HILITE + WHITE,

  "|X": UNHILITE + BLACK,
  "|R": UNHILITE + RED,
  "|G": UNHILITE + GREEN,
  "|Y": UNHILITE + YELLOW,
  "|B": UNHILITE + BLUE,
  "|M": UNHILITE + MAGENTA,
  "|C": UNHILITE + CYAN,
  "|W": UNHILITE + WHITE
};

const ANSI_REGEX = Object.entries(ANSI_SYNTAX).map(([symbol, code]) => [
  new RegExp(`\\${symbol}`, "g"),
  code
]);

module.exports = {
  ANSI_DEFINITIONS,
  ANSI_SYNTAX,
  ANSI_REGEX
};
