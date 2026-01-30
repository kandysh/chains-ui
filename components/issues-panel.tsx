'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, Plus, Trash2, ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alias, ConfirmationRow, BookingMatch } from '@/lib/types'

interface UnmatchedValueMatch {
  value: string
  field: string
  bookingValue?: string
  hasMatch: boolean
  existingAlias?: Alias
}

interface IssuesPanelProps {
  unmatchedValues: Record<string, string[]>
  unknownFields: string[]
  textExcerpt?: string
  confirmationRows?: ConfirmationRow[]
  bookingMatchesRows?: BookingMatch[]
  usedAliases?: Alias[]
  onSaveAsAlias?: (alias: any, saveLevel: 'global' | 'counterparty') => void
  onDeleteAlias?: (alias: Alias, saveLevel: 'global' | 'counterparty') => void
}

export function IssuesPanel({
  unmatchedValues,
  unknownFields,
  textExcerpt,
  confirmationRows = [],
  bookingMatchesRows = [],
  usedAliases = [],
  onSaveAsAlias,
  onDeleteAlias,
}: IssuesPanelProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<UnmatchedValueMatch | null>(null)
  const [targetName, setTargetName] = useState('')
  const [saveLevel, setSaveLevel] = useState<'global' | 'counterparty'>('global')
  const [isCreatingNewAlias, setIsCreatingNewAlias] = useState(true)

  const hasUnmatched = Object.keys(unmatchedValues).length > 0
  const hasUnknown = unknownFields.length > 0

  // Match unmatched values with their booking counterparts
  const buildUnmatchedValueMatches = (): UnmatchedValueMatch[] => {
    const matches: UnmatchedValueMatch[] = []

    for (const [field, values] of Object.entries(unmatchedValues)) {
      for (const value of values) {
        // Find if this value exists in confirmation_rows
        const confValue = confirmationRows.find((row: any) => {
          const fieldKey = field.toLowerCase().replace(/\s+/g, '_')
          return String(row[fieldKey as keyof ConfirmationRow]) === value
        })

        // Find corresponding booking value for this field
        const bookingValue = bookingMatchesRows.length > 0 ? bookingMatchesRows[0]?.[field.toLowerCase().replace(/\s+/g, '_') as keyof BookingMatch] : undefined

        // Check if there's already an alias for this value
        const existingAlias = usedAliases.find(a => a.source_name === value && a.on_field.includes(field))

        matches.push({
          value,
          field,
          bookingValue: bookingValue ? String(bookingValue) : undefined,
          hasMatch: !!bookingValue,
          existingAlias,
        })
      }
    }

    return matches
  }

  const unmatchedValueMatches = buildUnmatchedValueMatches()

  const openSaveDialog = (match: UnmatchedValueMatch) => {
    setSelectedValue(match)
    setTargetName(match.existingAlias?.target_name || '')
    setIsCreatingNewAlias(!match.existingAlias)
    setSaveLevel('global')
    setSaveDialogOpen(true)
  }

  const handleSaveAsAlias = () => {
    if (selectedValue && targetName && onSaveAsAlias) {
      onSaveAsAlias(
        {
          source_name: selectedValue.value,
          target_name: targetName,
          on_field: [selectedValue.field],
        },
        saveLevel
      )
    }
    setSaveDialogOpen(false)
    setSelectedValue(null)
    setIsCreatingNewAlias(true)
  }

  const handleDeleteAlias = () => {
    if (selectedValue?.existingAlias && onDeleteAlias) {
      onDeleteAlias(selectedValue.existingAlias, saveLevel)
    }
    setSaveDialogOpen(false)
    setSelectedValue(null)
    setIsCreatingNewAlias(true)
  }

  return (
    <div className="space-y-6">
      {hasUnmatched && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange" />
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Unmatched Values - Can be saved as aliases</h4>
          </div>

          {unmatchedValueMatches.map((match, i) => (
            <div
              key={`${match.field}-${i}`}
              className={`flex items-center justify-between p-4 rounded border transition-all group ${
                match.hasMatch
                  ? 'border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10'
                  : 'border-orange/20 bg-orange/5 hover:bg-orange/10'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  {match.hasMatch && (
                    <div className="flex items-center gap-2.5 flex-wrap mb-2">
                      <code className="text-xs font-mono text-muted-foreground bg-muted/40 px-2 py-1 rounded truncate">
                        {match.value}
                      </code>
                      <ArrowRight className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                      <code className="text-xs font-mono text-foreground font-semibold bg-blue-500/10 px-2 py-1 rounded truncate">
                        {match.bookingValue}
                      </code>
                      <span className="text-xs text-muted-foreground">in</span>
                      <span className="text-xs font-semibold text-foreground bg-blue-500/10 px-2 py-1 rounded">
                        {match.field}
                      </span>
                    </div>
                  )}
                  {!match.hasMatch && (
                    <div className="flex items-center gap-2.5 flex-wrap mb-2">
                      <code className="text-xs font-mono text-muted-foreground bg-muted/40 px-2 py-1 rounded truncate">
                        {match.value}
                      </code>
                      <span className="text-xs text-muted-foreground">in</span>
                      <span className="text-xs font-semibold text-foreground bg-orange/10 px-2 py-1 rounded">
                        {match.field}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {match.hasMatch && match.existingAlias
                      ? `Alias saved: ${match.value} → ${match.existingAlias.target_name}`
                      : match.hasMatch
                        ? `Found value mismatch - click to create/manage alias`
                        : `Found in document but not in booking data - create an alias`
                    }
                  </p>
                </div>
              </div>

              <Button
                onClick={() => openSaveDialog(match)}
                variant="outline"
                size="sm"
                className="flex-shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {match.existingAlias ? (
                  <>
                    <Trash2 className="w-3 h-3 mr-1" />
                    Remove
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {hasUnknown && (
        <div className="rounded border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Unknown Fields</h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {unknownFields.map((field, i) => (
              <Badge key={`unknown-${i}`} variant="info" className="text-xs font-medium">
                {field}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {textExcerpt && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Sample Content</h4>
          <div className="bg-muted/40 rounded p-4 max-h-48 overflow-y-auto border border-border/50 font-mono text-xs text-muted-foreground leading-relaxed">
            <code className="whitespace-pre-wrap">
              {textExcerpt}
            </code>
          </div>
        </div>
      )}

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedValue?.hasMatch ? 'Value Mismatch Alias' : 'Create Alias from Unmatched Value'}
            </DialogTitle>
            <DialogDescription>
              {selectedValue?.hasMatch
                ? 'Manage the mapping between confirmation and booking values'
                : 'Save this value as an alias for future processing'}
            </DialogDescription>
          </DialogHeader>

          {selectedValue && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-2">
                  {selectedValue.hasMatch ? 'Value Mismatch' : 'Source Value'}
                </p>
                {selectedValue.hasMatch ? (
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono flex-1 truncate">{selectedValue.value}</code>
                    <ArrowRight className="w-3 h-3 flex-shrink-0 text-muted-foreground/50" />
                    <code className="text-xs font-mono flex-1 truncate text-foreground font-semibold">
                      {selectedValue.bookingValue}
                    </code>
                  </div>
                ) : (
                  <code className="text-sm font-mono">{selectedValue.value}</code>
                )}
              </div>

              {isCreatingNewAlias ? (
                <div>
                  <label htmlFor="targetName" className="text-sm font-medium block mb-2">
                    {selectedValue.hasMatch ? 'Map to Booking Value' : 'Map to Canonical Value'}
                  </label>
                  <input
                    id="targetName"
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    placeholder={selectedValue.hasMatch ? 'e.g., booking value' : 'e.g., canonical value'}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedValue.hasMatch
                      ? 'This mapping will be saved for this field'
                      : 'This value will be recognized in future processing'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted transition-colors">
                    <input
                      type="radio"
                      name="saveLevel"
                      value="global"
                      checked={saveLevel === 'global'}
                      onChange={(e) => setSaveLevel(e.target.value as 'global' | 'counterparty')}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-medium">Save Globally</p>
                      <p className="text-xs text-muted-foreground">
                        Available for all counterparties and future processing
                      </p>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted transition-colors">
                    <input
                      type="radio"
                      name="saveLevel"
                      value="counterparty"
                      checked={saveLevel === 'counterparty'}
                      onChange={(e) => setSaveLevel(e.target.value as 'global' | 'counterparty')}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="text-sm font-medium">Save at Counterparty Level</p>
                      <p className="text-xs text-muted-foreground">
                        Only for this specific counterparty
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            {selectedValue?.existingAlias && !isCreatingNewAlias ? (
              <Button
                variant="destructive"
                onClick={handleDeleteAlias}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Alias
              </Button>
            ) : (
              <Button onClick={handleSaveAsAlias} disabled={!targetName}>
                {selectedValue?.hasMatch ? 'Save Mapping' : 'Create Alias'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
