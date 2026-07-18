import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes safely, resolving conflicts.
 * Uses clsx for conditionals and tailwind-merge to deduplicate.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as Indian currency (₹ in LPA).
 */
export function formatLPA(value: number): string {
  return `₹${value.toFixed(1)} LPA`;
}

/**
 * Returns initials from a full name (max 2 characters).
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Formats a date as a relative string (e.g., "in 3 days", "2 days ago").
 */
export function formatRelativeDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Formats a date as "DD MMM YYYY" (e.g., "15 Aug 2025").
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/**
 * Returns whether a deadline is urgent (within 3 days).
 */
export function isUrgent(deadline: Date | string): boolean {
  const d = typeof deadline === "string" ? new Date(deadline) : deadline;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 3;
}

/**
 * Truncates a string to a max length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

/**
 * Returns a stage colour class for use in badge variants.
 */
export function getStageClass(
  stage: "APPLIED" | "OA" | "INTERVIEW" | "OFFER" | "REJECTED"
): string {
  const map: Record<string, string> = {
    APPLIED: "stage-applied",
    OA: "stage-oa",
    INTERVIEW: "stage-interview",
    OFFER: "stage-offer",
    REJECTED: "stage-rejected",
  };
  return map[stage] ?? "stage-applied";
}
