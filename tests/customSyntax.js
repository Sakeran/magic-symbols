const expect = require("expect.js");

const { init_parser } = require("../src/init_parser");
const { parse } = init_parser({});

const CUSTOM = {
  foreground_symbol: "~",
  foreground_grayscale_symbol: "~.",

  background_symbol: "~(",
  background_grayscale_symbol: "~(.",

  escape_symbol: "~~",
  unescape_symbol: "~",
};

const ALIASES = {
  xtermAliases: {
    // Pink
    p: "534",
    // Sea Green
    sg: "141",
  },
};

const { parse: customParse } = init_parser(CUSTOM);

const { parse: aliasParse } = init_parser(ALIASES);

describe("custom-syntax", () => {
  it("Can handle custom syntax", () => {
    const standard = parse("|rhe|=al|[333lo |[=gworld");
    const custom = customParse("~rhe~.al~(333lo ~(.gworld");

    expect(standard).to.equal(custom);
  });

  it("Properly handles escapes", () => {
    const result = customParse("~~rhello ~~(.world");
    expect(result).to.equal("~rhello ~(.world");
  });

  it("Can specify xterm aliases", () => {
    const standardSyntax = "|534pink |[534bgpink |141seagreen |[141bgseagreen";
    const aliasSyntax = "|ppink |[pbgpink |sgseagreen |[sgbgseagreen";

    // With xterm
    let standard = parse(standardSyntax);
    let aliased = aliasParse(aliasSyntax);

    expect(standard).to.equal(aliased);

    // With fallbacks
    standard = parse(standardSyntax, false);
    aliased = aliasParse(aliasSyntax, false);

    expect(standard).to.equal(aliased);

    // Escapes
    const escaped = aliasParse("||pescapedpink ||sgescapedseagreen");
    expect(escaped).to.equal("|pescapedpink |sgescapedseagreen");

    // Mixed case
    standard = parse("|rred |321xterm |534pink |=igrayscale");
    aliased = aliasParse("|rred |321xterm |ppink |=igrayscale");

    expect(standard).to.equal(aliased);
  });
});
