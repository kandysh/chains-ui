"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileUploadArea } from "@/components/file-upload-area";
import { ResultsView } from "@/components/results-view";
import { Loader2 } from "lucide-react";
import { ProcessResult } from "@/lib/types";

export default function Home() {
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ProcessResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSingleFileSelected = (files: File[]) => {
    setSingleFile(files[0] || null);
  };

  const handleMultipleFilesSelected = (files: File[]) => {
    setMultipleFiles(files);
  };

  const handleProcessFiles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      if (singleFile) {
        formData.append("booking_file", singleFile);
      }

      multipleFiles.forEach((file, index) => {
        formData.append(`confirmation_files[${index}]`, file);
      });

      const response = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process files");
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("[v0] Processing error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearResults = () => {
    setResults(null);
    setSingleFile(null);
    setMultipleFiles([]);
    setError(null);
  };

  const handleSaveAlias = async (
    alias: any,
    saveLevel: "global" | "counterparty",
  ) => {
    console.log("[v0] Saving alias:", { alias, saveLevel });
    // Implement API call to save alias
  };

  const canProcess = singleFile || multipleFiles.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-8 border border-primary/10">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            File Processing
          </h1>
          <p className="text-base text-muted-foreground mt-3 leading-relaxed">
            Upload and process swap confirmation files with intelligent field
            matching and validation
          </p>
        </div>

        {/* Upload Section */}
        <div className="space-y-6 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">
                Booking File
              </label>
              <FileUploadArea
                onFilesSelected={handleSingleFileSelected}
                multiple={false}
                label={singleFile?.name || "Upload Booking File"}
                description={singleFile ? "File selected" : "Select one file"}
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-foreground">
                Confirmation Files
              </label>
              <FileUploadArea
                onFilesSelected={handleMultipleFilesSelected}
                multiple={true}
                label={
                  multipleFiles.length > 0
                    ? `${multipleFiles.length} file(s) selected`
                    : "Upload Confirmation Files"
                }
                description={
                  multipleFiles.length > 0
                    ? "Files selected"
                    : "Select one or more files"
                }
              />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 dark:bg-destructive/20 border border-destructive/30 flex items-start gap-3">
              <div className="text-destructive mt-0.5">●</div>
              <p className="text-sm text-destructive font-medium">{error}</p>
            </div>
          )}

          <div className="flex justify-center gap-3 pt-4">
            <Button
              onClick={handleProcessFiles}
              // disabled={!canProcess || isLoading}
              size="lg"
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Process Files"
              )}
            </Button>
            {results && (
              <Button onClick={handleClearResults} variant="outline" size="lg">
                Clear Results
              </Button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-foreground">
                Processing Results
              </h2>
              <div className="text-sm text-muted-foreground">
                {results.files.length} file
                {results.files.length !== 1 ? "s" : ""} processed
              </div>
            </div>
            <ResultsView results={results} onSaveAlias={handleSaveAlias} />
          </div>
        )}
      </div>
    </main>
  );
}
