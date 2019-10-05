const expect = require("expect.js");
const { ANSI_DEFINITIONS: ANSI } = require("../src/definitions");
const { parseXterm } = require("../src/parse");
const { getRGBXterm, getGrayscaleXterm } = require("../src/mappings/xterm");

// It's painful to exhaustively list all 256 colors with variables,
// so we'll just check that the following sequence (with some number)
// exists within each result.
const xColor = number => `;${number}m`;

describe("getRGBXterm", () => {
  it("returns a string", () => {
    const res = getRGBXterm(0, 0, 0);
    expect(res).to.be.a("string");
  });

  it("returns output with the correct color", () => {
    // NOTE = color = 16 + 36*r + 6*g + b
    expect(getRGBXterm(0, 0, 0)).to.contain(xColor(16));
    expect(getRGBXterm(2, 3, 4)).to.contain(xColor(16 + 36 * 2 + 6 * 3 + 4));
    expect(getRGBXterm(5, 4, 3)).to.contain(xColor(16 + 36 * 5 + 6 * 4 + 3));
    expect(getRGBXterm(5, 5, 5)).to.contain(xColor(16 + 36 * 5 + 6 * 5 + 5));
  });

  it("returns white when given an invalid color", () => {
    expect(getRGBXterm(-1, 0, 0)).to.contain(xColor(7));
    expect(getRGBXterm(0, -1, 0)).to.contain(xColor(7));
    expect(getRGBXterm(0, 0, -1)).to.contain(xColor(7));
    expect(getRGBXterm(6, 0, 0)).to.contain(xColor(7));
    expect(getRGBXterm(0, 6, 0)).to.contain(xColor(7));
    expect(getRGBXterm(0, 0, 6)).to.contain(xColor(7));
  });

  it("can return a foreground sequence", () => {
    expect(getRGBXterm(0, 0, 0, false)).to.contain(`[38;5;`);
    expect(getRGBXterm(1, 2, 3, false)).to.contain(`[38;5;`);
    expect(getRGBXterm(5, 5, 5, false)).to.contain(`[38;5;`);
  });

  it("can return a background sequence", () => {
    expect(getRGBXterm(0, 0, 0, true)).to.contain(`[48;5;`);
    expect(getRGBXterm(1, 2, 3, true)).to.contain(`[48;5;`);
    expect(getRGBXterm(5, 5, 5, true)).to.contain(`[48;5;`);
  });
});

describe("getGrayscaleXterm", () => {
  it("returns a string", () => {
    const res = getGrayscaleXterm("a");
    expect(res).to.be.a("string");
  });

  it("returns output with the correct value", () => {
    expect(getGrayscaleXterm("a")).to.contain(xColor(16));
    expect(getGrayscaleXterm("b")).to.contain(xColor(134 + "b".charCodeAt(0)));
    expect(getGrayscaleXterm("y")).to.contain(xColor(134 + "y".charCodeAt(0)));
    expect(getGrayscaleXterm("z")).to.contain(xColor(231));
  });

  it("returns white when given an invalid value", () => {
    expect(getGrayscaleXterm("aa")).to.contain(xColor(7));
    expect(getGrayscaleXterm("1")).to.contain(xColor(7));
    expect(getGrayscaleXterm("0a")).to.contain(xColor(7));
    expect(getGrayscaleXterm("zz")).to.contain(xColor(7));
  });

  it("can return a foreground sequence", () => {
    expect(getGrayscaleXterm("a", false)).to.contain(`[38;5;`);
    expect(getGrayscaleXterm("t", false)).to.contain(`[38;5;`);
    expect(getGrayscaleXterm("z", false)).to.contain(`[38;5;`);
  });

  it("can return a background sequence", () => {
    expect(getGrayscaleXterm("a", true)).to.contain(`[48;5;`);
    expect(getGrayscaleXterm("t", true)).to.contain(`[48;5;`);
    expect(getGrayscaleXterm("z", true)).to.contain(`[48;5;`);
  });
});

