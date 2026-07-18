/** Navigation items for the sidebar */
export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Companies",
    href: "/companies",
    icon: "Building2",
  },
  {
    label: "My Applications",
    href: "/applications",
    icon: "FileText",
  },
  {
    label: "OA Tracker",
    href: "/oa-tracker",
    icon: "Code2",
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: "BarChart3",
  },
] as const;

export const COORDINATOR_NAV_ITEMS = [
  {
    label: "Coordinator Portal",
    href: "/coordinator",
    icon: "ShieldCheck",
  },
] as const;

/** Application pipeline stages */
export const APPLICATION_STAGES = [
  { value: "APPLIED", label: "Applied" },
  { value: "OA", label: "Online Assessment" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "OFFER", label: "Offer" },
  { value: "REJECTED", label: "Rejected" },
] as const;

export type ApplicationStage = (typeof APPLICATION_STAGES)[number]["value"];

/** Engineering branches */
export const BRANCHES = [
  { value: "CSE", label: "Computer Science" },
  { value: "ECE", label: "Electronics & Communication" },
  { value: "EEE", label: "Electrical & Electronics" },
  { value: "ME", label: "Mechanical Engineering" },
  { value: "CE", label: "Civil Engineering" },
  { value: "CHE", label: "Chemical Engineering" },
  { value: "BT", label: "Biotechnology" },
  { value: "MCA", label: "MCA" },
  { value: "MBA", label: "MBA" },
  { value: "OTHER", label: "Other" },
] as const;

/** Company statuses */
export const COMPANY_STATUS = [
  { value: "UPCOMING", label: "Upcoming", color: "info" },
  { value: "OPEN", label: "Open", color: "success" },
  { value: "CLOSED", label: "Closed", color: "muted" },
] as const;

/** OA platforms */
export const OA_PLATFORMS = [
  "HackerRank",
  "HackerEarth",
  "Codility",
  "Mettl",
  "AMCAT",
  "CoCubes",
  "iMocha",
  "Other",
] as const;

/** Interview round types */
export const INTERVIEW_ROUND_TYPES = [
  { value: "TECHNICAL", label: "Technical" },
  { value: "HR", label: "HR" },
  { value: "MANAGERIAL", label: "Managerial" },
  { value: "GROUP_DISCUSSION", label: "Group Discussion" },
] as const;

/** User roles */
export const USER_ROLES = {
  STUDENT: "STUDENT",
  COORDINATOR: "COORDINATOR",
  ADMIN: "ADMIN",
} as const;

export type UserRole = keyof typeof USER_ROLES;

/** Query stale times */
export const QUERY_STALE_TIMES = {
  SHORT: 1000 * 30,        // 30 seconds — notifications, deadlines
  MEDIUM: 1000 * 60 * 5,  // 5 minutes — companies list
  LONG: 1000 * 60 * 30,   // 30 minutes — analytics, salary data
} as const;

/** Pagination */
export const PAGE_SIZE = 12;

/** Deadline urgency threshold in days */
export const DEADLINE_URGENT_DAYS = 3;
