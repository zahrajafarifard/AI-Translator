import { readFile } from "node:fs/promises";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

type PdfTextItem = {
  str: string;
  transform?: number[];
  width?: number;
  height?: number;
  hasEOL?: boolean;
};

type TextFragment = {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type TextLine = {
  fragments: TextFragment[];
  y: number;
  height: number;
  text: string;
};

export class PdfReader {
  async read(filePath: string): Promise<string[]> {
    const buffer = await readFile(filePath);
    const uint8 = new Uint8Array(buffer);

    const pdf = await pdfjs.getDocument({ data: uint8 }).promise;
    const paragraphs: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      paragraphs.push(...this.extractPageParagraphs(content.items as PdfTextItem[]));
    }

    return paragraphs.filter(Boolean);
  }

  private extractPageParagraphs(items: PdfTextItem[]): string[] {
    const lines = this.extractLines(items);
    const paragraphs: string[] = [];
    let paragraph = "";
    let previousLine: TextLine | undefined;

    for (const line of lines) {
      const text = line.text.trim();

      if (!text) {
        continue;
      }

      if (!previousLine) {
        paragraph = text;
        previousLine = line;
        continue;
      }

      if (this.startsNewParagraph(previousLine, line)) {
        if (paragraph.trim()) {
          paragraphs.push(paragraph.trim());
        }

        paragraph = text;
      } else if (paragraph.endsWith("-")) {
        paragraph = `${paragraph.slice(0, -1)}${text}`;
      } else {
        paragraph = `${paragraph} ${text}`;
      }

      previousLine = line;
    }

    if (paragraph.trim()) {
      paragraphs.push(paragraph.trim());
    }

    return paragraphs;
  }

  private extractLines(items: PdfTextItem[]): TextLine[] {
    const lines: TextLine[] = [];

    for (const item of items) {
      const text = item.str ?? "";

      if (!text.trim()) {
        continue;
      }

      const transform = item.transform ?? [];
      const x = Number(transform[4] ?? 0);
      const y = Number(transform[5] ?? 0);
      const height = Math.abs(Number(transform[3] ?? item.height ?? 0)) || 10;
      const width = Math.abs(Number(item.width ?? 0));
      const fragment: TextFragment = { text, x, y, width, height };
      const line = this.findLine(lines, fragment);

      if (line) {
        line.fragments.push(fragment);
        line.y = (line.y + y) / 2;
        line.height = Math.max(line.height, height);
      } else {
        lines.push({
          fragments: [fragment],
          y,
          height,
          text: "",
        });
      }
    }

    return lines
      .sort((a, b) => b.y - a.y)
      .map((line) => ({
        ...line,
        text: this.joinLineFragments(line),
      }));
  }

  private findLine(
    lines: TextLine[],
    fragment: TextFragment,
  ): TextLine | undefined {
    return lines.find((line) => {
      const tolerance = Math.max(2, line.height * 0.5, fragment.height * 0.5);

      return Math.abs(line.y - fragment.y) <= tolerance;
    });
  }

  private joinLineFragments(line: TextLine): string {
    const fragments = [...line.fragments].sort((a, b) => a.x - b.x);
    let joined = "";
    let previousEnd = 0;

    for (const fragment of fragments) {
      const text = fragment.text.replace(/\s+/g, " ");

      if (!text.trim()) {
        continue;
      }

      const gap = fragment.x - previousEnd;
      const needsSpace =
        joined.length > 0 &&
        gap > line.height * 0.2 &&
        !joined.endsWith(" ") &&
        !/^[,.;:!?)]/.test(text);

      joined += `${needsSpace ? " " : ""}${text}`;
      previousEnd = fragment.x + fragment.width;
    }

    return joined.replace(/\s{2,}/g, " ").trim();
  }

  private startsNewParagraph(previousLine: TextLine, line: TextLine): boolean {
    const previousText = previousLine.text.trim();
    const text = line.text.trim();
    const verticalGap = Math.abs(previousLine.y - line.y);
    const expectedLineGap = Math.max(previousLine.height, line.height) * 1.35;

    if (verticalGap > expectedLineGap) {
      return true;
    }

    if (/^(\d+[\.)]|[-*•])\s+/.test(text)) {
      return true;
    }

    if (
      previousText.length <= 70 &&
      /^[A-Z0-9]/.test(text) &&
      !/[,:;]$/.test(previousText)
    ) {
      return true;
    }

    if (this.looksLikeHeading(previousLine, line)) {
      return true;
    }

    return false;
  }

  private looksLikeHeading(previousLine: TextLine, line: TextLine): boolean {
    const text = previousLine.text.trim();
    const words = text.split(/\s+/).filter(Boolean);
    const isLargerThanBody = previousLine.height > line.height * 1.25;

    return (
      isLargerThanBody &&
      words.length > 0 &&
      words.length <= 12 &&
      !/[.!?:;]$/.test(text)
    );
  }
}
