const expect = require("expect.js");
const { ANSI_DEFINITIONS: ANSI, ESCAPE } = require("../src/definitions");
const { parse } = require("../src/parse");

// Test helper for generating an xterm sequence.
const xterm = (number, bg = false) => `${ESCAPE}[${bg ? 4 : 3}8;5;${number}m`;

describe("parse", () => {
  it("returns a string", () => {
    const str = "hello world";
    const pstr = parse(str);
    expect(pstr).to.be.a("string");
  });

  it("parses normal ANSI tags", () => {
    const str = "|rh|Yello w|[Gor|nld";
    const pstr = parse(str);
    expect(pstr).to.be(
      ANSI.HILITE +
        ANSI.RED +
        "h" +
        ANSI.UNHILITE +
        ANSI.YELLOW +
        "ello w" +
        ANSI.BACK_GREEN +
        "or" +
        ANSI.RESET +
        "ld"
    );
  });

  it("parses xterm color and grayscale tags", () => {
    const str = "|[123he|=bll|[=ao |543world";
    const pstr = parse(str);

    expect(pstr).to.be(
      xterm(16 + 36 * 1 + 6 * 2 + 3, true) +
        "he" +
        xterm(134 + "b".charCodeAt(0), false) +
        "ll" +
        xterm(16, true) +
        "o " +
        xterm(16 + 36 * 5 + 6 * 4 + 3, false) +
        "world"
    );
  });

  it("can mix normal ansi and xterm", () => {
    const str = "|[=bhe|rllo |[Gwo|123rld";
    const pstr = parse(str);

    expect(pstr).to.be(
      xterm(134 + "b".charCodeAt(0), true) +
        "he" +
        ANSI.HILITE +
        ANSI.RED +
        "llo " +
        ANSI.BACK_GREEN +
        "wo" +
        xterm(16 + 36 * 1 + 6 * 2 + 3, false) +
        "rld"
    );
  });

  it("can escape ansi codes", () => {
    const str = "||rhello world";
    const pstr = parse(str);
    expect(pstr).to.be("|rhello world");
  });

  it("can escape multiple ansi codes", () => {
    const str = "||rhel||[Rlo w||[go||Yrld";
    const pstr = parse(str);
    expect(pstr).to.be("|rhel|[Rlo w|[go|Yrld");
  });

  it("can escape xterm codes", () => {
    const str = "||=xhello world";
    const pstr = parse(str);
    expect(pstr).to.be("|=xhello world");
  });

  it("can escape multiple xterm codes", () => {
    const str = "||=xhe||321ll||[542o w||[=zorld";
    const pstr = parse(str);
    expect(pstr).to.be("|=xhe|321ll|[542o w|[=zorld");
  });

  it("can escape both ansi and xterm codes", () => {
    const str = "||rh||[Re||=xl||[=tlo ||123wo||[321rld";
    const pstr = parse(str);
    expect(pstr).to.be("|rh|[Re|=xl|[=tlo |123wo|[321rld");
  });

  it("can escape and parse ansi", () => {
    const str = "||rhel|rlo world";
    const pstr = parse(str);
    expect(pstr).to.be("|rhel" + ANSI.HILITE + ANSI.RED + "lo world");
  });

  it("can escape and parse xterm", () => {
    const str = "||500hel|500lo world";
    const pstr = parse(str);
    expect(pstr).to.be("|500hel" + xterm(16 + 36 * 5 + 6 * 0 + 0) + "lo world");
  });

  it("can escape and parse both xterm and ansi", () => {
    const str = "||500hel|500lo ||rwor|rld";
    const pstr = parse(str);

    expect(pstr).to.be(
      "|500hel" +
        xterm(16 + 36 * 5 + 6 * 0 + 0) +
        "lo |rwor" +
        ANSI.HILITE +
        ANSI.RED +
        "ld"
    );
  });

  it("converts bright ansi backgrounds to xterm by default", () => {
    const str = "|[mhello world";
    const pstr = parse(str);
    expect(pstr).to.be(xterm(16 + 36 * 5 + 6 * 0 + 5, true) + "hello world");
    expect(pstr).to.not.contain(ANSI.HILITE);
    expect(pstr).to.not.contain(ANSI.MAGENTA);
  });

  it("can fall back to ansi when xterm is turned off", () => {
    let str = "|500hello world";
    let pstr = parse(str, false);
    expect(pstr).to.not.contain(xterm(16 + 36 * 5 + 6 * 0 + 0));
    expect(pstr).to.be(ANSI.HILITE + ANSI.RED + "hello world");
    
    str = "|[005hello world";
    pstr = parse(str, false);
    expect(pstr).to.not.contain(xterm(16 + 36 * 0 + 6 * 0 + 5, true));
    expect(pstr).to.be(ANSI.BACK_BLUE + "hello world");
    
    str = "|=fhello world";
    pstr = parse(str, false);
    expect(pstr).to.not.contain(xterm(134 + "f".charCodeAt(0)));
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");
    
    str = "|[=yhello world";
    pstr = parse(str, false);
    expect(pstr).to.not.contain(xterm(134 + "y".charCodeAt(0), true));
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");
  });
});
