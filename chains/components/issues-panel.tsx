'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Info } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface IssuesPanelProps {
  unmatchedValues: Record<string, string[]>
  unknownFields: string[]
  textExcerpt?: string
}

export function IssuesPanel({
  unmatchedValues,
  unknownFields,
  textExcerpt,
}: IssuesPanelProps) {
  const hasUnmatched = Object.keys(unmatchedValues).length > 0
  const hasUnknown = unknownFields.length > 0
  const hasIssues = hasUnmatched || hasUnknown

  if (!hasIssues && !textExcerpt) {
    return null
  }

  return (
    <Card className="border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 via-transparent to-orange-500/5">
      <CardHeader className="bg-gradient-to-r from-yellow-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              Processing Issues & Warnings
            </CardTitle>
            <CardDescription>
              Items flagged for review or manual verification
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1.5 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {Object.keys(unmatchedValues).length + unknownFields.length} Issues
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="unmatched" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-muted/50">
            {hasUnmatched && (
              <TabsTrigger value="unmatched" className="data-[state=active]:bg-background gap-2 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Unmatched
              </TabsTrigger>
            )}
            {hasUnknown && (
              <TabsTrigger value="unknown" className="data-[state=active]:bg-background gap-2 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Unknown
              </TabsTrigger>
            )}
            {textExcerpt && (
              <TabsTrigger value="excerpt" className="data-[state=active]:bg-background gap-2 py-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excerpt
              </TabsTrigger>
            )}
          </TabsList>

          {hasUnmatched && (
            <TabsContent value="unmatched" className="space-y-3 mt-4">
              {Object.entries(unmatchedValues).map(([field, values]) => (
                <div key={field} className="border-2 rounded-xl p-4 bg-gradient-to-r from-background to-muted/30 hover:border-yellow-500/30 transition-colors">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground capitalize">
                        {field.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {values.length} unmatched value{values.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {values.map((value, i) => (
                      <Badge
                        key={`${field}-${i}`}
                        variant="outline"
                        className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/30 font-mono text-xs"
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          )}

          {hasUnknown && (
            <TabsContent value="unknown" className="space-y-3 mt-4">
              <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-2 border-blue-500/20 rounded-xl p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {unknownFields.length} Unrecognized Field{unknownFields.length !== 1 ? 's' : ''} Detected
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      These fields were found in the document but are not part of the standard field mapping schema
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {unknownFields.map((field, i) => (
                    <Badge
                      key={`unknown-${i}`}
                      variant="secondary"
                      className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30 font-mono"
                    >
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          )}

          {textExcerpt && (
            <TabsContent value="excerpt" className="mt-4">
              <div className="border-2 rounded-xl overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 border-b flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-xs font-medium text-muted-foreground">Source Document Excerpt</span>
                </div>
                <div className="bg-muted/30 rounded-b-xl p-4 max-h-64 overflow-y-auto">
                  <code className="text-xs text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {textExcerpt}
                  </code>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
