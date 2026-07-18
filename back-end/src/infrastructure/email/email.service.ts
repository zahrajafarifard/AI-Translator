import { transporter } from "./mailer.js";
import { translationReadyTemplate } from "./translation-ready.template.js";

export class EmailService {
  async sendTranslationReadyEmail(email: string, downloadUrl: string) {
    await transporter.sendMail({
      to: email,
      subject: "Your translation is ready",
      html: translationReadyTemplate(downloadUrl),
    });
  }
}
