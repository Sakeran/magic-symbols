const expect = require("expect.js");

const { init_parser } = require("../src/init_parser");
const { parse } = require("../src/parse");

const CUSTOM = {
  foreground_symbol: "~",
  foreground_grayscale_symbol: "~.",

  background_symbol: "~(",
  background_grayscale_symbol: "~(.",

  escape_symbol: "~~",
  unescape_symbol: "~",
};

const { parse: customParse } = init_parser(CUSTOM);

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
});
