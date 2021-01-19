# magic-symbols

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

### Custom Syntax (Advanced)

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
});

// 'parse' and 'strip' are updated automatically to use
// the new syntax

const coloredString = "~rhello world";
parse(coloredString); // "\u001b[31mhello world"
strip(coloredString); // "hello world"
```

### Xterm256 Aliases (Advanced)

If a particular Xterm256 color code is commonly used, it may be useful to define a shorthand code for it. For instance, you may wish to map `|534` and `|[534` (pink) to `|p` and `|[p` respectively. To acheive this, the `setSyntax` method also accepts an `xtermAliases` object to specify (alias -> code) pairings.

Note that aliases only affect standard Xterm256 colors, and will not affect Xterm256 Grayscale or basic ANSI colors. Additionally, aliases must be distinct from the default color codes. In particular, the following single-character codes may not be used as aliases: `x, r, g, y, b, m, c, w`, or their uppercased variants.

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

    // Sea Green
    sg: "141",
    
    // Orange
    o: "410"
  }
});

// 'parse' and 'strip' are updated automatically to use
// the new syntax

const coloredString = "|phello world";
parse(coloredString); // "\u001b[38;5;218mhello world"
```