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
  const matchPercentage = confirmationRowsCount > 0
    ? Math.round((bookingMatchesCount / confirmationRowsCount) * 100)
    : 0

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isSuccessful
                ? 'bg-gradient-to-br from-green-500/20 to-green-600/20'
                : hasIssues
                  ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20'
                  : 'bg-gradient-to-br from-blue-500/20 to-blue-600/20'
            }`}>
              {isSuccessful ? (
                <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
              ) : hasIssues ? (
                <AlertTriangle className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
              ) : (
                <AlertCircle className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              )}
            </div>
            <div>
              <CardTitle className="text-2xl">
                Processing Results
              </CardTitle>
              <CardDescription className="mt-1.5 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-mono font-medium text-foreground">{bookingFilename}</span>
              </CardDescription>
            </div>
          </div>
          <Badge
            variant={isSuccessful ? 'default' : hasIssues ? 'secondary' : 'outline'}
            className="text-sm px-4 py-1.5"
          >
            {isSuccessful
              ? '✓ Success'
              : hasIssues
                ? '⚠ Review Required'
                : '● Processed'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Rows Extracted
              </p>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {confirmationRowsCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Confirmation records</p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Matched
              </p>
            </div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {bookingMatchesCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{matchPercentage}% match rate</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            validationPassPercentage === 100
              ? 'bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20'
              : 'bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                validationPassPercentage === 100 ? 'bg-green-500/10' : 'bg-yellow-500/10'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${
                  validationPassPercentage === 100 ? 'text-green-600' : 'text-yellow-600'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Validation
              </p>
            </div>
            <p className={`text-3xl font-bold ${
              validationPassPercentage === 100 ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              {validationPassPercentage}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">Fields passed</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            unmatchedValuesCount > 0
              ? 'bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20'
              : 'bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                unmatchedValuesCount > 0 ? 'bg-orange-500/10' : 'bg-green-500/10'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${
                  unmatchedValuesCount > 0 ? 'text-orange-600' : 'text-green-600'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Unmatched
              </p>
            </div>
            <p className={`text-3xl font-bold ${
              unmatchedValuesCount > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'
            }`}>
              {unmatchedValuesCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Values flagged</p>
          </div>

          <div className={`p-4 rounded-xl border ${
            unknownFieldsCount > 0
              ? 'bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20'
              : 'bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                unknownFieldsCount > 0 ? 'bg-purple-500/10' : 'bg-green-500/10'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 ${
                  unknownFieldsCount > 0 ? 'text-purple-600' : 'text-green-600'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Unknown
              </p>
            </div>
            <p className={`text-3xl font-bold ${
              unknownFieldsCount > 0 ? 'text-purple-600 dark:text-purple-400' : 'text-green-600 dark:text-green-400'
            }`}>
              {unknownFieldsCount}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Fields detected</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
