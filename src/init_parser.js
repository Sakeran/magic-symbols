"use strict";

const { init_ansi_mappings } = require("./mappings/ansi");
const { init_xterm_mappings } = require("./mappings/xterm");
const escapeRegExp = require("./escape_re");

function init_parser(mappings) {
  // Ensure every required symbol is set
  const symbols = normalize_mappings(mappings);

  const SYNTAX_ESCAPE = symbols.escape_symbol;
  const SYNTAX_UNESCAPE = symbols.unescape_symbol;

  const SYNTAX_RECALL = symbols.recall_symbol;

  const ANSI = init_ansi_mappings(symbols);
  const XTERM = init_xterm_mappings(symbols);

  // Regular Expressions for parsing escapes/recalls
  const SYNTAX_ESCAPE_RE = new RegExp(`(${escapeRegExp(SYNTAX_ESCAPE)})`, "g");
  const SYNTAX_RECALL_RE = new RegExp(
    `(${escapeRegExp(SYNTAX_RECALL)}[1-9])`,
    "g"
  );

  // Mapping of recall symbols to offsets (e.g "|<4" => 4)
  const RECALL_SEQUENCES = new Map();
  for (let i = 1; i <= 9; i++) {
    RECALL_SEQUENCES.set(`${SYNTAX_RECALL}${i}`, i);
  }

  function parse(string, xterm = true) {
    const colorHistory = [];

    return tokenize(string)
      .map((token) => {
        if (token == SYNTAX_ESCAPE) {
          return SYNTAX_UNESCAPE;
        }

        if (RECALL_SEQUENCES.has(token)) {
          token =
            colorHistory[colorHistory.length - 1 - RECALL_SEQUENCES.get(token)];

          if (!token) {
            return "";
          }
        }

        if (XTERM.SEQUENCES.has(token)) {
          colorHistory.push(token);
          return xterm
            ? XTERM.SEQUENCES.get(token)
            : XTERM.FALLBACK_SEQUENCES.get(token);
        }

        if (ANSI.SEQUENCES.has(token)) {
          colorHistory.push(token);
          return ANSI.SEQUENCES.get(token);
        }

        return token;
      })
      .join("");
  }

  function strip(string) {
    return tokenize(string)
      .map((token) => {
        if (token == SYNTAX_ESCAPE) {
          return SYNTAX_UNESCAPE;
        }

        if (
          XTERM.SEQUENCES.has(token) ||
          ANSI.SEQUENCES.has(token) ||
          RECALL_SEQUENCES.has(token)
        ) {
          return "";
        }

        return token;
      })
      .join("");
  }

  function tokenize(string) {
    return string
      .split(SYNTAX_ESCAPE_RE)
      .flatMap((p) => p.split(SYNTAX_RECALL_RE))
      .flatMap((p) => p.split(XTERM.COLOR_REGEX))
      .flatMap((p) => p.split(XTERM.GRAYSCALE_REGEX))
      .flatMap((p) => p.split(XTERM.BGSUB_REGEX))
      .flatMap((p) => p.split(ANSI.REGEX))
      .filter((p) => p.length);
  }

  return {
    parse,
    strip,
    tokenize,
    ANSI,
    XTERM,
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

      recall_symbol: "|<",

      xtermAliases: {},
    },
    mappings
  );
}

module.exports = { init_parser };
