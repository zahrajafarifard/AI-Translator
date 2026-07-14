import JSZip from "jszip";
import { readFile, writeFile } from "node:fs/promises";

const WORD_TEXT_PART_PATTERN =
  /^word\/(?:document|header\d+|footer\d+|footnotes|endnotes|comments)\.xml$/;
const PARAGRAPH_PATTERN = /<w:p\b[\s\S]*?<\/w:p>/g;
const TEXT_RUN_PATTERN = /<w:t\b([^>]*)>([\s\S]*?)<\/w:t>/g;
const DRAWING_PATTERN = /<w:drawing\b[\s\S]*?<\/w:drawing>/g;

export class DocxLayoutTranslator {
  async read(filePath: string): Promise<string[]> {
    const zip = await this.loadDocx(filePath);
    const texts: string[] = [];

    for (const partName of this.getTextPartNames(zip)) {
      const xml = await zip.file(partName)?.async("string");

      if (!xml) {
        continue;
      }

      for (const paragraph of xml.match(PARAGRAPH_PATTERN) ?? []) {
        const text = this.getParagraphText(paragraph);

        if (this.shouldTranslate(text)) {
          texts.push(text);
        }
      }
    }

    return texts;
  }

  async writeTranslatedCopy(
    inputPath: string,
    outputPath: string,
    translations: string[],
  ): Promise<void> {
    const zip = await this.loadDocx(inputPath);
    let translationIndex = 0;

    for (const partName of this.getTextPartNames(zip)) {
      const file = zip.file(partName);
      const xml = await file?.async("string");

      if (!xml) {
        continue;
      }

      const updatedXml = xml.replace(PARAGRAPH_PATTERN, (paragraph) => {
        const text = this.getParagraphText(paragraph);
        const mirroredParagraph = this.mirrorParagraphLayoutForRtl(paragraph);

        if (!this.shouldTranslate(text)) {
          return mirroredParagraph;
        }

        const translation = translations[translationIndex++];

        if (translation === undefined) {
          throw new Error("Missing translated text for DOCX paragraph");
        }

        return this.replaceParagraphText(mirroredParagraph, translation);
      });

      zip.file(partName, updatedXml);
    }

    if (translationIndex !== translations.length) {
      throw new Error(
        `DOCX translation count mismatch. Used ${translationIndex} of ${translations.length} translations.`,
      );
    }

    const buffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    await writeFile(outputPath, buffer);
  }

  private async loadDocx(filePath: string): Promise<JSZip> {
    const buffer = await readFile(filePath);

    return JSZip.loadAsync(buffer);
  }

  private getTextPartNames(zip: JSZip): string[] {
    return Object.keys(zip.files)
      .filter((partName) => WORD_TEXT_PART_PATTERN.test(partName))
      .sort((a, b) => {
        if (a === "word/document.xml") {
          return -1;
        }

        if (b === "word/document.xml") {
          return 1;
        }

        return a.localeCompare(b);
      });
  }

  private getParagraphText(paragraphXml: string): string {
    return [...paragraphXml.matchAll(TEXT_RUN_PATTERN)]
      .map((match) => this.decodeXml(match[2] ?? ""))
      .join("");
  }

  private shouldTranslate(text: string): boolean {
    return /[A-Za-z]/.test(text);
  }

  private replaceParagraphText(
    paragraphXml: string,
    translatedText: string,
  ): string {
    const textRuns = [...paragraphXml.matchAll(TEXT_RUN_PATTERN)].map(
      (match) => this.decodeXml(match[2] ?? ""),
    );
    const translatedParts = this.splitTextAcrossRuns(translatedText, textRuns);
    let textRunIndex = 0;
    const translatedParagraph = paragraphXml.replace(
      TEXT_RUN_PATTERN,
      (_match, attributes: string) => {
        const translatedPart = translatedParts[textRunIndex++] ?? "";
        const escapedTranslation = this.encodeXml(translatedPart);
        const updatedAttributes = translatedPart
          ? this.ensurePreserveSpace(attributes)
          : attributes;

        return `<w:t${updatedAttributes}>${escapedTranslation}</w:t>`;
      },
    );

    return this.ensureRtlRuns(this.ensureParagraphRtl(translatedParagraph));
  }

