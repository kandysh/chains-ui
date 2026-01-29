'use client'

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
  const invalidFields = entries.filter(([_, valid]) => !valid)
  const hasInvalid = invalidFields.length > 0

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-2.5">
        {entries.map(([field, valid]) => (
          <div
            key={field}
            className="flex flex-col items-center gap-2 p-2.5 rounded-md hover:bg-muted/20 transition-colors"
            title={field}
          >
            {valid ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-500" />
            )}
            <p className="text-xs text-foreground/70 text-center capitalize line-clamp-2">
              {field}
            </p>
          </div>
        ))}
      </div>
      
      {hasInvalid && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 dark:bg-red-950/25 border border-red-200 dark:border-red-900/30">
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-500 flex-shrink-0" />
          <p className="text-xs text-red-700 dark:text-red-400">
            {invalidFields.length} field{invalidFields.length !== 1 ? 's' : ''} invalid
          </p>
        </div>
      )}
    </div>
  )
}
