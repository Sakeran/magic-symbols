# magic-symbols

## Table of Contents
- [magic-symbols](#magic-symbols)
  * [Installation](#installation)
  * [Usage](#usage)
  * [Syntax](#syntax)
    + [ANSI Colors](#ansi-colors)
    + [Xterm256](#xterm256)
  * [Advanced Syntax](#advanced-syntax)
    + [Recall Symbols](#recall-symbols)
    + [Custom Syntax](#custom-syntax)
    + [Xterm256 Aliases](#xterm256-aliases)


**magic-symbols** is a color syntax and parser for ANSI and Xterm256 colors, created with MU\* and similar text games in mind. The syntax is inspired by and adapted from the implementation used by the [Evennia](https://github.com/evennia/evennia) MUD library.

## Installation

```
npm install magic-symbols
```

## Usage

**magic-symbols** implements two main functions: `parse` and `strip`.

```js
const { parse, strip } = require("magic-symbols");

const coloredString = "|rhello world";

parse(coloredString); // "\u001b[31mhello world"

strip(coloredString); // "hello world"

parse(coloredString, false); // (Parsed in ANSI-only mode)

// Escape sequences with '||'

const escapedString = "||rhello world";

parse(escapedString); // "|rhello world"

strip(escapedString); // "hello world"
```

## Syntax

Note: See the _Custom Syntax_ section for information on customizing the parser syntax.

### ANSI Colors

Setting ANSI colors inline is easiest with the **|{letter}** notation. The color's brightness depends on the case of the letter:

Uppercased letters are automatically un-highlighted.

- **|X** Un-Highlighted Black (Note - This is often invisible on termimals.)
- **|R** Un-Highlighted Red
- **|G** Un-Highlighted Green
- **|Y** Un-Highlighted Yellow
- **|B** Un-Highlighted Blue
- **|M** Un-Highlighted Magenta
- **|C** Un-Highlighted Cyan
- **|W** Un-Highlighted White

Lowercased letters are automatically highlighted.

- **|x** Highlighted Black
- **|r** Highlighted Red
- **|g** Highlighted Green
- **|y** Highlighted Yellow
- **|b** Highlighted Blue
- **|m** Highlighted Magenta
- **|c** Highlighted Cyan
- **|w** Highlighted White

To set the background color in ANSI, use the **|[{letter}** notation, using the same colors as with foregrounds.

- **|[X** Un-Highlighted Black Background
- **|[R** Un-Highlighted Red Background
- **|[G** Un-Highlighted Green Background
- **|[Y** Un-Highlighted Yellow Background
- **|[B** Un-Highlighted Blue Background
- **|[M** Un-Highlighted Magenta Background
- **|[C** Un-Highlighted Cyan Background
- **|[W** Un-Highlighted White Background

Note that by default, normal ANSI does not allow for highlighted background colors. We "fake" these colors by relying on the Xterm256 implementation, but if the parser is run in ANSI-only mode these will fall back to the un-highlighted versions above.

- **|[x** Highlighted Black Background
- **|[r** Highlighted Red Background
- **|[g** Highlighted Green Background
- **|[y** Highlighted Yellow Background
- **|[b** Highlighted Blue Background
- **|[m** Highlighted Magenta Background
- **|[c** Highlighted Cyan Background
- **|[w** Highlighted White Background

If we want to handle colors and highlighting manually, we can use the '|!{letter} syntax.

- **|!X** Black
- **|!R** Red
- **|!G** Green
- **|!Y** Yellow
- **|!B** Blue
- **|!M** Magenta
- **|!C** Cyan
- **|!W** White

To control the colors' brightness, we can use the 'highlight' and 'unhighlight' tags:

- **|h** Highlight
- **|H** Un-Highlight

We can reset all color information with the 'reset' tag.

- **|n** Reset / Normal

Text can also be underlined with the 'underline' tag:

- **|u** Underline

### Xterm256

Xterm256 tags come in two main flavors: a 6x6x6 color cube, and a range of grayscale values. (It also defines the 16 original ANSI colors, but we handle those with the above ANSI syntax).

Rather than with letters, we select Xterm colors with the |RGB notation, where R, G, and B are each integers between 0 and 5, and determine the intensity of each color.

(Examples)

- **|500** - Bright Red
- **|505** - Bright Magenta
- **|444** - Light Gray

To set these colors as backgrounds, we use the background notation |[RGB.

(Examples)

- **|[500** - Bright Red Background
- **|[505** - Bright Magenta Background
- **|[444** - Light Gray Background

We can also select between 26 different grayscale values using the notation |={letter}, where the letter can be any lowercase letter from a to z.

(Examples)

- **|=a** Black (darkest value)
- **|=m** Gray (medium value)
- **|=z** White (lightest value)

We can of course set the background to these colors with the |[={letter} notation:

(Examples)

- **|[=a** Black Background (darkest value)
- **|[=m** Gray Background (medium value)
- **|[=z** White Background (lightest value)

## Advanced Syntax

### Recall Symbols

When parsing a string, **magic-symbols** will "remember" the color symbols it processed. It is possible to refer to these symbols via the "recall symbol", which is `|<d` by default, where `d` is any integer on the [1-9] interval. For example, `|<1` will resolve to whichever symbol was used one step before the "current" symbol. Likewise, `|<5` will resolve to the symbol used 5 steps before the current symbol. You can also change recall symbols like `|<1|<2|<3` that would yield the same result at `|<6`. (Note that if the process hasn't seen `(d+1)` symbols yet, the recall symbol will be ignored.)

```js
// A simple example that resolves to the "previous" color symbol.
// We want the text in the middle to be blue, before "reverting" to red.
const coloredString = "|r(this is red) |b(this is blue) |<1(this is also red)";
const resolvesTo = "|r(this is red) |b(this is blue) |r(this is also red)";

parse(coloredString) === parse(resolvesTo); // true
```

In most cases it would be better to simply write the explicit color code, but in certain cases (such as string concatenation), we might know that we want to repeat _a_ color, but not _which_ color.

This feature is fairly dumb, and will always resolve to the symbol used exactly `d` steps ago (including resolved recall symbols), whether or not that symbol makes sense in the current position. Additionally, the symbol's behavior of resolving to an empty string (when there is insufficient history for it) can cause side effects if used carelessly.

### Custom Syntax

**magic-symbols** additionally exposes a `setSyntax` method that allows the user to specify the character sequences that mark the start of a particular color tag. There are seven such sequences in total, and each of them must be defined in the syntax definition object. Any missing symbol will be replaced with the default `|`-based equivalent.

While the sequences are not required to be related to one another, note that the parser will replace the `escape_symbol` with the `unescape_symbol`. Therefore, it is usually simplest to have every sequence begin with some common leading character, and use two of that character for your escape (e.g. using `||` to escape `|` ).

Note: To reset the syntax to default, simply pass in an empty object ( `setSyntax({})` ).

```js
const { parse, setSyntax } = require("magic-symbols");

// Example
// Set the syntax to one based on the '~' character.

setSyntax({
  // Foreground Symbol ( Default: "|" )
  foreground_symbol: "~",

  // Foreground Grayscale Symbol ( Default: "|=" )
  foreground_grayscale_symbol: "~-",

  // Background Symbol: ( Default: "|[" )
  background_symbol: "~:",

  // Background Grayscale Symbol ( Default: "|[=" )
  background_grayscale_symbol: "~:-",

  // No Hilite Symbol ( Default: "|!" )
  no_hilite_symbol: "~+",

  // Escape Symbol ( Default: "||" )
  escape_symbol: "~~",

  // Unescape Symbol ( Default: "|" )
  unescape_symbol: "~",

  // Recall Symbol ( Default: "|<")
  recall_symbol: "~<",
});

// 'parse' and 'strip' are updated automatically to use
// the new syntax

const coloredString = "~rhello world";
parse(coloredString); // "\u001b[31mhello world"
strip(coloredString); // "hello world"
```

### Xterm256 Aliases

If a particular Xterm256 color code is commonly used, it may be useful to define a shorthand code for it. For instance, you may wish to map `|534` and `|[534` (pink) to `|p` and `|[p` respectively. To acheive this, the `setSyntax` method also accepts an `xtermAliases` object to specify (alias -> code) pairings.

Note that there are some limitations and side-effects to keep in mind when defining aliases.

- Aliases may not overwrite existing color codes. This includes Xterm256 Grayscale and basic ANSI colors such as `|r`.
- Xterm256 codes and aliases will be parsed before ANSI codes. Therefore it is possible to define codes like `|bg` for blue-green, and the alias will take priority over `|b`.
- Longer aliases will be considered before shorter ones. For example, `|sa` will be consdered before `|s`, if both are defined. However, keep in mind...
- Defining multiple codes with common prefixes can lead to unexpected behavior. For example, suppose both `|s` and `|sa` were defined as separate aliases. Because the longer code is parsed first, the text `|salmond` will be parsed as `lmond`, even if this is not the preferred behavior.

In general, it is safest to stick to single-character codes that are distinct from the default ANSI codes. That is, try to avoid codes starting with: `x, r, g, y, b, m, c, w`, or their uppercased variants. If defining a multi-letter code, make sure that no other code is a prefix for it, and that it won't accidentally occur when a shorter code is placed before plain text, like in the 'almond' example. (One way to avoid this might be to add a terminating symbol like `;` or `-` to the custom code; see below for an example.)

```js
const { parse, setSyntax } = require("magic-symbols");

// Example
// Add three "new" color codes to let us use
// pink, sea-green, and orange more easily.

setSyntax({
  // ... custom token syntax ...

  xtermAliases: {
    // Pink
    p: "543",

    // Sea Green (Note: See above for warning about multi-letter codes)
    "sg;": "141",

    // Orange
    o: "410",
  },
});

// 'parse' and 'strip' are updated automatically to use
// the new syntax

const coloredString = "|phello world";
parse(coloredString); // "\u001b[38;5;218mhello world"
```
