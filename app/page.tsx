'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FileUploadArea } from '@/components/file-upload-area'
import { ResultsView } from '@/components/results-view'
import { Loader2 } from 'lucide-react'

interface ProcessResult {
  booking_filename: string
  files: Array<{
    filename: string
    text_excerpt: string
    unmatched_values: Record<string, string[]>
    validation_status: {
      'strike date': boolean
      'expiry date': boolean
      direction: boolean
      index: boolean
      spread: boolean
      'swap ccy': boolean
      benchmark: boolean
      counterparty: boolean
      units: boolean
      breakbility: boolean
    }
    confirmation_rows: any[]
    booking_matches_rows: any[]
    unknown_fields: string[]
    canonical_fields: string[]
    aliases_used: Array<{
      source_name: string
      target_name: string
      used: boolean
      count: number
      source: 'provided' | 'infered'
      on_field: string[]
    }>
  }>
}

export default function Home() {
  const [singleFile, setSingleFile] = useState<File | null>(null)
  const [multipleFiles, setMultipleFiles] = useState<File[]>([])
  const [results, setResults] = useState<ProcessResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSingleFileSelected = (files: File[]) => {
    setSingleFile(files[0] || null)
  }

  const handleMultipleFilesSelected = (files: File[]) => {
    setMultipleFiles(files)
  }

  const handleProcessFiles = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()

      if (singleFile) {
        formData.append('booking_file', singleFile)
      }

      multipleFiles.forEach((file, index) => {
        formData.append(`confirmation_files[${index}]`, file)
      })

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process files')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('[v0] Processing error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearResults = () => {
    setResults(null)
    setSingleFile(null)
    setMultipleFiles([])
    setError(null)
  }

  const handleSaveAlias = async (alias: any, saveLevel: 'global' | 'counterparty') => {
    console.log('[v0] Saving alias:', { alias, saveLevel })
    // Implement API call to save alias
  }

  const canProcess = singleFile || multipleFiles.length > 0

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground tracking-tight">File Processing</h1>
          <p className="text-base text-muted-foreground mt-2">
            Upload and process swap confirmation files with intelligent field matching
          </p>
        </div>

        {/* Upload Section */}
        <div className="space-y-6 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Booking File</label>
              <FileUploadArea
                onFilesSelected={handleSingleFileSelected}
                multiple={false}
                label={singleFile?.name || 'Upload Booking File'}
                description={singleFile ? 'File selected' : 'Select one file'}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Confirmation Files</label>
              <FileUploadArea
                onFilesSelected={handleMultipleFilesSelected}
                multiple={true}
                label={multipleFiles.length > 0 ? `${multipleFiles.length} file(s) selected` : 'Upload Confirmation Files'}
                description={multipleFiles.length > 0 ? 'Files selected' : 'Select one or more files'}
              />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/30">
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            <Button
              onClick={handleProcessFiles}
              // disabled={!canProcess || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Process Files'
              )}
            </Button>
            {results && (
              <Button
                onClick={handleClearResults}
                variant="outline"
              >
                Clear Results
              </Button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Results</h2>
            <ResultsView results={results} onSaveAlias={handleSaveAlias} />
          </div>
        )}
      </div>
    </main>
  )
}
