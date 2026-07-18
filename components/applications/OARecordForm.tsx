"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createOASchema, type CreateOAInput } from "@/lib/validations/application";
import { useAddOARecord } from "@/hooks/useApplications";
import { OA_PLATFORMS } from "@/lib/constants";

interface OARecordFormProps {
  applicationId: string;
  onSuccess?: () => void;
}

export function OARecordForm({ applicationId, onSuccess }: OARecordFormProps) {
  const addOA = useAddOARecord(applicationId);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateOAInput>({
    resolver: zodResolver(createOASchema),
    defaultValues: {
      platform: "HackerRank",
      testDate: new Date().toISOString().split("T")[0],
      result: "PENDING",
    },
  });

  const onSubmit = (data: CreateOAInput) => {
    addOA.mutate(data, { onSuccess: () => onSuccess?.() });
  };

  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="space-y-3" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="platform" required>Platform</Label>
        <select
          id="platform"
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
          {...register("platform")}
        >
          {OA_PLATFORMS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="testDate" required>Test date</Label>
        <Input
          id="testDate"
          type="date"
          error={errors.testDate?.message}
          {...register("testDate")}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="score">Score</Label>
          <Input
            id="score"
            type="number"
            step="0.1"
            placeholder="85"
            error={errors.score?.message}
            {...register("score", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="totalScore">Out of</Label>
          <Input
            id="totalScore"
            type="number"
            placeholder="100"
            error={errors.totalScore?.message}
            {...register("totalScore", { valueAsNumber: true })}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" isLoading={isSubmitting || addOA.isPending}>
        Add OA record
      </Button>
    </form>
  );
}
