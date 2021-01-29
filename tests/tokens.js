const expect = require("expect.js");

const { tokenize } = require("../src/init_parser").init_parser({
  xtermAliases: {
    // Pink
    p: "534",
    // Sea Green
    sg: "141",
  },
});

describe("tokenization", () => {
  it("Tokenizes tokenless strings", () => {
    const str = "one two three";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql(["one two three"]);
  });

  it("Tokenizes simple ANSI tokens", () => {
    const str = "|rred red red";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql(["|r", "red red red"]);
  });

  it("Tokenizes simple ANSI tokens not at the start", () => {
    const str = "red |rred red";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql(["red ", "|r", "red red"]);
  });

  it("Tokenizes simple XTERM strings", () => {
    const str = "|511red red red";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql(["|511", "red red red"]);
  });

  it("Tokenizes simple XTERM tokens not at the start", () => {
    const str = "red |[511red red |=fgray";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql(["red ", "|[511", "red red ", "|=f", "gray"]);
  });

  it("Tokenizes simple escaped symbols", () => {
    const str = "||rred red red";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql(["||", "rred red red"]);
  });

  it("Tokenizes custom XTERM symbols", () => {
    const str = "|ppink |rred |sgsea green";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql(["|p", "pink ", "|r", "red ", "|sg", "sea green"]);
  });

  it("Tokenizes multiple ANSI tokens", () => {
    const str = "|rred |bblue blue";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql(["|r", "red ", "|b", "blue blue"]);
  });

  it("Tokenizes multiple XTERM tokens", () => {
    const str = "|511red |115blue |[cblue";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql(["|511", "red ", "|115", "blue ", "|[c", "blue"]);
  });

  it("Tokenizes multiple escaped tokens", () => {
    const str = "||511red ||115blue blue";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql(["||", "511red ", "||", "115blue blue"]);
  });

  it("Tokenizes recall symbols", () => {
    const str = "|rred |<1recalled |bblue |<91recall";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql([
      "|r",
      "red ",
      "|<1",
      "recalled ",
      "|b",
      "blue ",
      "|<9",
      "1recall",
    ]);
  });

  it("Tokenizes multiple mixed tokens", () => {
    const str = "normal |rred |Ccyan |511red |<3recalled |[115blue ||rescaped";

    const tokenized = tokenize(str);
    expect(tokenized).to.eql([
      "normal ",
      "|r",
      "red ",
      "|C",
      "cyan ",
      "|511",
      "red ",
      "|<3",
      "recalled ",
      "|[115",
      "blue ",
      "||",
      "rescaped",
    ]);
  });
});
