"use strict";

const { ANSI_SYNTAX, ANSI_REGEX, SYNTAX_ESCAPE } = require("./definitions");

function parseAnsi(string) {
  return string
    .split(SYNTAX_ESCAPE)
    .map(ss => ss.replace(ANSI_REGEX, m => ANSI_SYNTAX[m]))
    .join("|");
}

module.exports = {
  parseAnsi
};
