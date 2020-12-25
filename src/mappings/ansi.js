"use strict";

const { ANSI_DEFINITIONS: ANSI } = require("../definitions");

function init_ansi_mappings(symbols) {

    // Determine the symbols
    const fg = symbols.foreground_symbol;
    const bg = symbols.background_symbol;
    const nhl = symbols.no_hilite_symbol;

    
    // Build a map of all possible ANSI sequences
    const SEQUENCES = new Map();

    SEQUENCES.set(`${fg}n`, ANSI.RESET);
    SEQUENCES.set(`${fg}u`, ANSI.UNDERLINE);

    SEQUENCES.set(`${fg}h`, ANSI.HILITE);
    SEQUENCES.set(`${fg}H`, ANSI.UNHILITE);

    SEQUENCES.set(`${fg}x`, ANSI.HILITE + ANSI.BLACK);
    SEQUENCES.set(`${fg}r`, ANSI.HILITE + ANSI.RED);
    SEQUENCES.set(`${fg}g`, ANSI.HILITE + ANSI.GREEN);
    SEQUENCES.set(`${fg}y`, ANSI.HILITE + ANSI.YELLOW);
    SEQUENCES.set(`${fg}b`, ANSI.HILITE + ANSI.BLUE);
    SEQUENCES.set(`${fg}m`, ANSI.HILITE + ANSI.MAGENTA);
    SEQUENCES.set(`${fg}c`, ANSI.HILITE + ANSI.CYAN);
    SEQUENCES.set(`${fg}w`, ANSI.HILITE + ANSI.WHITE);

    SEQUENCES.set(`${fg}X`, ANSI.UNHILITE + ANSI.BLACK);
    SEQUENCES.set(`${fg}R`, ANSI.UNHILITE + ANSI.RED);
    SEQUENCES.set(`${fg}G`, ANSI.UNHILITE + ANSI.GREEN);
    SEQUENCES.set(`${fg}Y`, ANSI.UNHILITE + ANSI.YELLOW);
    SEQUENCES.set(`${fg}B`, ANSI.UNHILITE + ANSI.BLUE);
    SEQUENCES.set(`${fg}M`, ANSI.UNHILITE + ANSI.MAGENTA);
    SEQUENCES.set(`${fg}C`, ANSI.UNHILITE + ANSI.CYAN);
    SEQUENCES.set(`${fg}W`, ANSI.UNHILITE + ANSI.WHITE);

    SEQUENCES.set(`${bg}X`, ANSI.BACK_BLACK);
    SEQUENCES.set(`${bg}R`, ANSI.BACK_RED);
    SEQUENCES.set(`${bg}G`, ANSI.BACK_GREEN);
    SEQUENCES.set(`${bg}Y`, ANSI.BACK_YELLOW);
    SEQUENCES.set(`${bg}B`, ANSI.BACK_BLUE);
    SEQUENCES.set(`${bg}M`, ANSI.BACK_MAGENTA);
    SEQUENCES.set(`${bg}C`, ANSI.BACK_CYAN);
    SEQUENCES.set(`${bg}W`, ANSI.BACK_WHITE);

    SEQUENCES.set(`${nhl}X`, ANSI.BLACK);
    SEQUENCES.set(`${nhl}R`, ANSI.RED);
    SEQUENCES.set(`${nhl}G`, ANSI.GREEN);
    SEQUENCES.set(`${nhl}Y`, ANSI.YELLOW);
    SEQUENCES.set(`${nhl}B`, ANSI.BLUE);
    SEQUENCES.set(`${nhl}M`, ANSI.MAGENTA);
    SEQUENCES.set(`${nhl}C`, ANSI.CYAN);
    SEQUENCES.set(`${nhl}W`, ANSI.WHITE);

    // Create REGEX Matcher

    const REGEX = new RegExp(
      `(${[...SEQUENCES.keys()]
        .map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")})`,
      "g"
    );

    return {
        SEQUENCES,
        REGEX
    }
}

module.exports = {
    init_ansi_mappings
}