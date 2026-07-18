import type { ApplicationStage, UserRole } from "@/lib/constants";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch: string;
  cgpa: number;
  backlogs: number;
  graduationYear: number;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface EligibilityCriteria {
  minCgpa: number;
  branches: string[];
  maxBacklogs: number;
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string | null;
  sector?: string | null;
  role: string;
  packageLpa: number;
  packageMax?: number | null;
  jobType?: string;
  eligibility?: EligibilityCriteria;
  minCgpa: number;
  maxBacklogs: number;
  branches: string[];
  jdUrl?: string | null;
  description?: string | null;
  deadline: string;
  driveDate?: string | null;
  status: "UPCOMING" | "OPEN" | "CLOSED";
  createdAt: string;
  isEligible?: boolean;
  hasApplied?: boolean;
  applicationId?: string | null;
  applicationStage?: string | null;
  applicantCount?: number;
}

export interface Application {
  id: string;
  studentId: string;
  companyId: string;
  stage: ApplicationStage;
  notes?: string | null;
  appliedAt: string;
  updatedAt: string;
  company: Pick<Company, "id" | "name" | "logoUrl" | "role" | "packageLpa">;
  oaRecords: OARecord[];
  interviewRounds: InterviewRound[];
}

export interface OARecord {
  id: string;
  applicationId: string;
  platform: string;
  testDate: string;
  durationMins?: number | null;
  score?: number | null;
  totalScore?: number | null;
  result: "PASS" | "FAIL" | "PENDING";
  notes?: string | null;
}

export interface InterviewRound {
  id: string;
  applicationId: string;
  roundNumber: number;
  type: "TECHNICAL" | "HR" | "MANAGERIAL" | "GROUP_DISCUSSION";
  date: string;
  durationMins?: number | null;
  mode?: string | null;
  feedback?: string | null;
  result: "PASS" | "FAIL" | "PENDING";
}

export interface DiscussionPost {
  id: string;
  companyId: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
  author: Pick<User, "id" | "name" | "avatarUrl">;
  replies?: DiscussionPost[];
  replyCount?: number;
}

export interface Notification {
  id: string;
  type: "DEADLINE" | "ANNOUNCEMENT" | "STAGE_UPDATE";
  message: string;
  read: boolean;
  createdAt: string;
  meta?: { companyId?: string; applicationId?: string };
}

export interface PlacementStats {
  totalStudents: number;
  totalPlaced: number;
  placementRate: number;
  averagePackage: number;
  highestPackage: number;
  companiesVisited: number;
  offersExtended: number;
}

export interface FunnelStep {
  stage: ApplicationStage;
  count: number;
  label: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
