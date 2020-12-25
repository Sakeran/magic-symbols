'use strict';

// Base Definitions

const ESCAPE = "\u001b";

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
const WHITE = "\u001b[37m";

const BACK_BLACK = "\u001b[40m";
const BACK_RED = "\u001b[41m";
const BACK_GREEN = "\u001b[42m";
const BACK_YELLOW = "\u001b[43m";
const BACK_BLUE = "\u001b[44m";
const BACK_MAGENTA = "\u001b[45m";
const BACK_CYAN = "\u001b[46m";
const BACK_WHITE = "\u001b[47m";

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

module.exports = {
  ESCAPE,
  ANSI_DEFINITIONS
};
