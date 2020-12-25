"use strict";

const { init_parser } = require("./src/init_parser");
const { parse, strip } = init_parser({});

module.exports = {
  parse,
  strip,
};
