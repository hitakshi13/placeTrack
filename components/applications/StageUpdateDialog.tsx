"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useUpdateStage } from "@/hooks/useApplications";
import { APPLICATION_STAGES } from "@/lib/constants";
import { formatLPA, formatDate, cn } from "@/lib/utils";
import type { Application } from "@/types";

interface StageUpdateDialogProps {
  application: Application;
  open: boolean;
  onClose: () => void;
}

export function StageUpdateDialog({ application, open, onClose }: StageUpdateDialogProps) {
  const updateStage = useUpdateStage(application.id);

  const handleStageChange = (stage: string) => {
    updateStage.mutate(
      { stage: stage as never },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm animate-fade-in" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-popover p-6 shadow-lg animate-fade-in"
          aria-describedby="application-detail-description"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Building2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <Dialog.Title className="text-sm font-semibold text-foreground">
                  {application.company.name}
                </Dialog.Title>
                <p className="text-xs text-muted-foreground">{application.company.role}</p>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                className="rounded-md p-1 text-muted-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description id="application-detail-description" className="sr-only">
            View and update the stage of your application to {application.company.name}.
          </Dialog.Description>

          <div className="space-y-3 text-sm mb-5">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Package</span>
              <span className="font-medium text-foreground">
                {formatLPA(application.company.packageLpa)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Applied on</span>
              <span className="font-medium text-foreground">
                {formatDate(application.appliedAt)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current stage</span>
              <Badge variant="outline">{application.stage}</Badge>
            </div>
          </div>

          {/* OA records summary */}
          {application.oaRecords.length > 0 && (
            <div className="mb-4 rounded-md border border-border p-3">
              <p className="text-xs font-medium text-foreground mb-2">OA Records</p>
              {application.oaRecords.map((oa) => (
                <div key={oa.id} className="flex justify-between text-xs text-muted-foreground">
                  <span>{oa.platform}</span>
                  <Badge
                    variant={
                      oa.result === "PASS" ? "success" : oa.result === "FAIL" ? "destructive" : "muted"
                    }
                    className="text-2xs"
                  >
                    {oa.result}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Stage update buttons */}
          <div>
            <p className="text-xs font-medium text-foreground mb-2">Move to stage</p>
            <div className="flex flex-wrap gap-2">
              {APPLICATION_STAGES.map((stage) => (
                <button
                  key={stage.value}
                  onClick={() => handleStageChange(stage.value)}
                  disabled={updateStage.isPending || application.stage === stage.value}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full disabled:cursor-not-allowed"
                >
                  <Badge
                    variant={application.stage === stage.value ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors",
                      application.stage === stage.value && "cursor-default"
                    )}
                  >
                    {stage.label}
                  </Badge>
                </button>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full mt-5" onClick={onClose}>
            Close
          </Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
