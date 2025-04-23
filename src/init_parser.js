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

  // Compile a "complete" Regular Expression for matching tokens
  const TOKEN_RE = new RegExp(
    `(${escapeRegExp(SYNTAX_ESCAPE)}|${escapeRegExp(SYNTAX_RECALL)}[1-9]|${XTERM.COLOR_REGEX
    }|${XTERM.GRAYSCALE_REGEX}|${XTERM.BGSUB_REGEX}|${ANSI.REGEX})`,
    "g"
  );

  // Mapping of recall symbols to offsets (e.g "|<4" => 4)
  const RECALL_SEQUENCES = new Map();
  for (let i = 1; i <= 9; i++) {
    RECALL_SEQUENCES.set(`${SYNTAX_RECALL}${i}`, i);
  }

  function parse(string, xterm = true) {
    // Simple stack implementation - newest items at the end
    const colorStack = [];

    let result = "";

    for (const token of tokenize(string)) {
      if (token === SYNTAX_ESCAPE) {
        result += SYNTAX_UNESCAPE;
        continue;
      }

      if (RECALL_SEQUENCES.has(token)) {
        const offset = RECALL_SEQUENCES.get(token);

        let recalledToken = "";
        if (offset <= colorStack.length) {
          for (let i = 0; i < offset; i++) {
            colorStack.pop();
          }

          recalledToken = colorStack[colorStack.length - 1] || "";
        } else {
          // If recall token is called an goes out of range,
          // attempt to use the first color in the stack.
          recalledToken = colorStack[0] || "";
          colorStack.length = 0;
        }

        if (XTERM.SEQUENCES.has(recalledToken)) {
          result += xterm
            ? XTERM.SEQUENCES.get(recalledToken)
            : XTERM.FALLBACK_SEQUENCES.get(recalledToken);
        } else if (ANSI.SEQUENCES.has(recalledToken)) {
          result += ANSI.SEQUENCES.get(recalledToken);
        }
        
        continue;
      }

      if (XTERM.SEQUENCES.has(token)) {
        colorStack.push(token);

        result += xterm
          ? XTERM.SEQUENCES.get(token)
          : XTERM.FALLBACK_SEQUENCES.get(token);
      } else if (ANSI.SEQUENCES.has(token)) {
        colorStack.push(token);

        result += ANSI.SEQUENCES.get(token);
      } else {
        result += token;
      }
    }

    return result;
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
    return string.split(TOKEN_RE).filter((p) => p.length);
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
