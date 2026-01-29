'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'

interface Alias {
  source_name: string
  target_name: string
  used: boolean
  count: number
  source: 'provided' | 'infered'
  on_field: string[]
}

interface AliasesPanelProps {
  aliases: Alias[]
  onSaveAlias?: (alias: Alias, saveLevel: 'global' | 'counterparty') => void
}

export function AliasesPanel({ aliases, onSaveAlias }: AliasesPanelProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [selectedAlias, setSelectedAlias] = useState<Alias | null>(null)
  const [saveLevel, setSaveLevel] = useState<'global' | 'counterparty'>('global')

  const openSaveDialog = (alias: Alias) => {
    setSelectedAlias(alias)
    setSaveLevel('global')
    setSaveDialogOpen(true)
  }

  const handleSave = () => {
    if (selectedAlias && onSaveAlias) {
      onSaveAlias(selectedAlias, saveLevel)
    }
    setSaveDialogOpen(false)
    setSelectedAlias(null)
  }

  const usedAliases = aliases.filter((a) => a.used)

  if (usedAliases.length === 0) {
    return (
      <div className="text-center py-8 px-4 rounded-lg border border-dashed bg-muted/30">
        <p className="text-sm text-muted-foreground">No field aliases used in this processing</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        {usedAliases.map((alias, index) => (
          <div
            key={`alias-${index}`}
            className="flex items-center justify-between p-3 rounded-md hover:bg-muted/30 transition-colors group"
          >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {alias.source === 'provided' ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap mb-1">
                  <code className="text-xs font-mono text-muted-foreground truncate">
                    {alias.source_name}
                  </code>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/60 flex-shrink-0" />
                  <code className="text-xs font-mono text-foreground font-medium truncate">
                    {alias.target_name}
                  </code>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  {alias.count}x on {alias.on_field.join(', ')}
                </p>
              </div>
            </div>

            <Button
              onClick={() => openSaveDialog(alias)}
              variant="ghost"
              size="sm"
              className="flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs"
            >
              Save
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Field Alias</DialogTitle>
            <DialogDescription>Choose the scope for saving this alias transformation</DialogDescription>
          </DialogHeader>

          {selectedAlias && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Transformation</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono flex-1 truncate">{selectedAlias.source_name}</code>
                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  <code className="text-xs font-mono flex-1 truncate">{selectedAlias.target_name}</code>
                </div>
              </div>

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
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Alias</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
