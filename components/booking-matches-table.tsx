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
import { Badge } from '@/components/ui/badge'
import { BookingMatch } from '@/lib/types'

interface BookingMatchesTableProps {
  rows: BookingMatch[]
  transformedValues?: Map<string, Map<string, { sourceValue: string, targetValue: string, alias: string }>>
}

export function BookingMatchesTable({ rows, transformedValues = new Map() }: BookingMatchesTableProps) {
  const renderFieldValue = (fieldName: string, value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-sm text-muted-foreground">—</span>
    }

    const fieldAliases = transformedValues?.get(fieldName)
    const aliasInfo = fieldAliases?.get(String(value))

    if (!aliasInfo) {
      // Handle boolean and other values normally
      if (typeof value === 'boolean') {
        return (
          <Badge
            variant={value ? 'success' : 'warning'}
            className="text-xs font-medium"
          >
            {value ? 'Yes' : 'No'}
          </Badge>
        )
      }
      return <span className="text-foreground">{String(value)}</span>
    }

    // Value was aliased - show source with indicator
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-medium px-2.5 py-1 rounded bg-orange/15 text-orange underline decoration-orange decoration-2 underline-offset-2 cursor-pointer">
              {aliasInfo.sourceValue}
            </span>
          </TooltipTrigger>
          <TooltipContent className="text-xs bg-background border border-border text-foreground">
            <span>Aliased to: <code className="font-mono">{aliasInfo.targetValue}</code></span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
  if (rows.length === 0) {
    return (
      <div className="text-center py-8 px-4 rounded-lg border border-dashed bg-muted/30">
        <p className="text-sm text-muted-foreground">No booking matches found</p>
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
            <TableRow key={`booking-${rowIndex}`} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
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
