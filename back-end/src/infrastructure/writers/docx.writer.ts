import { Document, Packer, Paragraph, TextRun } from "docx";
import { writeFile } from "node:fs/promises";

export class DocxWriter {
  async write(outputPath: string, paragraphs: string[]): Promise<void> {
    const doc = new Document({
      sections: [
        {
          children: paragraphs.map(
            (p: string) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: p,
                    color: "000000",
                    rightToLeft: true,
                    bold: true,
                    size: 24,
                  }),
                ],
                alignment: "right",
                autoSpaceEastAsianText: true,
                spacing: {
                  after: 200,
                },
                // bidirectional: true,
              }),
          ),
        },
      ],
    });

    const buffer: Buffer = await Packer.toBuffer(doc);

    await writeFile(outputPath, buffer);
  }
}
