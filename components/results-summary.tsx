'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react'

interface ResultsSummaryProps {
  bookingFilename: string
  confirmationRowsCount: number
  bookingMatchesCount: number
  unmatchedValuesCount: number
  unknownFieldsCount: number
  validationPassPercentage: number
}

export function ResultsSummary({
  bookingFilename,
  confirmationRowsCount,
  bookingMatchesCount,
  unmatchedValuesCount,
  unknownFieldsCount,
  validationPassPercentage,
}: ResultsSummaryProps) {
  const hasIssues = unmatchedValuesCount > 0 || unknownFieldsCount > 0
  const isSuccessful = validationPassPercentage === 100 && !hasIssues

  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isSuccessful ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : hasIssues ? (
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-blue-500" />
              )}
              Processing Results
            </CardTitle>
            <CardDescription className="mt-1">
              File: <span className="font-mono font-medium text-foreground">{bookingFilename}</span>
            </CardDescription>
          </div>
          <Badge
            variant={isSuccessful ? 'default' : hasIssues ? 'secondary' : 'outline'}
            className="text-xs"
          >
            {isSuccessful
              ? 'Success'
              : hasIssues
                ? 'Review Required'
                : 'Processed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-tight">
              Confirmation Rows
            </p>
            <p className="text-2xl font-bold text-foreground">
              {confirmationRowsCount}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-tight">
              Booking Matches
            </p>
            <p className="text-2xl font-bold text-foreground">
              {bookingMatchesCount}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-tight">
              Validation Pass
            </p>
            <p className={`text-2xl font-bold ${validationPassPercentage === 100 ? 'text-green-500' : 'text-yellow-500'}`}>
              {validationPassPercentage}%
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-tight">
              Unmatched Values
            </p>
            <p className={`text-2xl font-bold ${unmatchedValuesCount > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
              {unmatchedValuesCount}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-tight">
              Unknown Fields
            </p>
            <p className={`text-2xl font-bold ${unknownFieldsCount > 0 ? 'text-yellow-500' : 'text-green-500'}`}>
              {unknownFieldsCount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
