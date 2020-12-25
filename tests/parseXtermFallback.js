const expect = require("expect.js");
const { ANSI_DEFINITIONS: ANSI, ESCAPE } = require("../src/definitions");
const { parseXtermFallback } = require("../src/init_parser").init_parser({});

// Test helper for generating an xterm sequence.
const xterm = (number, bg = false) => `${ESCAPE}[${bg ? 4 : 3}8;5;${number}m`;

describe("xterm-fallback-parse", () => {
  it("returns a string result", () => {
    const str = "hello world";
    const pstr = parseXtermFallback(str);
    expect(pstr).to.be.a("string");
  });

  it("doesn't return xterm sequences", () => {
    const str = "|500hello world";
    const pstr = parseXtermFallback(str);
    expect(pstr).to.not.contain(xterm(16 + 36 * 5 + 6 * 0 + 0));
  });

  it("falls back to ansi when given xterm", () => {
    const str = "|500hello world";
    const pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.RED + "hello world");
  });

  it("parses grayscale RGB foregrounds", () => {
    let str = "|000hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.BLACK + "hello world");

    str = "|111hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|222hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|333hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.WHITE + "hello world");

    str = "|444hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.WHITE + "hello world");

    str = "|555hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.WHITE + "hello world");
  });

  it("parses grayscale RGB backgrounds", () => {
    let str = "|[000hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[111hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[222hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[333hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[444hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[555hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");
  });

  it("parses mostly-red RGB colors", () => {
    let str = "|100hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.RED + "hello world");

    str = "|201hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.RED + "hello world");

    str = "|321hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.RED + "hello world");

    str = "|423hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.RED + "hello world");

    str = "|544hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.RED + "hello world");
  });

  it("parses mostly-green RGB colors", () => {
    let str = "|010hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.GREEN + "hello world");

    str = "|121hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.GREEN + "hello world");

    str = "|032hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.GREEN + "hello world");

    str = "|142hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.GREEN + "hello world");

    str = "|250hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.GREEN + "hello world");
  });

  it("parses mostly-blue RGB colors", () => {
    let str = "|001hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.BLUE + "hello world");

    str = "|102hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.BLUE + "hello world");

    str = "|123hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLUE + "hello world");

    str = "|324hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLUE + "hello world");

    str = "|435hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLUE + "hello world");
  });

  it("parses red-green dominant RGB colors", () => {
    let str = "|110hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.YELLOW + "hello world");

    str = "|221hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.YELLOW + "hello world");

    str = "|332hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.YELLOW + "hello world");

    str = "|440hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.YELLOW + "hello world");

    str = "|554hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.YELLOW + "hello world");
  });

  it("parses red-blue dominant RGB colors", () => {
    let str = "|101hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.MAGENTA + "hello world");

    str = "|212hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.MAGENTA + "hello world");

    str = "|323hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.MAGENTA + "hello world");

    str = "|424hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.MAGENTA + "hello world");

    str = "|505hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.MAGENTA + "hello world");
  });

  it("parses green-blue dominant RGB colors", () => {
    let str = "|011hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.CYAN + "hello world");

    str = "|122hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.CYAN + "hello world");

    str = "|033hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.CYAN + "hello world");

    str = "|344hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.CYAN + "hello world");

    str = "|355hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.CYAN + "hello world");
  });

  it("parses mostly-red RGB background colors", () => {
    let str = "|[100hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_RED + "hello world");

    str = "|[210hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_RED + "hello world");

    str = "|[312hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_RED + "hello world");

    str = "|[433hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_RED + "hello world");

    str = "|[504hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_RED + "hello world");
  });

  it("parses mostly-green RGB background colors", () => {
    let str = "|[010hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_GREEN + "hello world");

    str = "|[020hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_GREEN + "hello world");

    str = "|[132hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_GREEN + "hello world");

    str = "|[340hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_GREEN + "hello world");

    str = "|[051hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_GREEN + "hello world");
  });

  it("parses mostly-blue RGB background colors", () => {
    let str = "|[001hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLUE + "hello world");

    str = "|[112hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLUE + "hello world");

    str = "|[203hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLUE + "hello world");

    str = "|[034hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLUE + "hello world");

    str = "|[445hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLUE + "hello world");
  });

  it("parses red-green RGB background colors", () => {
    let str = "|[110hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_YELLOW + "hello world");

    str = "|[221hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_YELLOW + "hello world");

    str = "|[331hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_YELLOW + "hello world");

    str = "|[442hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_YELLOW + "hello world");

    str = "|[550hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_YELLOW + "hello world");
  });

  it("parses red-blue RGB background colors", () => {
    let str = "|[101hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_MAGENTA + "hello world");

    str = "|[202hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_MAGENTA + "hello world");

    str = "|[323hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_MAGENTA + "hello world");

    str = "|[434hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_MAGENTA + "hello world");

    str = "|[525hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_MAGENTA + "hello world");
  });

  it("parses green-blue RGB background colors", () => {
    let str = "|[011hello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_CYAN + "hello world");

    str = "|[022hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_CYAN + "hello world");

    str = "|[233hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_CYAN + "hello world");

    str = "|[244hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_CYAN + "hello world");

    str = "|[255hello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_CYAN + "hello world");
  });

  it("Can parse grayscale foregrounds", () => {
    let str = "|=ahello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.BLACK + "hello world");

    str = "|=bhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.BLACK + "hello world");

    str = "|=chello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.BLACK + "hello world");

    str = "|=dhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.BLACK + "hello world");

    str = "|=ehello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.BLACK + "hello world");

    str = "|=fhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|=ghello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|=hhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|=ihello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|=jhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|=khello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|=lhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|=mhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|=nhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|=ohello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.BLACK + "hello world");

    str = "|=phello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.WHITE + "hello world");

    str = "|=qhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.WHITE + "hello world");

    str = "|=rhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.WHITE + "hello world");

    str = "|=shello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.WHITE + "hello world");

    str = "|=thello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.UNHILITE + ANSI.WHITE + "hello world");

    str = "|=uhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.WHITE + "hello world");

    str = "|=vhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.WHITE + "hello world");

    str = "|=whello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.WHITE + "hello world");

    str = "|=xhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.WHITE + "hello world");

    str = "|=yhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.WHITE + "hello world");

    str = "|=zhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.HILITE + ANSI.WHITE + "hello world");
  });

  it("Can parse grayscale backgrounds", () => {
    let str = "|[=ahello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=bhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=chello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=dhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=ehello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=fhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=ghello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=hhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=ihello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=jhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=khello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=lhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=mhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=nhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=ohello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_BLACK + "hello world");

    str = "|[=phello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[=qhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[=rhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[=shello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[=thello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[=uhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[=vhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[=whello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[=xhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[=yhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");

    str = "|[=zhello world";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_WHITE + "hello world");
  });

  it("parses bright ANSI backgrounds and falls back", () => {
    let str = "|[rhello world";
    let pstr = parseXtermFallback(str);
    expect(pstr).to.be(ANSI.BACK_RED + "hello world");

    str = "hello |[yworld";
    pstr = parseXtermFallback(str);
    expect(pstr).to.be("hello " + ANSI.BACK_YELLOW + "world");
  });
});