  private splitTextAcrossRuns(text: string, originalRuns: string[]): string[] {
    const translated = text.trim();
    const nonEmptyRuns = originalRuns
      .map((run, index) => ({ index, length: run.trim().length }))
      .filter((run) => run.length > 0);

    if (nonEmptyRuns.length <= 1) {
      return originalRuns.map((run) => (run.trim() ? translated : ""));
    }

    const parts = originalRuns.map(() => "");
    const totalOriginalLength = nonEmptyRuns.reduce(
      (sum, run) => sum + run.length,
      0,
    );
    let remainingText = translated;

    nonEmptyRuns.forEach((run, runIndex) => {
      const isLastRun = runIndex === nonEmptyRuns.length - 1;

      if (isLastRun) {
        parts[run.index] = remainingText.trim();
        return;
      }

      const targetLength = Math.max(
        1,
        Math.round((translated.length * run.length) / totalOriginalLength),
      );
      const splitIndex = this.findWordBoundary(remainingText, targetLength);

      parts[run.index] = remainingText.slice(0, splitIndex).trim();
      remainingText = remainingText.slice(splitIndex).trim();
    });

    return parts;
  }

  private findWordBoundary(text: string, targetLength: number): number {
    if (targetLength >= text.length) {
      return text.length;
    }

    const nextSpace = text.indexOf(" ", targetLength);
    const previousSpace = text.lastIndexOf(" ", targetLength);

    if (previousSpace > 0 && targetLength - previousSpace <= 12) {
      return previousSpace;
    }

    if (nextSpace > 0 && nextSpace - targetLength <= 12) {
      return nextSpace;
    }

    return targetLength;
  }

  private ensurePreserveSpace(attributes: string): string {
    if (/\bxml:space=/.test(attributes)) {
      return attributes;
    }

    return `${attributes} xml:space="preserve"`;
  }

  private ensureParagraphRtl(paragraphXml: string): string {
    if (/<w:pPr\b[\s\S]*?<w:bidi\b[\s\S]*?<\/w:pPr>/.test(paragraphXml)) {
      return paragraphXml;
    }

    if (/<w:pPr\b/.test(paragraphXml)) {
      return paragraphXml.replace(/(<w:pPr\b[^>]*>)/, "$1<w:bidi/>");
    }

    return paragraphXml.replace(/(<w:p\b[^>]*>)/, "$1<w:pPr><w:bidi/></w:pPr>");
  }

  private mirrorParagraphLayoutForRtl(paragraphXml: string): string {
    let updatedXml = paragraphXml
      .replace(/<w:jc\b[^>]*w:val="left"[^/]*\/>/g, '<w:jc w:val="right"/>')
      .replace(/<w:jc\b[^>]*w:val="start"[^/]*\/>/g, '<w:jc w:val="end"/>')
      .replace(/<wp:align>left<\/wp:align>/g, "<wp:align>right</wp:align>");

    if (this.hasDrawingWithoutText(updatedXml)) {
      updatedXml = this.ensureParagraphAlignment(updatedXml, "right");
    }

    return updatedXml.replace(DRAWING_PATTERN, (drawingXml) =>
      drawingXml.replace(
        /<wp:positionH([^>]*)><wp:posOffset>0<\/wp:posOffset><\/wp:positionH>/g,
        "<wp:positionH$1><wp:align>right</wp:align></wp:positionH>",
      ),
    );
  }

  private hasDrawingWithoutText(paragraphXml: string): boolean {
    return /<w:drawing\b/.test(paragraphXml) && !this.getParagraphText(paragraphXml).trim();
  }

  private ensureParagraphAlignment(paragraphXml: string, alignment: string): string {
    if (/<w:jc\b/.test(paragraphXml)) {
      return paragraphXml.replace(/<w:jc\b[^/]*\/>/, `<w:jc w:val="${alignment}"/>`);
    }

    if (/<w:pPr\b/.test(paragraphXml)) {
      return paragraphXml.replace(
        /(<w:pPr\b[^>]*>)/,
        `$1<w:jc w:val="${alignment}"/>`,
      );
    }

    return paragraphXml.replace(
      /(<w:p\b[^>]*>)/,
      `$1<w:pPr><w:jc w:val="${alignment}"/></w:pPr>`,
    );
  }

  private ensureRtlRuns(paragraphXml: string): string {
    return paragraphXml.replace(/<w:r\b[^>]*>[\s\S]*?<\/w:r>/g, (runXml) => {
      if (!/<w:t\b/.test(runXml) || /<w:rPr\b[\s\S]*?<w:rtl\b[\s\S]*?<\/w:rPr>/.test(runXml)) {
        return runXml;
      }

      if (/<w:rPr\b/.test(runXml)) {
        return runXml.replace(/(<w:rPr\b[^>]*>)/, "$1<w:rtl/>");
      }

      return runXml.replace(/(<w:r\b[^>]*>)/, "$1<w:rPr><w:rtl/></w:rPr>");
    });
  }

  private decodeXml(value: string): string {
    return value
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&amp;/g, "&");
  }

  private encodeXml(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
}
