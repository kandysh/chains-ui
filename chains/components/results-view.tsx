'use client'

import { useState, useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { FileUploadArea } from './file-upload-area'
import { ResultsSummary } from './results-summary'
import { ValidationStatusComponent } from './validation-status'
import { AliasesPanel } from './aliases-panel'
import { ConfirmationRowsTable } from './confirmation-rows-table'
import { BookingMatchesTable } from './booking-matches-table'
import { IssuesPanel } from './issues-panel'
import { ReprocessButton } from './reprocess-button'
import { ArrowLeft } from 'lucide-react'

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

interface ResultsViewProps {
  results: ProcessResult
  onBack: () => void
  onSaveAlias?: (alias: any, saveLevel: 'global' | 'counterparty') => void
  onRejectAlias?: (alias: any) => void
  onFieldMapping?: (unknownField: string, canonicalField: string) => void
  onReprocess?: () => void
  onFieldClick?: (field: string) => void
  selectedField?: string | null
  showReprocessButton?: boolean
  activeAliases?: any[]
  validationRate?: number
  matchRate?: number
  rejectedAliases?: Set<string>
}

export function ResultsView({
  results,
  onBack,
  onSaveAlias,
  onRejectAlias,
  onFieldMapping,
  onReprocess,
  onFieldClick,
  selectedField,
  showReprocessButton = false,
  activeAliases,
  validationRate,
  matchRate,
  rejectedAliases
}: ResultsViewProps) {
  const [isReprocessing, setIsReprocessing] = useState(false)
  const fileResult = results.files[0]

  // Calculate number of pending changes
  const pendingChanges = useMemo(() => {
    let count = 0
    if (rejectedAliases) count += rejectedAliases.size
    // Add other pending changes here (approved aliases, field mappings, etc.)
    return count
  }, [rejectedAliases])

  const handleReprocessClick = async () => {
    if (onReprocess) {
      setIsReprocessing(true)
      await onReprocess()
      setIsReprocessing(false)
    }
  }

  const unmatchedCount = Object.values(fileResult.unmatched_values).reduce(
    (acc, values) => acc + values.length,
    0
  )
  const validationPassed = Object.values(fileResult.validation_status).filter(Boolean).length
  const validationPassPercentage = Math.round(
    (validationPassed / Object.keys(fileResult.validation_status).length) * 100
  )

  const buildTransformedFieldsMap = () => {
    const map = new Map()
    fileResult.aliases_used.forEach((alias) => {
      if (alias.used) {
        alias.on_field.forEach((field) => {
          map.set(field, {
            fieldName: field,
            alias: alias.source_name + ' → ' + alias.target_name,
          })
        })
      }
    })
    return map
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-2 bg-transparent">
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </Button>
      </div>

      <ResultsSummary
        bookingFilename={fileResult.filename}
        confirmationRowsCount={fileResult.confirmation_rows.length}
        bookingMatchesCount={fileResult.booking_matches_rows.length}
        unmatchedValuesCount={unmatchedCount}
        unknownFieldsCount={fileResult.unknown_fields.length}
        validationPassPercentage={validationPassPercentage}
      />

      <Tabs defaultValue="validation" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50">
          <TabsTrigger value="validation" className="data-[state=active]:bg-background gap-2 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden sm:inline">Validation</span>
          </TabsTrigger>
          <TabsTrigger value="aliases" className="data-[state=active]:bg-background gap-2 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="hidden sm:inline">Aliases</span>
          </TabsTrigger>
          <TabsTrigger value="confirmation" className="data-[state=active]:bg-background gap-2 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden sm:inline">Confirmations</span>
          </TabsTrigger>
          <TabsTrigger value="matches" className="data-[state=active]:bg-background gap-2 py-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="hidden sm:inline">Matches</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="validation" className="space-y-4 mt-6">
          <ValidationStatusComponent
            status={fileResult.validation_status}
            onFieldClick={onFieldClick}
            selectedField={selectedField}
          />
          <IssuesPanel
            unmatchedValues={fileResult.unmatched_values}
            unknownFields={fileResult.unknown_fields}
            textExcerpt={fileResult.text_excerpt}
            selectedField={selectedField}
            canonicalFields={fileResult.canonical_fields}
            onFieldMapping={onFieldMapping}
          />
        </TabsContent>

        <TabsContent value="aliases" className="space-y-4 mt-6">
          <AliasesPanel
            aliases={activeAliases || fileResult.aliases_used}
            onSaveAlias={onSaveAlias}
            onRejectAlias={onRejectAlias}
          />
        </TabsContent>

        <TabsContent value="confirmation" className="space-y-4 mt-6">
          <ConfirmationRowsTable
            rows={fileResult.confirmation_rows}
            transformedFields={buildTransformedFieldsMap()}
            aliases={fileResult.aliases_used}
            bookingRows={fileResult.booking_matches_rows}
            validationStatus={fileResult.validation_status}
          />
        </TabsContent>

        <TabsContent value="matches" className="space-y-4 mt-6">
          <BookingMatchesTable rows={fileResult.booking_matches_rows} />
        </TabsContent>
      </Tabs>

      {/* Reprocess Button */}
      {showReprocessButton && (
        <ReprocessButton
          pendingChanges={pendingChanges}
          onReprocess={handleReprocessClick}
          isLoading={isReprocessing}
        />
      )}
    </div>
  )
}
