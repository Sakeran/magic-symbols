"use strict";

const { init_ansi_mappings } = require("./mappings/ansi");
const { init_xterm_mappings } = require("./mappings/xterm");

function init_parser(mappings) {
  // Ensure every required symbol is set
  const symbols = normalize_mappings(mappings);

  const SYNTAX_ESCAPE = symbols.escape_symbol;
  const SYNTAX_UNESCAPE = symbols.unescape_symbol;

  const ANSI = init_ansi_mappings(symbols);
  const XTERM = init_xterm_mappings(symbols);

  function parseAnsi(string) {
    return string.replace(ANSI.REGEX, (m) => ANSI.SEQUENCES.get(m));
  }

  function parseXterm(string) {
    return string
      .replace(XTERM.COLOR_REGEX, (m) => XTERM.SEQUENCES.get(m))
      .replace(XTERM.GRAYSCALE_REGEX, (m) => XTERM.SEQUENCES.get(m))
      .replace(XTERM.BGSUB_REGEX, (m) => XTERM.SEQUENCES.get(m));
  }

  function parseXtermFallback(string) {
    return string
      .replace(XTERM.COLOR_REGEX, (m) => XTERM.FALLBACK_SEQUENCES.get(m))
      .replace(XTERM.GRAYSCALE_REGEX, (m) => XTERM.FALLBACK_SEQUENCES.get(m))
      .replace(XTERM.BGSUB_REGEX, (m) => XTERM.FALLBACK_SEQUENCES.get(m));
  }

  function parse(string, xterm = true) {
    const handleXterm = xterm ? parseXterm : parseXtermFallback;
    return string
      .split(SYNTAX_ESCAPE)
      .map((ss) => handleXterm(parseAnsi(ss)))
      .join(SYNTAX_UNESCAPE);
  }

  function strip(string) {
    return string
      .split(SYNTAX_ESCAPE)
      .map((ss) =>
        ss
          .replace(ANSI.REGEX, "")
          .replace(XTERM.COLOR_REGEX, "")
          .replace(XTERM.GRAYSCALE_REGEX, "")
          .replace(XTERM.BGSUB_REGEX, "")
      )
      .join(SYNTAX_UNESCAPE);
  }

  return {
    parse,
    strip,
    parseAnsi,
    parseXterm,
    parseXtermFallback,
    ANSI,
    XTERM
  };
}

function normalize_mappings(mappings) {
  return Object.assign(
    {
      foreground_symbol: "|",
      foreground_grayscale_symbol: "|=",

      background_symbol: "|[",
      background_grayscale_symbol: "|[=",

      escape_symbol: "||",
      unescape_symbol: "|",

      no_hilite_symbol: "|!",

      xtermAliases: {}
    },
    mappings
  );
}

module.exports = { init_parser };
