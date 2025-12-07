'use client';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Fragment, useState } from "react";

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>("");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Check if the file is a PDF
            if (file.type !== "application/pdf") {
                setUploadStatus("Error: Only PDF files are allowed");
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
            setUploadStatus(""); // Clear any previous status
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus("Error: No file selected.");
            return;
        }
        setUploadStatus("Uploading...");

        try {
            // Create FormData and append the PDF file
            const formData = new FormData();
            formData.append("pdf", selectedFile);

            // Send POST request to the upload route
            const response = await fetch("/api/pdf-upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                // Parse the JSON response
                const result = await response.json();
                setUploadStatus(`Success: PDF saved`);
            } else {
                // Handle error responses
                const errorText = await response.text();
                setUploadStatus(`Error ${errorText}`);
            }
        } catch (error) {
            // Handle network or other errors
            const message = error instanceof Error ? error.message : 'Unknown error';
            setUploadStatus(`Error: ${message}`);
        }
    };

    return (
        <div className="flex flex-row gap-3 px-2">
            {/* File input for selecting a PDF */}
            <Input
                id="pdf/upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
            />
            {/* Styled label as a button to trigger file selection */}
            <Label
                htmlFor="pdf/upload"
                className="hover:text-slate-400 cursor-pointer"
            >
                Select PDF
            </Label>

            {/* Upload button */}
            <Button onClick={handleUpload} disabled={!selectedFile}>
                Upload PDF
            </Button>

            {/* Display upload status */}
            {uploadStatus && <p>{uploadStatus}</p>}
        </div>
    );
};

export { Upload };
