/**
 * @fileoverview Google Gemini API integration for veterinary diagnostics PDF analysis.
 *
 * This module provides functionality to upload PDF documents to Google's Gemini AI
 * and generate content based on custom prompts. Designed for veterinary diagnostic
 * workflows where AI analysis of medical documents is required.
 *
 * @requires GEMINI_API_KEY environment variable to be set
 * @author MrBabylonian
 * @version 1.0.0
 */

import { GoogleGenAI } from "@google/genai";
import { load } from "std/dotenv/mod.ts";
import { resolve } from "std/path/mod.ts";

// Load environment variables from .env file
await load({
  export: true,
});

/** Google Gemini API key loaded from environment variables */
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

/**
 * Uploads a PDF file to Google Gemini and generates AI content based on a custom prompt.
 *
 * This function handles the complete workflow of:
 * 1. Reading a text prompt from the specified file path
 * 2. Uploading the PDF to Gemini's file API
 * 3. Polling until the file is processed and active
 * 4. Generating content using the Gemini model with the prompt and PDF
 * 5. Returning a comprehensive JSON response with all relevant data
 *
 * @param prompt_path - Relative or absolute path to the text file containing the AI prompt
 * @param pdfFile - File object representing the PDF to be analyzed (must be a valid PDF)
 *
 * @returns Promise<string> - JSON string containing:
 *   - prompt: The text prompt used for generation
 *   - file: Metadata about the uploaded PDF (name, URI, mimeType, sizeBytes)
 *   - candidates: Array of response candidates from Gemini
 *   - usageMetadata: Token usage and billing information
 *   - promptFeedback: Safety and content filtering feedback
 *   - text: The generated text response from Gemini
 *
 * @throws {Error} When GEMINI_API_KEY is not set
 * @throws {Error} When prompt file cannot be read
 * @throws {Error} When PDF upload fails or returns no file name
 * @throws {Error} When file processing fails or times out (after 120 seconds)
 * @throws {Error} When Gemini content generation fails
 *
 * @example
 * ```typescript
 * const pdfBytes = await Deno.readFile("medical_report.pdf");
 * const pdfFile = new File([pdfBytes], "medical_report.pdf", {
 *   type: "application/pdf",
 * });
 *
 * const result = await GeminiLLM("./prompts/diagnostic_prompt.txt", pdfFile);
 * const response = JSON.parse(result);
 * console.log(response.text); // AI-generated analysis
 * ```
 *
 * @since 1.0.0
 */
export async function GeminiLLM(
  prompt_path: string,
  pdfFile: File,
): Promise<string> {
  /** Read the prompt text from the specified file path */
  const prompt = await Deno.readTextFile(resolve(prompt_path));

  // Upload the PDF: sdk accepts path string or Blob/File objects
  /** Upload the PDF file to Gemini's file API for processing */
  let uploadedFile = await genAI.files.upload({
    file: pdfFile,
    config: {
      displayName: pdfFile.name,
      mimeType: pdfFile.type || "application/pdf",
    },
  });

  /** Check if file upload was successful and returned a file name */
  if (!uploadedFile.name) {
    throw new Error("Gemini upload did not return a file name.");
  }

  // Poll until Gemini finishes processing the asset (state become ACTIVE)
  /** Wait for file processing to complete by polling the file status */
  while (uploadedFile.state === "PROCESSING") {
    await new Promise((r) => setTimeout(r, 500));
    uploadedFile = await genAI.files.get({ name: uploadedFile.name! });
  }

  /** Verify that file processing completed successfully */
  if (uploadedFile.state !== "ACTIVE" || !uploadedFile.uri) {
    type UploadedFileWithError = { error?: { message?: string } };
    const failureReason =
      (uploadedFile as UploadedFileWithError).error?.message ?? "unknown";
    throw new Error(
      `Gemini file upload failed; state=${uploadedFile.state} reason=${failureReason}`,
    );
  }

  /** Generate content using Gemini model with the prompt and uploaded PDF */
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
    prompt: prompt,
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

/**
 * Example usage demonstrating how to use the GeminiLLM function
 * Uncomment the following code block to test the functionality
 */
/*
// Load a PDF file from disk
const pdfBytes = await Deno.readFile(resolve("PORTA_LILLI.pdf"));

// Create a File object from the PDF bytes
const pdfFile = new File([pdfBytes], basename("PORTA_LILLI.pdf"), {
  type: "application/pdf",
});

// Process the PDF with a custom prompt
const result = await GeminiLLM("prompt.txt", pdfFile);

// Display the formatted JSON response
console.log(JSON.stringify(JSON.parse(result), null, 2));
*/
