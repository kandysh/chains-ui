'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

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
  onRejectAlias?: (alias: Alias) => void
}

export function AliasesPanel({ aliases, onSaveAlias, onRejectAlias }: AliasesPanelProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set())
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [selectedAlias, setSelectedAlias] = useState<Alias | null>(null)
  const [saveLevel, setSaveLevel] = useState<'global' | 'counterparty'>('global')

  const toggleRowExpand = (index: number) => {
    const updated = new Set(expandedRows)
    if (updated.has(index)) {
      updated.delete(index)
    } else {
      updated.add(index)
    }
    setExpandedRows(updated)
  }

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

  const sourceColor = (source: 'provided' | 'infered') => {
    return source === 'provided' ? 'bg-green-500/20 text-green-700 dark:text-green-400' : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
  }

  const sourceLabel = (source: 'provided' | 'infered') => {
    return source === 'provided' ? 'Provided' : 'Inferred'
  }

  const providedAliases = aliases.filter(a => a.source === 'provided')
  const inferredAliases = aliases.filter(a => a.source === 'infered')

  const AliasCard = ({ alias, index }: { alias: Alias; index: number }) => {
    const isExpanded = expandedRows.has(index)

    return (
      <div className={`group relative rounded-lg border-2 transition-all duration-200 ${
        alias.used
          ? 'border-border hover:border-primary/50 bg-card hover:shadow-md'
          : 'border-border/50 bg-muted/30 opacity-70'
      }`}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={sourceColor(alias.source)}>
                  {sourceLabel(alias.source)}
                </Badge>
                {alias.used && (
                  <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Active
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 bg-muted/50 rounded-md px-3 py-2 border">
                  <p className="text-xs text-muted-foreground mb-0.5">Source Field</p>
                  <p className="font-mono text-sm font-medium">{alias.source_name}</p>
                </div>

                <div className="flex flex-col items-center justify-center px-2">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 bg-primary/5 rounded-md px-3 py-2 border border-primary/20">
                  <p className="text-xs text-muted-foreground mb-0.5">Target Field</p>
                  <p className="font-mono text-sm font-medium text-primary">{alias.target_name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Used</p>
                <p className="text-lg font-bold text-foreground">{alias.count}×</p>
              </div>

              {alias.used && alias.source === 'infered' && (
                <div className="flex items-center gap-1.5">
                  <Button
                    onClick={() => openSaveDialog(alias)}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 bg-green-500/10 hover:bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-400"
                    title="Approve and save alias"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </Button>
                  <Button
                    onClick={() => onRejectAlias?.(alias)}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 bg-destructive/10 hover:bg-destructive/20 border-destructive/30 text-destructive"
                    title="Reject alias"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              )}

              {alias.used && alias.source === 'provided' && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Stored</span>
                </div>
              )}
            </div>
          </div>

          {alias.on_field.length > 0 && (
            <>
              <button
                onClick={() => toggleRowExpand(index)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full mt-2 pt-2 border-t"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    Hide applied fields ({alias.on_field.length})
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    Show applied fields ({alias.on_field.length})
                  </>
                )}
              </button>

              {isExpanded && (
                <div className="mt-3 p-3 rounded-md bg-muted/30 border">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Applied on:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {alias.on_field.map((field, i) => (
                      <Badge key={`${field}-${i}`} variant="outline" className="text-xs">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <CardTitle>Field Transformation Map</CardTitle>
            <CardDescription>
              Visual representation of field name transformations and mappings
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium">
              {providedAliases.length} Provided
            </div>
            <div className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-medium">
              {inferredAliases.length} Inferred
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {aliases.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <p className="text-muted-foreground font-medium">No aliases used in this processing</p>
            <p className="text-sm text-muted-foreground/70 mt-1">All field names matched directly</p>
          </div>
        ) : (
          <div className="space-y-6">
            {providedAliases.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-green-500/20 to-transparent" />
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    User-Provided Aliases
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-green-500/20 to-transparent" />
                </div>
                <div className="grid gap-3">
                  {providedAliases.map((alias, idx) => (
                    <AliasCard key={`provided-${idx}`} alias={alias} index={aliases.indexOf(alias)} />
                  ))}
                </div>
              </div>
            )}

            {inferredAliases.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/20 to-transparent" />
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    AI-Inferred Aliases
                  </h3>
                  <div className="h-px flex-1 bg-gradient-to-l from-yellow-500/20 to-transparent" />
                </div>
                <div className="grid gap-3">
                  {inferredAliases.map((alias, idx) => (
                    <AliasCard key={`inferred-${idx}`} alias={alias} index={aliases.indexOf(alias)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Alias</DialogTitle>
            <DialogDescription>
              Save the alias transformation for future use
            </DialogDescription>
          </DialogHeader>

          {selectedAlias && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">Transformation</p>
                <p className="font-mono text-sm">
                  {selectedAlias.source_name} → {selectedAlias.target_name}
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
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
                      Available for all counterparties
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
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
    </Card>
  )
}
