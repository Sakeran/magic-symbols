const expect = require("expect.js");

const { strip } = require("../src/parse");

describe("strip", () => {
  it("returns a string", () => {
    const str = "hello world";
    const pstr = strip(str);
    expect(pstr).to.be.a("string");
  });

  it("strips normal ANSI tags", () => {
    const str = "|rhello world";
    const pstr = strip(str);
    expect(pstr).to.be("hello world");
  });

  it("strips multiple normal ANSI tags", () => {
    const str = "|rhe|[Rll|go |Gwo|hr|uld|n";
    const pstr = strip(str);
    expect(pstr).to.be("hello world");
  });

  it("strips xterm tags", () => {
    const str = "|123hello world";
    const pstr = strip(str);
    expect(pstr).to.be("hello world");
  });

  it("strips multiple xterm tags", () => {
    const str = "|123h|[321el|[rl|=eo w|[=zorld";
    const pstr = strip(str);
    expect(pstr).to.be("hello world");
  });
});
