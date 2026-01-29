'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  const allFields = rows.length > 0 ? Object.keys(rows[0]) : []

  const getFieldIcon = (field: string) => {
    const icons: Record<string, React.ReactElement> = {
      sivcom: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
        </svg>
      ),
      counterparty: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      units: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      index: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      swap_ccy: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    }
    return icons[field] || null
  }

  return (
    <Card>
      <CardHeader className="bg-gradient-to-r from-card to-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <CardTitle>Booking Reconciliation Results</CardTitle>
            <CardDescription>
              {rows.length > 0
                ? `${rows.length} matching record${rows.length !== 1 ? 's' : ''} successfully reconciled from the booking system`
                : 'No matching records found in the booking system'}
            </CardDescription>
          </div>
          {rows.length > 0 && (
            <Badge variant="default" className="gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {rows.length} Matched
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {rows.length > 0 ? (
          <div className="space-y-4">
            {rows.map((row, rowIndex) => (
              <div
                key={`booking-${rowIndex}`}
                className="p-5 rounded-lg border-2 bg-gradient-to-r from-card to-muted/10 hover:border-primary/30 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-4 pb-3 border-b">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{rowIndex + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Booking Record</p>
                    {row.sivcom && (
                      <p className="font-mono text-sm font-semibold text-foreground">SIVCOM-{row.sivcom}</p>
                    )}
                  </div>
                  <Badge variant="outline" className="gap-1.5 bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Matched
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {allFields.map((field) => {
                    const value = (row as any)[field]
                    const icon = getFieldIcon(field)

                    return (
                      <div key={`${rowIndex}-${field}`} className="p-3 rounded-md bg-muted/30 border">
                        <div className="flex items-center gap-2 mb-1.5">
                          {icon && <div className="text-primary">{icon}</div>}
                          <p className="text-xs font-medium text-muted-foreground capitalize">
                            {field.replace(/_/g, ' ')}
                          </p>
                        </div>
                        <div className="font-mono text-sm font-semibold text-foreground">
                          {typeof value === 'boolean' ? (
                            <Badge variant={value ? 'default' : 'secondary'} className="text-xs">
                              {value ? 'Yes' : 'No'}
                            </Badge>
                          ) : value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value))) ? (
                            <span className="text-xs">{new Date(value).toLocaleDateString()}</span>
                          ) : typeof value === 'number' ? (
                            <span>{value.toLocaleString()}</span>
                          ) : (
                            <span className="break-all">{String(value)}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-muted-foreground mb-1">No Booking Matches Found</p>
            <p className="text-sm text-muted-foreground/70">
              No records from the confirmation files matched the booking system data
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
