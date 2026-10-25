/** Longest word length of a poster title, so CSS can fit it to the column (`.title` in global.css). */
export const fit = (text: string) => `--len:${Math.max(...text.split(/\s+/).map((w) => w.length))}`;
