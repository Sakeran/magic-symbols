const expect = require("expect.js");
const { ANSI_DEFINITIONS: ANSI, ESCAPE } = require("../src/definitions");

const { parse } = require("../src/init_parser").init_parser({});

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

  it("Can recall the previous color with recall syntax", () => {
    const str = "|rred |bblue |<1red";
    const equiv = "|rred |bblue |rred";

    const pstr = parse(str);
    const equivstr = parse(equiv);

    expect(pstr).to.eql(equivstr);
  });

  it("Returns first color when recall syntax is out of range", () => {
    const str = "|rred |bblue |<8red";
    const equiv = "|rred |bblue |rred";

    const pstr = parse(str);
    const equivstr = parse(equiv);

    expect(pstr).to.eql(equivstr);
  });

  it("Returns empty string if no colors are in the stack and recall token is used ", () => {
    const str = "This has no colors|<2";
    const equiv = "This has no colors";

    const pstr = parse(str);
    const equivstr = parse(equiv);

    expect(pstr).to.eql(equivstr);
  });

  it("Can recall the last 9 colors with recall syntax", () => {
    const base =
      "|345 out-of-range" + // dropped
      "|r red" + // 9
      "|b blue" + // 8
      "|555 xterm" + // 7
      "|[432 xterm-bg" + // 6
      "|=x xterm-gs" + // 5
      "||r escaped/ignored" + // ignored
      "|[c xterm-cyan" + // 4
      "|[R red-bg" + // 3
      "|333 xterm-gray" + // 2
      "|[444 xterm-bg-gray" + // 1
      "|g green"; // Current

    // 9
    let str = base + "|<9 red";
    let equiv = base + "|r red";

    let pstr = parse(str);
    let equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    // 8
    str = base + "|<8 blue";
    equiv = base + "|b blue";

    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    // 7
    str = base + "|<7 xterm";
    equiv = base + "|555 xterm";

    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    // 6
    str = base + "|<6 xterm-bg";
    equiv = base + "|[432 xterm-bg";

    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    // 5
    str = base + "|<5 xterm-gs";
    equiv = base + "|=x xterm-gs";

    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    // 4
    str = base + "|<4 xterm-cyan";
    equiv = base + "|[c xterm-cyan";

    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    // 3
    str = base + "|<3 red-bg";
    equiv = base + "|[R red-bg";

    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    // 2
    str = base + "|<2 xterm-gray";
    equiv = base + "|333 xterm-gray";

    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    // 1
    str = base + "|<1 xterm-bg-gray";
    equiv = base + "|[444 xterm-bg-gray";

    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);
  });

  it("Can recall with multiple tokens with ansi", () => {
    const base =
      "|r bold-red" +
      "|R red" +
      "|y bold-yellow" + // |<9
      "|Y yellow" + // |<8
      "|g bold-green" + // |<7
      "|G green" + // |<6
      "|b bold-blue" + // |<5
      "|B blue" + // |<4
      "|c bold-cyan" + // |<3
      "|C cyan" + // |<2
      "|m bold-magenta" + // |<1
      "|M magenta"; // Current

    let str, equiv, pstr, equivstr;

    str = base + "|<3|<3|<2 yellow";
    equiv = base + "|c|G|Y yellow";
    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    str = base + "|<2|<3|<3 yellow";
    equiv = base + "|C|b|Y yellow";
    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    str = base + "|<3|<2|<3 yellow";
    equiv = base + "|c|b|Y yellow";
    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    str = base + "|<1|<1|<1|<1|<1|<1|<1|<1|<1 bold-yellow";
    equiv = base + "|m|C|c|B|b|G|g|Y|y bold-yellow";
    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);

    str = base + "|<2 cyan |<3 Blue |<3 yellow";
    equiv = base + "|C cyan |b Blue |Y yellow";
    pstr = parse(str);
    equivstr = parse(equiv);
    expect(pstr).to.eql(equivstr);
  });
});
