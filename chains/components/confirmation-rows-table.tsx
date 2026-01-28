'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
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
import { ChevronDown, ChevronUp } from 'lucide-react'

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
}

interface ConfirmationRowsTableProps {
  rows: ConfirmationRow[]
  transformedFields?: Map<string, TransformedField>
}

export function ConfirmationRowsTable({
  rows,
  transformedFields = new Map(),
}: ConfirmationRowsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())

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

  const renderFieldValue = (fieldName: string, value: any) => {
    const transformed = isFieldTransformed(fieldName)

    if (!transformed) {
      return <span>{String(value)}</span>
    }

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

  const allFields = rows.length > 0 ? Object.keys(rows[0]) : []

  return (
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
                            <h4 className="font-medium text-foreground">Transformation Details</h4>
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
  )
}
