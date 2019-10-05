"use strict";

const { SYNTAX_ESCAPE, SYNTAX_UNESCAPE } = require("./definitions");

const { ANSI_SEQUENCES, ANSI_REGEX } = require("./mappings/ansi");

const {
  XTERM_SEQUENCES,
  XTERM_COLOR_REGEX,
  XTERM_GRAYSCALE_REGEX,
  XTERM_BGSUB_REGEX
} = require("./mappings/xterm");

const { XTERM_FALLBACKS } = require("./mappings/xtermFallbacks");

function parse(string, xterm = true) {
  const handleXterm = xterm ? parseXterm : parseXtermFallback;
  return string
    .split(SYNTAX_ESCAPE)
    .map(ss => handleXterm(parseAnsi(ss)))
    .join(SYNTAX_UNESCAPE);
}

function parseAnsi(string) {
  return string.replace(ANSI_REGEX, m => ANSI_SEQUENCES.get(m));
}

function parseXterm(string) {
  return string
    .replace(XTERM_COLOR_REGEX, m => XTERM_SEQUENCES.get(m))
    .replace(XTERM_GRAYSCALE_REGEX, m => XTERM_SEQUENCES.get(m))
    .replace(XTERM_BGSUB_REGEX, m => XTERM_SEQUENCES.get(m));
}

function parseXtermFallback(string) {
  return string
    .replace(XTERM_COLOR_REGEX, m => XTERM_FALLBACKS.get(m))
    .replace(XTERM_GRAYSCALE_REGEX, m => XTERM_FALLBACKS.get(m))
    .replace(XTERM_BGSUB_REGEX, m => XTERM_FALLBACKS.get(m));
}

module.exports = {
  parse,
  parseAnsi,
  parseXterm,
  parseXtermFallback
};
