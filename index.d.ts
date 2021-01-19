declare module 'magic-symbols';

declare function parse(string: string, xterm: boolean): string;

declare function strip(string: string): string;

export interface IMagicSymbolConfig {
	foreground_symbol?: string;
	foreground_grayscale_symbol?: string;
	background_symbol?: string;
	background_grayscale_symbol?: string;
	escape_symbol?: string;
	unescape_symbol?: string;
  no_hilite_symbol?: string;
  xtermAliases?: IMagicSymbolXtermAliases
}

export interface IMagicSymbolXtermAliases {
  [key: string]: string;
}

declare function setSyntax(syntaxObject: IMagicSymbolConfig): void;
