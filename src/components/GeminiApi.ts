import { GoogleGenAI } from "@google/genai";
import { load } from "std/dotenv/mod.ts";
import { basename, resolve } from "std/path/mod.ts";

await load({
  export: true,
});

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function GeminiLLM(prompt_path: string, pdfFile: File): Promise<string> {
  const prompt = await Deno.readTextFile(resolve(prompt_path));

  // Upload the PDF: sdk accepts path string or Blob/File objects
  let uploadedFile = await genAI.files.upload({
    file: pdfFile,
    config: {
      displayName: pdfFile.name,
      mimeType: pdfFile.type || "application/pdf",
    },
  });

  if (!uploadedFile.name) {
    throw new Error("Gemini upload did not return a file name.");
  }

  // Poll until Gemini finishes processing the asset (state become ACTIVE)
  while (uploadedFile.state === "PROCESSING") {
    await new Promise((r) => setTimeout(r, 500));
    uploadedFile = await genAI.files.get({ name: uploadedFile.name! });
  }

  if (uploadedFile.state !== "ACTIVE" || !uploadedFile.uri) {
    throw new Error(`Gemini file upload failed; state=${uploadedFile.state}`);
  }

  const response = await genAI.models.generateContent({
    model: "gemini-2.5-pro",
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            fileData: {
              fileUri: uploadedFile.uri,
              mimeType: uploadedFile.mimeType ?? "application/pdf",
            },
          },
        ],
      },
    ],
  });

  return JSON.stringify({
    promtp: prompt,
    file: {
      name: uploadedFile.name,
      uri: uploadedFile.uri,
      mimeType: uploadedFile.mimeType,
      sizeBytes: uploadedFile.sizeBytes,
    },
    candidates: response.candidates ?? [],
    usageMetadata: response.usageMetadata ?? null,
    promptFeedback: response.promptFeedback ?? null,
    text: response.text ?? "",
  });
}

// const pdfBytes = await Deno.readFile(resolve("PORTA_LILLI.pdf"));

// const pdfFile = new File([pdfBytes], basename("PORTA_LILLI.pdf"), {
//   type: "application/pdf",
// });

// const result = await GeminiLLM("prompt.txt", pdfFile);

// console.log(JSON.parse(result), null, 2);
