'use client'

import { CheckCircle2, AlertCircle } from 'lucide-react'
import { ValidationStatus } from '@/lib/types'

interface ValidationStatusProps {
  status: ValidationStatus
}

export function ValidationStatusComponent({ status }: ValidationStatusProps) {
  const entries = Object.entries(status)
  const validFields = entries.filter(([_, valid]) => valid).length
  const invalidFields = entries.filter(([_, valid]) => !valid)
  const hasInvalid = invalidFields.length > 0

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {entries.map(([field, valid]) => (
          <div
            key={field}
            className={`flex flex-col items-center gap-2 p-3 rounded transition-all ${
              valid
                ? 'bg-green/10 hover:bg-green/15 border border-green/20'
                : 'bg-destructive/10 hover:bg-destructive/15 border border-destructive/20'
            }`}
            title={field}
          >
            {valid ? (
              <CheckCircle2 className="w-5 h-5 text-green" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive" />
            )}
            <p className="text-xs font-medium text-foreground/80 text-center capitalize line-clamp-2">
              {field}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-3 rounded bg-muted/50 border border-border/60">
        <p className="text-sm font-medium text-foreground">
          Validation Status: <span className={validFields === entries.length ? 'text-green font-semibold' : 'text-destructive font-semibold'}>
            {validFields}/{entries.length} fields valid
          </span>
        </p>
      </div>

      {hasInvalid && (
        <div className="flex items-start gap-3 p-3 rounded bg-destructive/10 border border-destructive/20">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-destructive mb-1">
              {invalidFields.length} field{invalidFields.length !== 1 ? 's' : ''} invalid
            </p>
            <p className="text-xs text-destructive/80">
              {invalidFields.map(([field]) => field).join(', ')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
