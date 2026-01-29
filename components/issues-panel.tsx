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
  onSaveAsAlias?: (alias: any, saveLevel: 'global' | 'counterparty') => void
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
      onSaveAsAlias({ source_name: selectedValue.value, target_name: targetName }, 'global')
    }
    setSaveDialogOpen(false)
    setSelectedValue(null)
  }

  return (
    <div className="space-y-6">
      {hasUnmatched && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange" />
            <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Unmatched Values - Can be saved as aliases</h4>
          </div>

          {Object.entries(unmatchedValues).map(([field, values]) => (
            <div key={field} className="space-y-2">
              {values.map((value, i) => (
                <div
                  key={`${field}-${i}`}
                  className={`flex items-center justify-between p-4 rounded border transition-all group ${
                    'border-orange/20 bg-orange/5 hover:bg-orange/10'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap mb-2">
                        <code className="text-xs font-mono text-muted-foreground bg-muted/40 px-2 py-1 rounded truncate">
                          {value}
                        </code>
                        <span className="text-xs text-muted-foreground">in</span>
                        <span className="text-xs font-semibold text-foreground bg-orange/10 px-2 py-1 rounded">
                          {field}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Found in document but not in booking data - create an alias to map it to a canonical value
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => openSaveDialog(value, field)}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                </div>
              ))}
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
