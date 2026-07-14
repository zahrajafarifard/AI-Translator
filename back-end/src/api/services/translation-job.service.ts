import path from "node:path";
import { existsSync } from "node:fs";

import { TranslationPipelineService } from "../../application/services/translation-pipeline.service.js";
import { DocxLayoutTranslator } from "../../infrastructure/docx/docx-layout-translator.js";
import { DocxReader } from "../../infrastructure/readers/docx.reader.js";
import { PdfReader } from "../../infrastructure/readers/pdf.reader.js";
import { TxtReader } from "../../infrastructure/readers/txt.reader.js";
import { DocxWriter } from "../../infrastructure/writers/docx.writer.js";
import { PdfWriter } from "../../infrastructure/writers/pdf.writer.js";

interface Reader {
  read(filePath: string): Promise<string[]>;
}

interface Writer {
  write(outputPath: string, paragraphs: string[]): Promise<void> | void;
}

async function translateParagraphs(
  paragraphs: string[],
  pipeline: TranslationPipelineService,
): Promise<string[]> {
  const results = await pipeline.translateParagraphs(paragraphs);

  return results.map(({ translated }) => translated);
}

function createReader(extension: string): Reader {
  switch (extension) {
    case ".pdf":
      return new PdfReader();

    case ".docx":
      return new DocxReader();

    case ".txt":
      return new TxtReader();

    default:
      throw new Error(`Unsupported input file type: ${extension}`);
  }
}

function createWriter(extension: string): Writer {
  switch (extension) {
    case ".pdf":
      return new PdfWriter();

    case ".docx":
    case "":
      return new DocxWriter();

    default:
      throw new Error(`Unsupported output file type: ${extension}`);
  }
}
export class TranslationJobService {
  async process(filePath: string) {
    const inputPath = path.resolve(filePath);
    console.log("inputPath", inputPath);

    if (!existsSync(inputPath)) {
      throw new Error(`File not found: ${inputPath}`);
    }

    const outputPath = path.resolve(
      "src",
      "uploads",
      "translated",
      `translated.docx`,
    );

    console.log("outputPath", outputPath);

    const inputExtension = path.extname(inputPath).toLowerCase();

    const outputExtension = path.extname(outputPath).toLowerCase();

    const pipeline = new TranslationPipelineService();

    // Preserve DOCX layout
    if (inputExtension === ".docx" && outputExtension === ".docx") {
      const translator = new DocxLayoutTranslator();

      const paragraphs = await translator.read(inputPath);

      const translated = await translateParagraphs(paragraphs, pipeline);

      await translator.writeTranslatedCopy(inputPath, outputPath, translated);

      return {
        status: "completed",
        outputPath,
      };
    }

    // Generic pipeline

    const reader = createReader(inputExtension);

    const writer = createWriter(outputExtension);

    const paragraphs = await reader.read(inputPath);

    const translated = await translateParagraphs(paragraphs, pipeline);

    await writer.write(outputPath, translated);

    return {
      status: "completed",
      outputPath,
    };
  }
}
