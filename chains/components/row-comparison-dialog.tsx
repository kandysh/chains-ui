'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Alias {
  source_name: string
  target_name: string
  source: 'provided' | 'infered'
  on_field: string[]
}

interface RowComparisonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  confirmationRow: Record<string, any>
  bookingRow: Record<string, any>
  validationStatus?: Record<string, boolean>
  aliases?: Alias[]
}

export function RowComparisonDialog({
  open,
  onOpenChange,
  confirmationRow,
  bookingRow,
  validationStatus = {},
  aliases = [],
}: RowComparisonDialogProps) {
  // Get all unique field names from both rows
  const allFields = Array.from(
    new Set([
      ...Object.keys(confirmationRow || {}),
      ...Object.keys(bookingRow || {}),
    ])
  ).sort()

  // Check if field values match
  const isFieldMatching = (field: string): boolean => {
    const confValue = String(confirmationRow?.[field] || '')
    const bookValue = String(bookingRow?.[field] || '')
    return confValue === bookValue
  }

  // Get alias applied to field
  const getAliasForField = (field: string) => {
    return aliases.find(alias => alias.on_field.includes(field))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Side-by-Side Row Comparison</DialogTitle>
          <DialogDescription>
            Detailed comparison between confirmation and booking rows
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Confirmation Column */}
            <div className="space-y-2">
              <div className="sticky top-0 bg-background pb-2 border-b">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Confirmation Data
                </h3>
              </div>

              {allFields.map(field => {
                const value = confirmationRow?.[field]
                const isMatching = isFieldMatching(field)
                const alias = getAliasForField(field)
                const isValid = validationStatus[field]

                return (
                  <div
                    key={`conf-${field}`}
                    className={`p-3 rounded-lg border-2 ${
                      !isMatching
                        ? 'border-destructive/30 bg-destructive/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-muted-foreground capitalize">
                        {field.replace(/_/g, ' ')}
                      </p>
                      <div className="flex items-center gap-1">
                        {alias && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              alias.source === 'provided'
                                ? 'bg-green-500/20 text-green-700 border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30'
                            }`}
                          >
                            Alias
                          </Badge>
                        )}
                        {isValid !== undefined && (
                          isValid ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                          )
                        )}
                      </div>
                    </div>

                    {alias && (
                      <div className="flex items-center gap-1 mb-2 text-xs">
                        <span className="line-through text-muted-foreground font-mono">
                          {alias.source_name}
                        </span>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <span className="font-mono font-medium">
                          {alias.target_name}
                        </span>
                      </div>
                    )}

                    <p className="font-mono text-sm break-words">
                      {value !== undefined && value !== null ? String(value) : (
                        <span className="text-muted-foreground italic">null</span>
                      )}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Booking Column */}
            <div className="space-y-2">
              <div className="sticky top-0 bg-background pb-2 border-b">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Booking Data
                </h3>
              </div>

              {allFields.map(field => {
                const value = bookingRow?.[field]
                const isMatching = isFieldMatching(field)

                return (
                  <div
                    key={`book-${field}`}
                    className={`p-3 rounded-lg border-2 ${
                      !isMatching
                        ? 'border-destructive/30 bg-destructive/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    <p className="text-xs font-medium text-muted-foreground capitalize mb-1">
                      {field.replace(/_/g, ' ')}
                    </p>
                    <p className="font-mono text-sm break-words">
                      {value !== undefined && value !== null ? String(value) : (
                        <span className="text-muted-foreground italic">null</span>
                      )}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </ScrollArea>

        {/* Summary Footer */}
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">
                  {allFields.filter(isFieldMatching).length} Matching
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-muted-foreground">
                  {allFields.filter(f => !isFieldMatching(f)).length} Mismatches
                </span>
              </div>
            </div>
            <Badge
              variant={
                allFields.filter(isFieldMatching).length === allFields.length
                  ? 'default'
                  : 'destructive'
              }
            >
              {Math.round((allFields.filter(isFieldMatching).length / allFields.length) * 100)}% Match
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
