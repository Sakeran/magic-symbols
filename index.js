"use strict";

const { init_parser } = require("./src/init_parser");

let parser = null;

function parse(string, xterm = true) {
  if (!parser) {
    parser = init_parser({});
  }

  return parser.parse(string, xterm);
}

function strip(string) {
  if (!parser) {
    parser = init_parser({});
  }

  return parser.strip(string);
}

function setSyntax(syntaxObject) {
  if (typeof syntaxObject !== "object") {
    throw new TypeError("setSyntax: argument must be an object.");
  }

  parser = init_parser(syntaxObject)
}

module.exports = {
  parse,
  strip,
  setSyntax
};
