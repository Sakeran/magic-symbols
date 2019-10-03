// ANSI / xterm256 definitions

const ANSI_ESCAPE = "\033";

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
const WHITE = "\033[37m";

const BACK_BLACK = "\033[40m";
const BACK_RED = "\033[41m";
const BACK_GREEN = "\033[42m";
const BACK_YELLOW = "\033[43m";
const BACK_BLUE = "\033[44m";
const BACK_MAGENTA = "\033[45m";
const BACK_CYAN = "\033[46m";
const BACK_WHITE = "\033[47m";

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
  WHITE,
  BACK_BLACK,
  BACK_RED,
  BACK_GREEN,
  BACK_YELLOW,
  BACK_BLUE,
  BACK_MAGENTA,
  BACK_CYAN,
  BACK_WHITE
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
  "|W": UNHILITE + WHITE,

  "|[X": BACK_BLACK,
  "|[R": BACK_RED,
  "|[G": BACK_GREEN,
  "|[Y": BACK_YELLOW,
  "|[B": BACK_BLUE,
  "|[M": BACK_MAGENTA,
  "|[C": BACK_CYAN,
  "|[W": BACK_WHITE
};

const SYNTAX_ESCAPE = "||";
const SYNTAX_UNESCAPE = "|";

const ANSI_REGEX = new RegExp(
  `(${Object.keys(ANSI_SYNTAX)
    .map(k => "\\" + k.replace("[", "\\["))
    .join("|")})`,
  "g"
);

XTERM_COLOR_REGEX = /\|\[?([0-5])([0-5])([0-5])/g;
XTERM_GRAYSCALE_REGEX = /\|\[?=([a-z])/g;

module.exports = {
  ANSI_ESCAPE,
  ANSI_DEFINITIONS,
  ANSI_SYNTAX,
  SYNTAX_ESCAPE,
  SYNTAX_UNESCAPE,
  ANSI_REGEX,
  XTERM_COLOR_REGEX,
  XTERM_GRAYSCALE_REGEX
};
