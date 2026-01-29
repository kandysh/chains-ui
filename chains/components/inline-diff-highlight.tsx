'use client'

import { cn } from '@/lib/utils'

interface InlineDiffHighlightProps {
  originalValue: string
  transformedValue: string
  aliasSource: 'provided' | 'infered'
  fieldName?: string
  className?: string
}

export function InlineDiffHighlight({
  originalValue,
  transformedValue,
  aliasSource,
  fieldName,
  className
}: InlineDiffHighlightProps) {
  // If values are the same, no transformation occurred
  if (originalValue === transformedValue) {
    return <span className={className}>{originalValue}</span>
  }

  const bgColor = aliasSource === 'provided'
    ? 'bg-green-50 dark:bg-green-950/30'
    : 'bg-yellow-50 dark:bg-yellow-950/30'

  const borderColor = aliasSource === 'provided'
    ? 'border-green-200 dark:border-green-800'
    : 'border-yellow-200 dark:border-yellow-800'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded border',
        bgColor,
        borderColor,
        className
      )}
      title={fieldName ? `Alias applied to ${fieldName}` : 'Alias applied'}
    >
      <span className="line-through text-muted-foreground text-xs font-mono">
        {originalValue}
      </span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-3 h-3 text-muted-foreground flex-shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
      <span className="font-medium font-mono text-sm">
        {transformedValue}
      </span>
    </span>
  )
}
