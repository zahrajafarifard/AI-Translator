import PDFDocument from "pdfkit";
import { createWriteStream } from "node:fs";
import path from "node:path";

const fontPath = path.resolve(process.cwd(), "src/fonts/Vazir-Medium.ttf");

export class PdfWriter {
  write(outputPath: string, paragraphs: string[]): void {
    const doc = new PDFDocument();
    doc.font(fontPath); // Set a Persian-friendly font
    const stream = createWriteStream(outputPath);
    doc.pipe(stream);

    paragraphs.forEach((paragraph: string) => {
      doc.text(paragraph, { align: "right" }); // Persian-friendly alignment
      doc.moveDown();
    });

    doc.end();
  }
}