describe("xterm-parse", () => {
  it("returns an untagged string unmodified", () => {
    const str = "hello world";
    const pstr = parseXterm(str);
    expect(pstr).to.be("hello world");
  });

  it("can parse a single foreground color", () => {
    const str = "|000hello world";
    const pstr = parseXterm(str);
    expect(pstr).to.contain(`[38;5;`);
    expect(pstr).to.contain(xColor(16));
    expect(pstr).to.contain("hello world");
  });

  it("can parse multiple colors", () => {
    const str = "|000hel|123lo world";
    const pstr = parseXterm(str);
    expect(pstr).to.contain(xColor(16));
    expect(pstr).to.contain("hel");
    expect(pstr).to.contain(xColor(16 + 36 * 1 + 6 * 2 + 3));
    expect(pstr).to.contain("lo world");
  });

  it("can parse background colors", () => {
    const str = "|[000hello world";
    const pstr = parseXterm(str);
    expect(pstr).to.contain(`[48;5;`);
    expect(pstr).to.contain(xColor(16));
    expect(pstr).to.contain("hello world");
  });

  it("can parse foreground and background colors", () => {
    const str = "|[000h|123ello world";
    const pstr = parseXterm(str);
    expect(pstr).to.contain(`[48;5;`);
    expect(pstr).to.contain(xColor(16));
    expect(pstr).to.contain("h");
    expect(pstr).to.contain(`[38;5;`);
    expect(pstr).to.contain(xColor(16 + 36 * 1 + 6 * 2 + 3));
    expect(pstr).to.contain("ello world");
  });

  it("can parse greyscale foregrounds (|a)", () => {
    const str = "|=ahello world";
    const pstr = parseXterm(str);
    expect(pstr).to.contain(`[38;5;`);
    expect(pstr).to.contain(xColor(16));
    expect(pstr).to.contain("hello world");
  });

  it("can parse greyscale foregrounds (|z)", () => {
    const str = "|=zhello world";
    const pstr = parseXterm(str);
    expect(pstr).to.contain(`[38;5;`);
    expect(pstr).to.contain(xColor(231));
    expect(pstr).to.contain("hello world");
  });

  it("can parse greyscale foregrounds (|b-y)", () => {
    let str = "|=bhe|=gllo wo|=yrld";
    let pstr = parseXterm(str);
    expect(pstr).to.contain(`[38;5;`);
    expect(pstr).to.contain(xColor(134 + "b".charCodeAt(0)));
    expect(pstr).to.contain("he");
    expect(pstr).to.contain(xColor(134 + "g".charCodeAt(0)));
    expect(pstr).to.contain("llo wo");
    expect(pstr).to.contain(xColor(134 + "y".charCodeAt(0)));
    expect(pstr).to.contain("rld");
  });

  it("can parse greyscale backgrounds (|a)", () => {
    const str = "|[=ahello world";
    const pstr = parseXterm(str);
    expect(pstr).to.contain(`[48;5;`);
    expect(pstr).to.contain(xColor(16));
    expect(pstr).to.contain("hello world");
  });

  it("can parse greyscale backgrounds (|z)", () => {
    const str = "|[=zhello world";
    const pstr = parseXterm(str);
    expect(pstr).to.contain(`[48;5;`);
    expect(pstr).to.contain(xColor(231));
    expect(pstr).to.contain("hello world");
  });

  it("can parse greyscale backgrounds (|b-y)", () => {
    let str = "|[=bhe|[=gllo wo|[=yrld";
    let pstr = parseXterm(str);
    expect(pstr).to.contain(`[48;5;`);
    expect(pstr).to.contain(xColor(134 + "b".charCodeAt(0)));
    expect(pstr).to.contain("he");
    expect(pstr).to.contain(xColor(134 + "g".charCodeAt(0)));
    expect(pstr).to.contain("llo wo");
    expect(pstr).to.contain(xColor(134 + "y".charCodeAt(0)));
    expect(pstr).to.contain("rld");
  });

  it("can parse greyscale backgounds and foregrounds", () => {
    const str = "|[=vh|=fel|[=xlo wo|=drld";
    const pstr = parseXterm(str);
    expect(pstr).to.contain(`[48;5;`);
    expect(pstr).to.contain(xColor(134 + "v".charCodeAt(0)));
    expect(pstr).to.contain("h");
    expect(pstr).to.contain(`[38;5;`);
    expect(pstr).to.contain(xColor(134 + "f".charCodeAt(0)));
    expect(pstr).to.contain("el");
    expect(pstr).to.contain(xColor(134 + "x".charCodeAt(0)));
    expect(pstr).to.contain("lo wo");
    expect(pstr).to.contain(xColor(134 + "d".charCodeAt(0)));
    expect(pstr).to.contain("rld");
  });

  it("can mix greyscale and colors", () => {
    const str = "|[123h|=hel|[=ylo wo|543rld";
    const pstr = parseXterm(str);
    expect(pstr).to.contain(`[48;5;`);
    expect(pstr).to.contain(xColor(16 + 36 * 1 + 6 * 2 + 3));
    expect(pstr).to.contain("h");
    expect(pstr).to.contain(`[38;5;`);
    expect(pstr).to.contain(xColor(134 + "h".charCodeAt(0)));
    expect(pstr).to.contain("el");
    expect(pstr).to.contain(xColor(134 + "y".charCodeAt(0)));
    expect(pstr).to.contain("lo wo");
    expect(pstr).to.contain(xColor(16 + 36 * 5 + 6 * 4 + 3));
    expect(pstr).to.contain("rld");
  });

  it("converts bright ansi backgrounds to xterm", () => {
    const str = "|[rhello world";
    const pstr = parseXterm(str);
    expect(pstr).to.contain(`[48;5;`);
    expect(pstr).to.contain(xColor(16 + 36 * 5 + 6 * 0 + 0));
    expect(pstr).to.not.contain(ANSI.HILITE);
    expect(pstr).to.not.contain(ANSI.RED);
    expect(pstr).to.contain('hello world');
  });

  it("doesn't convert normal ansi backgrounds to xterm", () => {
    const str = "|rhello world";
    const pstr = parseXterm(str);
    expect(pstr).to.be('|rhello world');
  });
  
});
