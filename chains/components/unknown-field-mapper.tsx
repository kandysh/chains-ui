'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sparkles, ArrowRight, X } from 'lucide-react'

interface UnknownFieldMapperProps {
  unknownField: string
  canonicalFields: string[]
  suggestedField?: string
  onMap: (unknownField: string, canonicalField: string) => void
  onIgnore: (unknownField: string) => void
}

export function UnknownFieldMapper({
  unknownField,
  canonicalFields,
  suggestedField,
  onMap,
  onIgnore,
}: UnknownFieldMapperProps) {
  const [selectedField, setSelectedField] = useState<string>(suggestedField || '')

  const handleApplyMapping = () => {
    if (selectedField) {
      onMap(unknownField, selectedField)
    }
  }

  return (
    <div className="border-2 border-purple-500/20 rounded-xl p-4 bg-gradient-to-r from-purple-500/5 to-blue-500/5">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="outline"
              className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30 font-mono"
            >
              {unknownField}
            </Badge>
            <ArrowRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            Map this unknown field to a canonical field
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select value={selectedField} onValueChange={setSelectedField}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select canonical field..." />
          </SelectTrigger>
          <SelectContent>
            {suggestedField && (
              <SelectItem
                value={suggestedField}
                className="bg-green-500/10 font-semibold"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-green-600" />
                  <span>{suggestedField}</span>
                  <Badge variant="outline" className="text-xs bg-green-500/20 text-green-700 border-green-500/30">
                    Suggested
                  </Badge>
                </div>
              </SelectItem>
            )}
            {canonicalFields
              .filter(field => field !== suggestedField)
              .map(field => (
                <SelectItem key={field} value={field}>
                  {field}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleApplyMapping}
          disabled={!selectedField}
          size="sm"
          className="gap-1.5 bg-green-500 hover:bg-green-600 text-white"
        >
          <ArrowRight className="w-4 h-4" />
          Apply
        </Button>

        <Button
          onClick={() => onIgnore(unknownField)}
          variant="outline"
          size="sm"
          className="gap-1.5"
        >
          <X className="w-4 h-4" />
          Ignore
        </Button>
      </div>
    </div>
  )
}
