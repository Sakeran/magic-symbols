# magic-symbols

**magic-symbols** is a color syntax and parser for ANSI and Xterm256 colors, created with MU* and similar text games in mind. The syntax is inspired by and adapted from the implementation used by the [Evennia](https://github.com/evennia/evennia) MUD library.

## Installation

```
npm install magic-symbols
```

## Usage

**magic-symbols** implements two main functions: `parse` and `strip`.

```js
const { parse, strip } = require('magic-symbols');

const coloredString = "|rhello world";

parse(coloredString); // "\u001b[31mhello world"

strip(coloredString); // "hello world"

parse(coloredString, false) // (Parsed in ANSI-only mode)
```

## Syntax

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
