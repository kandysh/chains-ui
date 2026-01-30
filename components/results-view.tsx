"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ValidationStatusComponent } from "./validation-status";
import { AliasesPanel } from "./aliases-panel";
import { ConfirmationRowsTable } from "./confirmation-rows-table";
import { BookingMatchesTable } from "./booking-matches-table";
import { IssuesPanel } from "./issues-panel";
import { ChevronDown, FileText } from "lucide-react";
import { ProcessResult } from "@/lib/types";

interface ResultsViewProps {
  results: ProcessResult;
  onSaveAlias?: (alias: any, saveLevel: "global" | "counterparty") => void;
  onDeleteAlias?: (alias: any, saveLevel: "global" | "counterparty") => void;
}

export function ResultsView({ results, onSaveAlias, onDeleteAlias }: ResultsViewProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<number>>(new Set([0]));

  const toggleFile = (index: number) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedFiles(newExpanded);
  };

  const buildTransformedValuesMap = (fileResult: any) => {
    const map = new Map<
      string,
      Map<string, { sourceValue: string; targetValue: string; alias: string }>
    >();
    fileResult.aliases_used.forEach((alias: any) => {
      if (alias.used) {
        alias.on_field.forEach((field: string) => {
          if (!map.has(field)) {
            map.set(field, new Map());
          }
          map.get(field)!.set(alias.source_name, {
            sourceValue: alias.source_name,
            targetValue: alias.target_name,
            alias: alias.source_name + " → " + alias.target_name,
          });
        });
      }
    });
    return map;
  };

  const getValidationStats = (fileResult: any) => {
    const invalidFields = Object.entries(fileResult.validation_status)
      .filter(([_, valid]) => !valid)
      .map(([field]) => field);
    const unmatchedCount = Object.values(fileResult.unmatched_values).reduce(
      (acc: number, values: any) => acc + values.length,
      0,
    );
    return { invalidFields, unmatchedCount };
  };

  const getFileStatus = (fileResult: any) => {
    const { invalidFields, unmatchedCount } = getValidationStats(fileResult);
    const hasAliasesUsed = fileResult.aliases_used.some((a: any) => a.used);

    // RED: Any validation failures or unmatched values
    if (invalidFields.length > 0 || unmatchedCount > 0) {
      return { color: "red", label: "Mismatches" };
    }

    // YELLOW: Aliases were used
    if (hasAliasesUsed) {
      return { color: "yellow", label: "Uses Aliases" };
    }

    // GREEN: Perfect match, no aliases needed
    return { color: "green", label: "Perfect Match" };
  };

  return (
    <div className="w-full space-y-4">
      {results.files.map((fileResult, index) => {
        const { invalidFields, unmatchedCount } =
          getValidationStats(fileResult);
        const fileStatus = getFileStatus(fileResult);
        const isExpanded = expandedFiles.has(index);

        const statusColorMap = {
          green: {
            bg: "bg-green/10",
            border: "border-green/30",
            text: "text-green",
            light: "bg-green/5",
          },
          yellow: {
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/30",
            text: "text-yellow-600 dark:text-yellow-500",
            light: "bg-yellow-500/5",
          },
          red: {
            bg: "bg-destructive/10",
            border: "border-destructive/30",
            text: "text-destructive",
            light: "bg-destructive/5",
          },
        };
        const colors =
          statusColorMap[fileStatus.color as keyof typeof statusColorMap];

        return (
          <div
            key={index}
            className={`rounded-lg border overflow-hidden transition-all hover:shadow-sm ${colors.border} ${isExpanded ? colors.light : "border-border/50 hover:border-border/80"}`}
          >
            <button
              onClick={() => toggleFile(index)}
              className={`w-full flex items-center justify-between px-6 py-4 transition-colors ${
                isExpanded
                  ? `${colors.light} border-b ${colors.border}`
                  : `bg-card/40 hover:${colors.light}`
              }`}
            >
              <div className="flex items-center gap-4 flex-1 text-left min-w-0">
                <ChevronDown
                  className={`w-5 h-5 text-primary transition-transform flex-shrink-0 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg}`}
                >
                  <FileText className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground truncate">
                    {fileResult.filename}
                  </h3>
                  <div className="flex gap-4 mt-2 text-xs flex-wrap">
                    <span className="text-muted-foreground">
                      {fileResult.confirmation_rows.length} rows
                    </span>
                    <span className="text-muted-foreground">
                      {fileResult.booking_matches_rows.length} matches
                    </span>
                    {invalidFields.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-destructive/15 text-destructive font-medium">
                        {invalidFields.length} invalid
                      </span>
                    )}
                    {unmatchedCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-orange/15 text-orange font-medium">
                        {unmatchedCount} unmatched
                      </span>
                    )}
                  </div>
                </div>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-semibold text-xs ml-4 flex-shrink-0 ${colors.bg} ${colors.text}`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${colors.text === "text-green" ? "bg-green" : colors.text === "text-destructive" ? "bg-destructive" : "bg-yellow-600 dark:bg-yellow-500"}`}
                  ></span>
                  {fileStatus.label}
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="space-y-8 px-6 py-6 bg-background/50">
                {/* Validation Status */}
                <div>
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary"></span>
                    Validation Status
                  </h4>
                  <ValidationStatusComponent
                    status={fileResult.validation_status}
                  />
                </div>

                {/* Value Aliases */}
                {fileResult.aliases_used.some((a) => a.used) && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-teal"></span>
                      Value Aliases
                    </h4>
                    <AliasesPanel
                      aliases={fileResult.aliases_used}
                      onDeleteAlias={onDeleteAlias}
                    />
                  </div>
                )}

                {/* Issues */}
                {(Object.keys(fileResult.unmatched_values).length > 0 ||
                  fileResult.unknown_fields.length > 0 ||
                  fileResult.text_excerpt) && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-orange"></span>
                      Issues & Notes
                    </h4>
                    <IssuesPanel
                      unmatchedValues={fileResult.unmatched_values}
                      unknownFields={fileResult.unknown_fields}
                      textExcerpt={fileResult.text_excerpt}
                      confirmationRows={fileResult.confirmation_rows}
                      bookingMatchesRows={fileResult.booking_matches_rows}
                      usedAliases={fileResult.aliases_used}
                      onSaveAsAlias={onSaveAlias}
                    />
                  </div>
                )}

                {/* Confirmation Rows */}
                {fileResult.confirmation_rows.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary"></span>
                      Confirmation Rows
                    </h4>
                    <ConfirmationRowsTable
                      rows={fileResult.confirmation_rows}
                      transformedValues={buildTransformedValuesMap(fileResult)}
                    />
                  </div>
                )}

                {/* Booking Matches */}
                {fileResult.booking_matches_rows.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-teal"></span>
                      Booking Matches
                    </h4>
                    <BookingMatchesTable
                      rows={fileResult.booking_matches_rows}
                      transformedValues={buildTransformedValuesMap(fileResult)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
