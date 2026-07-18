"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { createAnnouncementSchema, type CreateAnnouncementInput } from "@/lib/validations/announcement";
import { useCreateAnnouncement } from "@/hooks/useAnnouncements";

interface AnnouncementComposerProps {
  onSuccess?: () => void;
}

export function AnnouncementComposer({ onSuccess }: AnnouncementComposerProps) {
  const createAnnouncement = useCreateAnnouncement();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAnnouncementInput>({
    resolver: zodResolver(createAnnouncementSchema),
    defaultValues: { title: "", body: "", targetBranches: [] },
  });

  const onSubmit = (data: CreateAnnouncementInput) => {
    createAnnouncement.mutate(data, {
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-border p-5">
      <h3 className="text-sm font-semibold text-foreground">New announcement</h3>

      <div className="space-y-1.5">
        <Label htmlFor="ann-title" required>Title</Label>
        <Input
          id="ann-title"
          placeholder="Pre-placement talk — Google"
          error={errors.title?.message}
          {...register("title")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ann-body" required>Message</Label>
        <textarea
          id="ann-body"
          rows={4}
          placeholder="Write your announcement here..."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-none"
          {...register("body")}
        />
        {errors.body && (
          <p className="text-xs text-destructive" role="alert">{errors.body.message}</p>
        )}
      </div>

      <Button
        type="button"
        onClick={() => void handleSubmit(onSubmit)()}
        isLoading={isSubmitting || createAnnouncement.isPending}
        disabled={isSubmitting || createAnnouncement.isPending}
      >
        Post announcement
      </Button>
    </div>
  );
}
