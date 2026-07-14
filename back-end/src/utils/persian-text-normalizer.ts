const PERSIAN_OR_ARABIC_LETTER = "\u0600-\u06FF";
const PERSIAN_COMMA = "\u060C";
const PERSIAN_SEMICOLON = "\u061B";
const PERSIAN_QUESTION_MARK = "\u061F";
const PUNCTUATION = `${PERSIAN_COMMA}${PERSIAN_SEMICOLON}${PERSIAN_QUESTION_MARK}.!`;

export function normalizePersianText(text: string): string {
  return text
    .replace(/\u064A/g, "\u06CC")
    .replace(/\u0643/g, "\u06A9")
    .replace(new RegExp(`\\s+([${PUNCTUATION}])`, "g"), "$1")
    .replace(/,\s*/g, `${PERSIAN_COMMA} `)
    .replace(/;\s*/g, `${PERSIAN_SEMICOLON} `)
    .replace(/\?\s*/g, `${PERSIAN_QUESTION_MARK} `)
    .replace(
      new RegExp(`([${PUNCTUATION}])(?=[${PERSIAN_OR_ARABIC_LETTER}])`, "g"),
      "$1 ",
    )
    .replace(new RegExp(`\\s+([${PUNCTUATION}])`, "g"), "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}
