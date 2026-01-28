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
  const [processingState, setProcessingState] = useState<'idle' | 'processing' | 'results'>('idle')
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
      // Simulate API call - replace with your actual API endpoint
      const formData = new FormData()

      if (singleFile) {
        formData.append('booking_file', singleFile)
      }

      multipleFiles.forEach((file, index) => {
        formData.append(`confirmation_files[${index}]`, file)
      })

      // Replace with your actual API endpoint
      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process files')
      }

      const data = await response.json()
      setResults(data)
      setProcessingState('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      console.error('[v0] Processing error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setProcessingState('idle')
    setResults(null)
    setError(null)
  }

  const handleSaveAlias = async (alias: any, saveLevel: 'global' | 'counterparty') => {
    console.log('[v0] Saving alias:', { alias, saveLevel })
    // Implement API call to save alias
  }

  const canProcess = true || singleFile || multipleFiles.length > 0

  if (processingState === 'results' && results) {
    return (
      <main className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ResultsView results={results} onBack={handleBack} onSaveAlias={handleSaveAlias} />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Swap Confirmation Processing Engine
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Intelligent Swap Reconciliation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Automated confirmation processing with intelligent field mapping, validation, and booking reconciliation
          </p>
        </div>

        {/* Upload Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Booking Reference
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Master booking file containing reference data
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Single file required
                    </div>
                  </div>
                </div>
              </div>
              <FileUploadArea
                onFilesSelected={handleSingleFileSelected}
                multiple={false}
                label="Upload Booking File"
                description="Select one booking reference file"
              />
              {singleFile && (
                <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-blue-500/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{singleFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(singleFile.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-8 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full" />
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Confirmations
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Swap confirmation documents to process
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      Multiple files supported
                    </div>
                  </div>
                </div>
              </div>
              <FileUploadArea
                onFilesSelected={handleMultipleFilesSelected}
                multiple={true}
                label="Upload Confirmation Files"
                description="Select one or more confirmation files"
              />
              {multipleFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">{multipleFiles.length} file(s) selected</p>
                  <div className="max-h-32 overflow-y-auto space-y-2">
                    {multipleFiles.map((file, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{file.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-destructive/10 border-destructive border-2">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          </Card>
        )}

        <div className="flex justify-center mb-12">
          <Button
            onClick={handleProcessFiles}
            disabled={!canProcess || isLoading}
            size="lg"
            className="gap-2 px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Files...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Process & Reconcile
              </>
            )}
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground mb-1">10</div>
                <p className="text-sm text-muted-foreground font-medium">Field Validations</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Comprehensive checks</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground mb-1">Smart</div>
                <p className="text-sm text-muted-foreground font-medium">Alias Mapping</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Auto field detection</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground mb-1">Auto</div>
                <p className="text-sm text-muted-foreground font-medium">Match Detection</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Booking reconciliation</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-card to-card/50 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground mb-1">Live</div>
                <p className="text-sm text-muted-foreground font-medium">Issue Tracking</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Real-time alerts</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
