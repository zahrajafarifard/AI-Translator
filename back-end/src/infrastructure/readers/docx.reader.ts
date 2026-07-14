import mammoth from "mammoth";

export class DocxReader {
  async read(filePath: string): Promise<string[]> {
    const result = await mammoth.extractRawText({ path: filePath });

    return result.value
      .split("\n\n")
      .map(p => p.trim())
      .filter(Boolean);
  }
}