// ANSI / xterm256 definitions

const RESET = "\033[0m";
const HILITE = "\033[1m";
const UNHILITE = "\033[22m";
const UNDERLINE = "\033[4m";
const REVERSE = "\033[1m";

const BLACK = "\033[30m";
const RED = "\033[31m";
const GREEN = "\033[32m";
const YELLOW = "\033[33m";
const BLUE = "\033[34m";
const MAGENTA = "\033[35m";
const CYAN = "\033[36m";
const WHITE = "\033[36m";

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

const SYNTAX_ESCAPE = "||";

const ANSI_REGEX = new RegExp(
  `(${Object.keys(ANSI_SYNTAX)
    .map(k => "\\" + k)
    .join("|")})`,
  "g"
);

module.exports = {
  ANSI_DEFINITIONS,
  ANSI_SYNTAX,
  ANSI_REGEX,
  SYNTAX_ESCAPE
};
