import axios from "axios";
import { ollamaConfig } from "../../config/ollama.config.js";
import { normalizePersianText } from "../../utils/persian-text-normalizer.js";

export class OllamaTranslateService {
  private endpoint = ollamaConfig.endpoint;
  private model = ollamaConfig.model;

  async translate(paragraph: string): Promise<string> {
    const prompt = `
    You are a professional English (en) to Farsi (Fa) translator. Your goal is to accurately convey the meaning and nuances of the original English text while adhering to Farsi grammar, vocabulary, and cultural sensitivities.
    Produce only the Farsi translation, without any additional explanations or commentary. Please translate the following English text into Farsi:
    ${paragraph}`;

    const res = await axios.post(this.endpoint, {
      model: this.model,
      prompt,
      stream: false,
    });

    return normalizePersianText(res.data.response);
  }
}
