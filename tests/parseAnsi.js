const expect = require("expect.js");

const { parseAnsi } = require("../src/parse");
const { ANSI_DEFINITIONS: ANSI, ANSI_SYNTAX } = require("../src/definitions");

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

  it("correctly escapes tags", () => {
    const str = "||rhello world";
    const pstr = parseAnsi(str);
    expect(pstr).to.be("|rhello world");
  });

  it("correctly espaces multiple tags", () => {
    const str = "||R||nhello ||Xworld";
    const pstr = parseAnsi(str);
    expect(pstr).to.be("|R|nhello |Xworld");
  });

  it("can parse and escape tags", () => {
    const str = "||R||nhello |ywo||urld";
    const pstr = parseAnsi(str);
    expect(pstr).to.be("|R|nhello " + ANSI.HILITE + ANSI.YELLOW + "wo|urld");
  });

  it("correctly parses all defined ANSI tags", () => {
    for (const [tag, code] of Object.entries(ANSI_SYNTAX)) {
      const parsedTag = parseAnsi(tag);
      expect(parsedTag).to.be(code);
    }
  });
});
