'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Sparkles } from 'lucide-react'

interface ReprocessButtonProps {
  pendingChanges: number
  onReprocess: () => void
  isLoading?: boolean
}

export function ReprocessButton({
  pendingChanges,
  onReprocess,
  isLoading = false,
}: ReprocessButtonProps) {
  if (pendingChanges === 0) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-50 animate-pulse" />

        <Button
          onClick={onReprocess}
          disabled={isLoading}
          size="lg"
          className="relative gap-2 px-6 py-6 text-base font-semibold shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Reprocessing...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Reprocess with Changes
              <Badge className="ml-2 bg-white/20 text-white hover:bg-white/30">
                {pendingChanges}
              </Badge>
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
