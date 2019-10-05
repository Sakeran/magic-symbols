const expect = require("expect.js");

const { parseAnsi } = require("../src/parse");
const { ANSI_DEFINITIONS: ANSI } = require("../src/definitions");
const { ANSI_SEQUENCES } = require("../src/mappings/ansi");

describe("ansi-parse", () => {
  it("returns an untagged string unmodified", () => {
    const str = "hello world";
    const pstr = parseAnsi(str);
    expect(pstr).to.be("hello world");
  });

  it("correctly parses a single color", () => {
    // hilite red
    const str = "|rhello world";
    const pstr = parseAnsi(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.RED + "hello world");
  });

  it("correctly parses multiple colors", () => {
    // blue -> green
    const str = "|bhello |Gworld";
    const pstr = parseAnsi(str);
    expect(pstr).to.be(
      ANSI.HILITE + ANSI.BLUE + "hello " + ANSI.UNHILITE + ANSI.GREEN + "world"
    );
  });

  it("correcly highlights and unhughlights", () => {
    const str = "|Rhe|hllo |Hworld";
    const pstr = parseAnsi(str);
    expect(pstr).to.be(
      ANSI.UNHILITE +
        ANSI.RED +
        "he" +
        ANSI.HILITE +
        "llo " +
        ANSI.UNHILITE +
        "world"
    );
  });

  it("correctly resets text", () => {
    const str = "|xhello |nworld";
    const pstr = parseAnsi(str);
    expect(pstr).to.be(
      ANSI.HILITE + ANSI.BLACK + "hello " + ANSI.RESET + "world"
    );
  });

  it("correctly underlines text", () => {
    const str = "|uhello |nworld";
    const pstr = parseAnsi(str);
    expect(pstr).to.be(ANSI.UNDERLINE + "hello " + ANSI.RESET + "world");
  });

  it("can parse normal background tags", () => {
    const str = "|[Rhello world";
    const pstr = parseAnsi(str);
    expect(pstr).to.be(ANSI.BACK_RED + "hello world");
  });

  it("can parse multiple normal backround tags", () => {
    const str = "|[R|[Yhello |[Xworld";
    const pstr = parseAnsi(str);
    expect(pstr).to.be(
      ANSI.BACK_RED + ANSI.BACK_YELLOW + "hello " + ANSI.BACK_BLACK + "world"
    );
  });

  it("doesn't parse bright background tags", () => {
    const str = "|[rhello |[xworld";
    const pstr = parseAnsi(str);
    expect(pstr).to.be("|[rhello |[xworld");
  });

  it("correctly parses all defined ANSI tags", () => {
    for (const [tag, code] of ANSI_SEQUENCES.entries()) {
      const parsedTag = parseAnsi(tag);
      expect(parsedTag).to.be(code);
    }
  });
});
