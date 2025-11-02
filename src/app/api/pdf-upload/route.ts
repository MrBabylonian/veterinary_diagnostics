/**
 * @fileoverview Next.js API route for handling PDF file uploads in veterinary diagnostics.
 *
 * This route provides a secure endpoint for uploading PDF documents, which are then
 * stored temporarily for processing by the Gemini AI analysis system. It validates
 * file types, ensures proper directory structure, and returns the saved file path.
 *
 * @author MrBabylonian
 * @version 1.0.0
 */

import { GeminiLLM } from "@/components/GeminiApi";
import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

/** Force Node.js runtime for file system operations */
export const runtime = "nodejs";

/**
 * Handles POST requests for PDF file uploads.
 *
 * This endpoint accepts multipart form data containing a PDF file, validates it,
 * and saves it to a temporary uploads directory. The saved file path is returned
 * for further processing by the Gemini API integration.
 *
 * @param request - The incoming Next.js request object containing form data
 *
 * @returns Promise<NextResponse> - JSON response with the saved file path or error message
 *
 * @throws {NextResponse} Returns 400 if no PDF file is provided
 * @throws {NextResponse} Returns 415 if the uploaded file is not a PDF
 *
 * @example
 * ```typescript
 * // Client-side upload example
 * const formData = new FormData();
 * formData.append('pdf', fileInput.files[0]);
 *
 * const response = await fetch('/api/pdf-upload', {
 *   method: 'POST',
 *   body: formData
 * });
 *
 * const result = await response.json();
 * console.log('PDF saved at:', result.savedAt);
 * ```
 */
export async function POST(request: NextRequest) {
  // Extract the form data from the incoming request
  const form = await request.formData();
  const file = form.get("pdf");

  // Check if a file was provided and is actually a File object
  if (!(file instanceof File)) {
    return new NextResponse("Missing PDF", { status: 400 });
  }

  // Validate that the uploaded file is a PDF by checking its MIME type
  if (file.type !== "application/pdf") {
    return new NextResponse("Only PDFs allowed", { status: 415 });
  }

  // Convert the file to a byte array for writing to disk
  const bytes = new Uint8Array(await file.arrayBuffer());

  // Create the upload directory path and ensure it exists
  const uploadDir = join(process.cwd(), "tmp", "uploads");
  await mkdir(uploadDir, { recursive: true });

  // Generate a safe filename, using the original name if available
  const originalFileName = file.name?.trim() ? file.name
    : null;
  
  // If original file name exists, replace every character that is not safe with an underscore
  const safeFileName = originalFileName?.replace(/[^a-zA-Z0-9._-]/g, "_") ?? `upload-${Date.now()}.pdf`
  const filePath = join(uploadDir, safeFileName);

  // Write the file bytes to the specified path
  await writeFile(filePath, bytes);

  const llmResponse = await GeminiLLM("./prompts/diagnostic_prompt.txt", file);
  // Return a success response with the saved file path
  return new NextResponse(JSON.stringify({
    llmResponse: llmResponse
  }), {
    status: 201,
    headers: { "content-type": "application/json" },
  });
}
