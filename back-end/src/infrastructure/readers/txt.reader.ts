import { readFile } from "node:fs/promises";

export class TxtReader {
  async read(filePath: string): Promise<string[]> {
    const content = await readFile(filePath, "utf8");

    return content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }
}
