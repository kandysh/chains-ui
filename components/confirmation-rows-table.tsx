'use client'

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
import { AlertCircle } from 'lucide-react'

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
  const isFieldTransformed = (fieldName: string): TransformedField | undefined => {
    return transformedFields.get(fieldName)
  }

  const renderFieldValue = (fieldName: string, value: any) => {
    const transformed = isFieldTransformed(fieldName)

    if (!transformed) {
      return <span className="text-sm">{String(value)}</span>
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <span className="text-sm underline decoration-amber-500 decoration-2 underline-offset-2">
                {String(value)}
              </span>
              <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-500 flex-shrink-0" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="text-xs">
            Applied alias: <code className="font-mono">{transformed.alias}</code>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (rows.length === 0) {
    return (
      <div className="text-center py-8 px-4 rounded-lg border border-dashed bg-muted/30">
        <p className="text-sm text-muted-foreground">No confirmation rows to display</p>
      </div>
    )
  }

  const allFields = Object.keys(rows[0] || {})

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border/50 hover:bg-transparent">
            {allFields.map((field) => (
              <TableHead key={field} className="min-w-max text-xs font-medium text-muted-foreground bg-transparent py-2.5 px-3">
                {field.replace(/_/g, ' ')}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={`conf-row-${rowIndex}`} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
              {allFields.map((field) => (
                <TableCell key={`${rowIndex}-${field}`} className="py-2.5 px-3 text-sm">
                  {renderFieldValue(field, (row as any)[field])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
