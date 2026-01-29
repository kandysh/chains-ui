'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { ValidationStatusComponent } from './validation-status'
import { AliasesPanel } from './aliases-panel'
import { ConfirmationRowsTable } from './confirmation-rows-table'
import { BookingMatchesTable } from './booking-matches-table'
import { IssuesPanel } from './issues-panel'
import { ChevronDown, FileText } from 'lucide-react'

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
  onSaveAlias?: (alias: any, saveLevel: 'global' | 'counterparty') => void
}

export function ResultsView({ results, onSaveAlias }: ResultsViewProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<number>>(new Set([0]))

  const toggleFile = (index: number) => {
    const newExpanded = new Set(expandedFiles)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedFiles(newExpanded)
  }

  const buildTransformedFieldsMap = (fileResult: any) => {
    const map = new Map()
    fileResult.aliases_used.forEach((alias: any) => {
      if (alias.used) {
        alias.on_field.forEach((field: string) => {
          map.set(field, {
            fieldName: field,
            alias: alias.source_name + ' → ' + alias.target_name,
          })
        })
      }
    })
    return map
  }

  const getValidationStats = (fileResult: any) => {
    const invalidFields = Object.entries(fileResult.validation_status)
      .filter(([_, valid]) => !valid)
      .map(([field]) => field)
    const unmatchedCount = Object.values(fileResult.unmatched_values).reduce(
      (acc: number, values: any) => acc + values.length,
      0
    )
    return { invalidFields, unmatchedCount }
  }

  return (
    <div className="w-full space-y-3">
      {results.files.map((fileResult, index) => {
        const { invalidFields, unmatchedCount } = getValidationStats(fileResult)
        const isExpanded = expandedFiles.has(index)

        return (
          <div key={index}>
            <button
              onClick={() => toggleFile(index)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-lg hover:bg-muted/40 transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 text-left min-w-0">
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
                <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground truncate">{fileResult.filename}</h3>
                  <div className="flex gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
                    <span>{fileResult.confirmation_rows.length} rows</span>
                    <span>{fileResult.booking_matches_rows.length} matches</span>
                    {invalidFields.length > 0 && (
                      <span className="text-red-600 dark:text-red-500 font-medium">
                        {invalidFields.length} invalid
                      </span>
                    )}
                    {unmatchedCount > 0 && (
                      <span className="text-amber-600 dark:text-amber-500 font-medium">
                        {unmatchedCount} unmatched
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="space-y-6 px-4 py-4 rounded-lg bg-card/50">
                {/* Validation Status */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3 opacity-70">
                    Validation
                  </h4>
                  <ValidationStatusComponent status={fileResult.validation_status} />
                </div>

                {/* Aliases */}
                {fileResult.aliases_used.some((a) => a.used) && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3 opacity-70">
                      Field Aliases
                    </h4>
                    <AliasesPanel aliases={fileResult.aliases_used} onSaveAlias={onSaveAlias} />
                  </div>
                )}

                {/* Issues */}
                {(Object.keys(fileResult.unmatched_values).length > 0 ||
                  fileResult.unknown_fields.length > 0 ||
                  fileResult.text_excerpt) && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3 opacity-70">
                      Issues & Notes
                    </h4>
                    <IssuesPanel
                      unmatchedValues={fileResult.unmatched_values}
                      unknownFields={fileResult.unknown_fields}
                      textExcerpt={fileResult.text_excerpt}
                      onSaveAsAlias={onSaveAlias}
                    />
                  </div>
                )}

                {/* Confirmation Rows */}
                {fileResult.confirmation_rows.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3 opacity-70">
                      Confirmation Rows
                    </h4>
                    <ConfirmationRowsTable
                      rows={fileResult.confirmation_rows}
                      transformedFields={buildTransformedFieldsMap(fileResult)}
                    />
                  </div>
                )}

                {/* Booking Matches */}
                {fileResult.booking_matches_rows.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3 opacity-70">
                      Booking Matches
                    </h4>
                    <BookingMatchesTable rows={fileResult.booking_matches_rows} />
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
