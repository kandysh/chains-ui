'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface BookingMatch {
  sivcom?: number
  counterparty?: string
  units?: number
  index?: string
  swap_ccy?: string
  spread?: number
  breakability?: string
  strike_date?: string | Date
  expiry_date?: string | Date
  direction?: 'long' | 'short'
}

interface BookingMatchesTableProps {
  rows: BookingMatch[]
}

export function BookingMatchesTable({ rows }: BookingMatchesTableProps) {
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
              {allFields.map((field) => {
                const value = (row as any)[field]
                return (
                  <TableCell key={`${rowIndex}-${field}`} className="py-2.5 px-3 text-sm">
                    {typeof value === 'boolean' ? (
                      <Badge
                        variant={value ? 'default' : 'secondary'}
                        className="text-xs h-5"
                      >
                        {value ? 'Yes' : 'No'}
                      </Badge>
                    ) : (
                      String(value)
                    )}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
