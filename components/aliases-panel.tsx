"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { Alias } from "@/lib/types";

interface AliasesPanelProps {
  aliases: Alias[];
  onDeleteAlias?: (alias: Alias, saveLevel: "global" | "counterparty") => void;
}

export function AliasesPanel({ aliases, onDeleteAlias }: AliasesPanelProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedAlias, setSelectedAlias] = useState<Alias | null>(null);
  const [saveLevel, setSaveLevel] = useState<"global" | "counterparty">(
    "global",
  );

  const openSaveDialog = (alias: Alias) => {
    setSelectedAlias(alias);
    setSaveLevel("global");
    setSaveDialogOpen(true);
  };

  const handleRemove = () => {
    if (selectedAlias && onDeleteAlias) {
      onDeleteAlias(selectedAlias, saveLevel);
    }
    setSaveDialogOpen(false);
    setSelectedAlias(null);
  };

  const usedAliases = aliases.filter((a) => a.used);

  if (usedAliases.length === 0) {
    return (
      <div className="text-center py-8 px-4 rounded border border-dashed bg-muted/30">
        <p className="text-sm text-muted-foreground">
          No value aliases used in this processing
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {usedAliases.map((alias, index) => (
          <div
            key={`alias-${index}`}
            className={`flex items-center justify-between p-4 rounded border transition-all group ${
              alias.source === "provided"
                ? "border-green/20 bg-green/5 hover:bg-green/10"
                : "border-orange/20 bg-orange/5 hover:bg-orange/10"
            }`}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {alias.source === "provided" ? (
                <CheckCircle2 className="w-5 h-5 text-green flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap mb-2">
                  <code className="text-xs font-mono text-muted-foreground bg-muted/40 px-2 py-1 rounded truncate">
                    {alias.source_name}
                  </code>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                  <code className="text-xs font-mono text-foreground font-semibold bg-primary/10 px-2 py-1 rounded truncate">
                    {alias.target_name}
                  </code>
                </div>

                <p className="text-xs text-muted-foreground">
                  Applied <span className="font-semibold">{alias.count}x</span>{" "}
                  on {alias.on_field.join(", ")}
                </p>
              </div>
            </div>

            <Button
              onClick={() => openSaveDialog(alias)}
              variant="outline"
              size="sm"
              className="flex-shrink-0 ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Remove
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Value Alias</DialogTitle>
            <DialogDescription>
              Choose the scope for removing this value alias
            </DialogDescription>
          </DialogHeader>

          {selectedAlias && (
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md">
                <p className="text-xs text-muted-foreground mb-1">
                  Transformation
                </p>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono flex-1 truncate">
                    {selectedAlias.source_name}
                  </code>
                  <ArrowRight className="w-3 h-3 flex-shrink-0" />
                  <code className="text-xs font-mono flex-1 truncate">
                    {selectedAlias.target_name}
                  </code>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-muted transition-colors">
                  <input
                    type="radio"
                    name="saveLevel"
                    value="global"
                    checked={saveLevel === "global"}
                    onChange={(e) =>
                      setSaveLevel(e.target.value as "global" | "counterparty")
                    }
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
                    checked={saveLevel === "counterparty"}
                    onChange={(e) =>
                      setSaveLevel(e.target.value as "global" | "counterparty")
                    }
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="text-sm font-medium">
                      Save at Counterparty Level
                    </p>
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
            <Button onClick={handleRemove} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Alias
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
