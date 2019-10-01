"use strict";

const { ANSI_REGEX: AR } = require("./definitions");

function parse_ansi(string) {
  for (const [re, code] of AR) {
    string = string.replace(re, code);
  }
  return string;
}

module.exports = {
  parse_ansi
};
