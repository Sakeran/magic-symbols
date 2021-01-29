function escapeRegExp(string) {
  // Escape special symbols if needed
  // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = escapeRegExp;
