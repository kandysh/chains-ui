'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle } from 'lucide-react'

interface ValidationStatus {
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

interface ValidationStatusProps {
  status: ValidationStatus
}

export function ValidationStatusComponent({ status }: ValidationStatusProps) {
  const entries = Object.entries(status)
  const validCount = entries.filter(([_, valid]) => valid).length
  const totalCount = entries.length
  const passPercentage = Math.round((validCount / totalCount) * 100)

  const getFieldIcon = (field: string) => {
    const icons: Record<string, JSX.Element> = {
      'strike date': (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      'expiry date': (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      direction: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      index: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      ),
      spread: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      'swap ccy': (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      benchmark: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      counterparty: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      units: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      breakbility: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    }
    return icons[field] || icons['index']
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-card to-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle>Field Validation Dashboard</CardTitle>
            <CardDescription>
              Comprehensive validation across {totalCount} critical fields
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">{validCount}/{totalCount}</div>
            <p className="text-xs text-muted-foreground">Fields Passed</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">Validation Progress</span>
              <span className="font-bold text-foreground">{passPercentage}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden border">
              <div
                className={`h-full transition-all duration-500 ${
                  passPercentage === 100
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : passPercentage >= 80
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : 'bg-gradient-to-r from-orange-500 to-red-600'
                }`}
                style={{ width: `${passPercentage}%` }}
              />
            </div>
          </div>

          {/* Validation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {entries.map(([field, valid]) => (
              <div
                key={field}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  valid
                    ? 'border-green-500/20 bg-green-500/5 hover:border-green-500/40 hover:shadow-md'
                    : 'border-destructive/20 bg-destructive/5 hover:border-destructive/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    valid ? 'bg-green-500/10' : 'bg-destructive/10'
                  }`}>
                    <div className={valid ? 'text-green-600 dark:text-green-400' : 'text-destructive'}>
                      {getFieldIcon(field)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground capitalize mb-1">
                      {field}
                    </p>
                    <div className="flex items-center gap-1.5">
                      {valid ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-medium text-green-600 dark:text-green-400">Validated</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                          <span className="text-xs font-medium text-destructive">Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Status */}
          <div className={`rounded-xl p-6 text-center border-2 ${
            passPercentage === 100
              ? 'bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20'
              : passPercentage >= 80
                ? 'bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20'
                : 'bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20'
          }`}>
            <p className="text-sm font-medium text-muted-foreground mb-2">Overall Validation Status</p>
            <Badge
              variant={passPercentage === 100 ? 'default' : passPercentage >= 80 ? 'secondary' : 'destructive'}
              className="text-base px-4 py-1.5"
            >
              {passPercentage === 100 ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  All Fields Valid
                </span>
              ) : passPercentage >= 80 ? (
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Mostly Valid
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Review Required
                </span>
              )}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              {passPercentage === 100
                ? 'Perfect validation - all fields meet requirements'
                : passPercentage >= 80
                  ? 'Good validation - minor issues detected'
                  : 'Multiple validation failures - review required'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
