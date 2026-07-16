import pLimit from "p-limit";
import { OllamaTranslateService } from "../../infrastructure/llm/ollama-translate.service.js";

export interface TranslatedParagraph {
  index: number;
  original: string;
  translated: string;
}

export class TranslationPipelineService {
  private readonly translator: OllamaTranslateService;
  private readonly limit = pLimit(2); // CPU-safe concurrency

  constructor() {
    this.translator = new OllamaTranslateService();
  }

  async translateParagraphs(
    paragraphs: string[],
  ): Promise<TranslatedParagraph[]> {
    const tasks = paragraphs.map((paragraph, index) =>
      this.limit(async (): Promise<TranslatedParagraph> => {
        const translated = await this.translator.translate(paragraph);

        return {
          index,
          original: paragraph,
          translated,
        };
      }),
    );

    return Promise.all(tasks);
  }
}
