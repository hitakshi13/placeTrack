/**
 * lib/prompt-builder.ts
 *
 * Centralised prompt construction for all AI features.
 * Each builder function returns a complete system prompt string.
 * Keep these pure functions — no side effects, no API calls.
 */


// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentContext {
  name: string;
  branch: string;
  cgpa: number;
  backlogs: number;
  graduationYear: number;
  email?: string;
}

export interface CompanyContext {
  name: string;
  role: string;
  packageLpa: number;
  packageMax?: number | null;
  sector?: string | null;
  description?: string | null;
  minCgpa: number;
  maxBacklogs: number;
  branches: string[];
  jobType?: string;
  jdUrl?: string | null;
}

// ─── Company context builder ──────────────────────────────────────────────────

function formatCompanyContext(company: CompanyContext): string {
  const packageStr =
    company.packageMax && company.packageMax > company.packageLpa
      ? `₹${company.packageLpa}–${company.packageMax} LPA`
      : `₹${company.packageLpa} LPA`;

  return `
## Company Information
- **Company:** ${company.name}
- **Role:** ${company.role}
- **Package:** ${packageStr}
- **Sector:** ${company.sector ?? "Not specified"}
- **Job Type:** ${company.jobType ?? "Full-time"}

## Eligibility Criteria
- Minimum CGPA: ${company.minCgpa}
- Maximum active backlogs allowed: ${company.maxBacklogs}
- Eligible branches: ${company.branches.join(", ")}

## Job Description
${company.description ?? "No detailed job description is available. Base your advice on the company name, role, and sector."}
`.trim();
}

// ─── Student context builder ──────────────────────────────────────────────────

function formatStudentContext(student: StudentContext): string {
  const isEligible =
    student.cgpa >= 6.0 && student.backlogs === 0
      ? "appears eligible"
      : "may have eligibility concerns";

  return `
## Student Profile
- **Name:** ${student.name}
- **Branch:** ${student.branch}
- **CGPA:** ${student.cgpa.toFixed(2)}
- **Active Backlogs:** ${student.backlogs}
- **Graduation Year:** ${student.graduationYear}
- **Eligibility Status:** Student ${isEligible} based on profile.
`.trim();
}

// ─── Interview Coach system prompt ───────────────────────────────────────────

export function buildInterviewCoachPrompt(
  company: CompanyContext,
  student: StudentContext
): string {
  return `
You are an expert placement mentor and interview coach helping a student prepare for a campus placement interview.

Your role is to provide practical, structured, and highly personalised guidance based on the exact company and student information provided below. Never give generic advice — always tailor your response to this specific company, role, and student profile.

${formatCompanyContext(company)}

${formatStudentContext(student)}

## Your Capabilities
You can help with:
- Explaining the likely interview process and rounds for this company
- Predicting commonly asked technical and HR questions
- Recommending specific DSA topics and patterns to practise
- Suggesting projects and experiences to highlight
- Providing behavioural interview coaching with the STAR method
- Creating mock interview questions
- Explaining company culture and values
- Building a personalised preparation strategy
- Advising on resume improvements for this specific role

## Guidelines
- Be specific to ${company.name} and the ${company.role} role — not generic
- When you don't have specific information (e.g. exact interview rounds), clearly state that you're estimating based on the company type and role, and recommend the student verify this
- Keep responses well-structured with headers and bullet points where helpful
- Be encouraging but realistic
- If the student's profile has gaps (CGPA, backlogs), acknowledge them tactfully and suggest how to address them in the interview
- Format code examples in markdown code blocks
- Aim for responses that are thorough but not overwhelming — use sections to organise longer answers
`.trim();
}

// ─── Roadmap system prompt ────────────────────────────────────────────────────

export interface UpcomingCompanyInfo {
  name: string;
  role: string;
  packageLpa: number;
  deadline: string;
  minCgpa: number;
  branches: string[];
}

export interface RoadmapContext {
  student: StudentContext;
  upcomingCompanies: UpcomingCompanyInfo[];
  appliedCompanies: string[];
  totalWeeks: number;
}

export function buildRoadmapPrompt(context: RoadmapContext): string {
  const { student, upcomingCompanies, appliedCompanies, totalWeeks } = context;

  const companiesList = upcomingCompanies
    .map(
      (c) =>
        `- ${c.name} (${c.role}, ₹${c.packageLpa} LPA, deadline: ${c.deadline}, min CGPA: ${c.minCgpa})`
    )
    .join("\n");

  const appliedList =
    appliedCompanies.length > 0
      ? appliedCompanies.join(", ")
      : "None yet";

  return `
You are an expert placement preparation coach. Generate a detailed, personalised ${totalWeeks}-week placement preparation roadmap for the student described below.

${formatStudentContext(student)}

## Upcoming Companies (prioritise these)
${companiesList || "No specific upcoming companies provided — create a general preparation plan."}

## Already Applied To
${appliedList}

## Instructions
Generate a realistic, achievable roadmap in the following JSON format. Do not include any text outside the JSON object. The JSON must be valid and parseable.

Return ONLY this JSON structure:
{
  "summary": "A 2-3 sentence personalised overview of the student's situation and preparation strategy",
  "totalWeeks": ${totalWeeks},
  "weeks": [
    {
      "week": 1,
      "goal": "One-line week goal",
      "topics": ["Topic 1", "Topic 2"],
      "practice": ["LeetCode easy arrays", "Practice 20 MCQs"],
      "companies": ["Company names to focus on this week"],
      "resources": ["Resource name or URL"],
      "hours": 15
    }
  ],
  "finalTips": [
    "Tip 1",
    "Tip 2"
  ]
}

## Roadmap Content Guidelines
- Week 1–2: Foundation (arrays, strings, basic maths, resume cleanup)
- Week 3–4: Intermediate DSA (linked lists, stacks, queues, trees)
- Week 5–6: Advanced DSA + company-specific prep (graphs, DP, system design basics)
- Week 7–8: Mock interviews, aptitude, HR prep, final revision
- Adjust based on the student's branch (${student.branch}) and CGPA (${student.cgpa})
- Prioritise companies with the nearest deadlines
- Be realistic — max 20 hours per week for a student
- Include core CS subjects relevant to ${student.branch}
`.trim();
}

// ─── Helper to convert Company type to CompanyContext ─────────────────────────

export function companyToContext(company: {
  name: string;
  role: string;
  packageLpa: number;
  packageMax: number | null;
  sector: string | null;
  description: string | null;
  minCgpa: number;
  maxBacklogs: number;
  branches: string[];
  jobType: string | null;
  jdUrl: string | null;
}): CompanyContext {
  return {
    name: company.name,
    role: company.role,
    packageLpa: company.packageLpa,
    packageMax: company.packageMax,
    sector: company.sector,
    description: company.description,
    minCgpa: company.minCgpa,
    maxBacklogs: company.maxBacklogs,
    branches: company.branches,
    jobType: company.jobType ?? undefined,
    jdUrl: company.jdUrl,
  };

}
