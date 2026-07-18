"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createCompanySchema, type CreateCompanyInput } from "@/lib/validations/company";
import { api, handleApiError } from "@/lib/api";
import { BRANCHES } from "@/lib/constants";

export function CompanyForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCompanyInput>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: {
      branches: ["CSE"],
      minCgpa: 6.0,
      maxBacklogs: 0,
      jobType: "Full-time",
    },
  });

  const onSubmit = async (data: CreateCompanyInput) => {
    try {
      await api.post("/companies", data);
      toast.success("Company added successfully.");
      router.push("/coordinator/companies");
    } catch (error) {
      handleApiError(error, "Failed to create company.");
    }
  };

  return (
    <div className="space-y-5 max-w-2xl">
      {/* Basic info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name" required>Company name</Label>
          <Input id="name" placeholder="Google" error={errors.name?.message} {...register("name")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role" required>Role / Position</Label>
          <Input id="role" placeholder="Software Engineer" error={errors.role?.message} {...register("role")} />
        </div>
      </div>

      {/* Package */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="packageLpa" required>Package (LPA)</Label>
          <Input
            id="packageLpa"
            type="number"
            step="0.1"
            placeholder="12.0"
            error={errors.packageLpa?.message}
            {...register("packageLpa", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="packageMax">Max package (LPA)</Label>
          <Input
            id="packageMax"
            type="number"
            step="0.1"
            placeholder="18.0 (optional)"
            error={errors.packageMax?.message}
            {...register("packageMax", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Eligibility */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="minCgpa" required>Minimum CGPA</Label>
          <Input
            id="minCgpa"
            type="number"
            step="0.1"
            min="0"
            max="10"
            placeholder="7.0"
            error={errors.minCgpa?.message}
            {...register("minCgpa", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="maxBacklogs" required>Max backlogs allowed</Label>
          <Input
            id="maxBacklogs"
            type="number"
            min="0"
            placeholder="0"
            error={errors.maxBacklogs?.message}
            {...register("maxBacklogs", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Branches */}
      <div className="space-y-1.5">
        <Label required>Eligible branches</Label>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {BRANCHES.map((b) => (
            <label key={b.value} className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                value={b.value}
                className="rounded border-border"
                {...register("branches")}
              />
              {b.value}
            </label>
          ))}
        </div>
        {errors.branches && (
          <p className="text-xs text-destructive" role="alert">{errors.branches.message}</p>
        )}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="deadline" required>Application deadline</Label>
          <Input
            id="deadline"
            type="datetime-local"
            error={errors.deadline?.message}
            {...register("deadline")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="driveDate">Drive date</Label>
          <Input
            id="driveDate"
            type="datetime-local"
            error={errors.driveDate?.message}
            {...register("driveDate")}
          />
        </div>
      </div>

      {/* Optional fields */}
      <div className="space-y-1.5">
        <Label htmlFor="jdUrl">Job description URL</Label>
        <Input
          id="jdUrl"
          type="url"
          placeholder="https://..."
          error={errors.jdUrl?.message}
          {...register("jdUrl")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={3}
          placeholder="Brief description of the role..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
          {...register("description")}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          onClick={() => void handleSubmit(onSubmit)()}
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Add company
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
