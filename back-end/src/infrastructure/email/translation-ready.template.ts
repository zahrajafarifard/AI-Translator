export function translationReadyTemplate(downloadUrl: string) {
  return `
    <h2>Your translation is ready!</h2>

    <p>Your document has been translated successfully.</p>

    <a href="${downloadUrl}">
      Download your document
    </a>

    <p>This link is available while your document exists on the server.</p>
  `;
}