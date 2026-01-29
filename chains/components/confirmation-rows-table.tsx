'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ChevronDown, ChevronUp, ArrowRightLeft } from 'lucide-react'
import { InlineDiffHighlight } from './inline-diff-highlight'
import { RowComparisonDialog } from './row-comparison-dialog'

interface ConfirmationRow {
  strike_date?: string | Date
  trade_date?: string | Date
  direction?: 'long' | 'short'
  swap_type?: string
  index?: string
  party_a?: string
  swap_ccy?: string
  counterparty?: string
  units?: number
  expiry_date?: string | Date
  early_termination_party_a?: boolean
  benchmark?: string
  spread?: number
  lookback?: string
  bf?: number
}

interface TransformedField {
  fieldName: string
  alias: string
  source?: 'provided' | 'infered'
  originalValue?: string
}

interface ConfirmationRowsTableProps {
  rows: ConfirmationRow[]
  transformedFields?: Map<string, TransformedField>
  aliases?: Array<{
    source_name: string
    target_name: string
    source: 'provided' | 'infered'
    on_field: string[]
  }>
  bookingRows?: any[]
  validationStatus?: Record<string, boolean>
  onCompareRow?: (confirmationRow: any, bookingRow: any) => void
}

export function ConfirmationRowsTable({
  rows,
  transformedFields = new Map(),
  aliases = [],
  bookingRows = [],
  validationStatus = {},
  onCompareRow,
}: ConfirmationRowsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [compareDialogOpen, setCompareDialogOpen] = useState(false)
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

  const toggleRowExpand = (index: number) => {
    const updated = new Set(expandedRows)
    if (updated.has(index)) {
      updated.delete(index)
    } else {
      updated.add(index)
    }
    setExpandedRows(updated)
  }

  const isFieldTransformed = (fieldName: string): TransformedField | undefined => {
    return transformedFields.get(fieldName)
  }

  // Find alias information for a field
  const getAliasForField = (fieldName: string) => {
    return aliases.find(alias => alias.on_field.includes(fieldName))
  }

  const renderFieldValue = (fieldName: string, value: any) => {
    const transformed = isFieldTransformed(fieldName)
    const alias = getAliasForField(fieldName)

    // If there's an alias applied to this field, show inline diff
    if (alias) {
      return (
        <InlineDiffHighlight
          originalValue={alias.source_name}
          transformedValue={alias.target_name}
          aliasSource={alias.source}
          fieldName={fieldName}
        />
      )
    }

    // Fallback to old tooltip display if transformed but no alias found
    if (transformed) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="underline decoration-yellow-500 decoration-2 underline-offset-2 cursor-help">
                {String(value)}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <div className="space-y-1">
                <p className="text-xs font-medium">Applied alias: {transformed.alias}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return <span className="font-mono text-sm">{String(value)}</span>
  }

  const handleCompareClick = (rowIndex: number) => {
    setSelectedRowIndex(rowIndex)
    setCompareDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setCompareDialogOpen(false)
    setSelectedRowIndex(null)
  }

  const allFields = rows.length > 0 ? Object.keys(rows[0]) : []

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Confirmation Rows</CardTitle>
          <CardDescription>
            Extracted swap/booking confirmation data with transformation highlights
          </CardDescription>
        </CardHeader>
        <CardContent>
        {rows.length > 0 ? (
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-12"></TableHead>
                  {allFields.map((field) => (
                    <TableHead key={field} className="min-w-max">
                      {field.replace(/_/g, ' ')}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <div key={`conf-row-${rowIndex}`}>
                    <TableRow>
                      <TableCell>
                        <button
                          onClick={() => toggleRowExpand(rowIndex)}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {expandedRows.has(rowIndex) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </TableCell>
                      {allFields.map((field) => (
                        <TableCell key={`${rowIndex}-${field}`} className="text-sm">
                          {renderFieldValue(field, (row as any)[field])}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandedRows.has(rowIndex) && (
                      <TableRow className="bg-muted/30">
                        <TableCell colSpan={allFields.length + 1} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-foreground">Transformation Details</h4>
                              {bookingRows.length > 0 && (
                                <Button
                                  onClick={() => handleCompareClick(rowIndex)}
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                >
                                  <ArrowRightLeft className="w-4 h-4" />
                                  Full Comparison
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              {allFields.map((field) => {
                                const transformed = isFieldTransformed(field)
                                if (!transformed) return null

                                return (
                                  <div
                                    key={`detail-${field}`}
                                    className="border rounded-md p-3 bg-background"
                                  >
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                      {field}
                                    </p>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-muted-foreground line-through">
                                        [Original]
                                      </span>
                                      <span className="text-sm">→</span>
                                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-400">
                                        {transformed.alias}
                                      </Badge>
                                    </div>
                                    <p className="text-sm font-mono mt-2">
                                      Result: {String((row as any)[field])}
                                    </p>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </div>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No confirmation rows to display
          </div>
        )}
      </CardContent>
    </Card>

    {/* Row Comparison Dialog */}
    {selectedRowIndex !== null && (
      <RowComparisonDialog
        open={compareDialogOpen}
        onOpenChange={handleCloseDialog}
        confirmationRow={rows[selectedRowIndex]}
        bookingRow={bookingRows[0] || {}}
        validationStatus={validationStatus}
        aliases={aliases}
      />
    )}
    </>
  )
}
