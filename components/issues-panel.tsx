'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface IssuesPanelProps {
  unmatchedValues: Record<string, string[]>
  unknownFields: string[]
  textExcerpt?: string
  onSaveAsAlias?: (value: string, targetField: string) => void
}

export function IssuesPanel({
  unmatchedValues,
  unknownFields,
  textExcerpt,
  onSaveAsAlias,
}: IssuesPanelProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState<{ value: string; field: string } | null>(null)
  const [targetName, setTargetName] = useState('')

  const hasUnmatched = Object.keys(unmatchedValues).length > 0
  const hasUnknown = unknownFields.length > 0

  const openSaveDialog = (value: string, field: string) => {
    setSelectedValue({ value, field })
    setTargetName('')
    setSaveDialogOpen(true)
  }

  const handleSaveAsAlias = () => {
    if (selectedValue && targetName && onSaveAsAlias) {
      onSaveAsAlias(selectedValue.value, targetName)
    }
    setSaveDialogOpen(false)
    setSelectedValue(null)
  }

  return (
    <div className="space-y-5">
      {hasUnmatched && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Unmatched Values</h4>
          </div>

          {Object.entries(unmatchedValues).map(([field, values]) => (
            <div key={field} className="mb-3">
              <p className="text-xs text-muted-foreground capitalize mb-2">{field}</p>
              <div className="flex flex-wrap gap-1.5">
                {values.map((value, i) => (
                  <div
                    key={`${field}-${i}`}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded text-xs group hover:bg-muted/30 transition-colors"
                  >
                    <code className="text-amber-700 dark:text-amber-400 font-mono text-xs">{value}</code>
                    <Button
                      onClick={() => openSaveDialog(value, field)}
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Save as alias"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {hasUnknown && (
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-500" />
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Unknown Fields</h4>
          </div>

          <div className="flex flex-wrap gap-2">
            {unknownFields.map((field, i) => (
              <Badge key={`unknown-${i}`} variant="outline" className="text-xs font-normal">
                {field}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {textExcerpt && (
        <div>
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2.5">Sample Content</h4>
          <div className="bg-muted/30 rounded-md p-3 max-h-40 overflow-y-auto border border-border/50">
            <code className="text-xs text-muted-foreground whitespace-pre-wrap font-mono">
              {textExcerpt}
            </code>
          </div>
        </div>
      )}

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Alias from Unmatched Value</DialogTitle>
            <DialogDescription>
              Save this value as an alias for future processing
            </DialogDescription>
          </DialogHeader>

          {selectedValue && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Source Value</p>
                <code className="text-sm font-mono">{selectedValue.value}</code>
              </div>

              <div>
                <label htmlFor="targetName" className="text-sm font-medium block mb-2">
                  Map to Field Name
                </label>
                <input
                  id="targetName"
                  type="text"
                  value={targetName}
                  onChange={(e) => setTargetName(e.target.value)}
                  placeholder="e.g., counterparty"
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This value will be recognized as the target field in future processing
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAsAlias} disabled={!targetName}>
              Create Alias
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
