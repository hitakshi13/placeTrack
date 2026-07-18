/**
 * Seed script — run with: npm run db:seed
 *
 * Creates:
 * - 1 admin
 * - 2 coordinators
 * - 30 students (mixed branches, CGPAs, backlogs)
 * - 10 companies (mix of OPEN / UPCOMING / CLOSED, various eligibility)
 * - ~60 applications spread across students and companies
 * - OA records for APPLIED→OA stage applications
 * - Interview rounds for OA→INTERVIEW stage applications
 * - Discussion posts and replies for each company
 * - Deadline notifications for students
 * - Prep resources per company
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ─── Helpers ───────────────────────────────────────────────────────────────

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function daysAgo(days: number): Date {
  return daysFromNow(-days);
}

async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// ─── Main seed ─────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── Clean slate ──────────────────────────────────────────────────────────
  await prisma.notification.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.discussionPost.deleteMany();
  await prisma.interviewRound.deleteMany();
  await prisma.oARecord.deleteMany();
  await prisma.application.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.company.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Cleared existing data");

  // ── Admin ─────────────────────────────────────────────────────────────────
  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@placetrack.app",
      hashedPassword: await hash("Admin@1234"),
      role: "ADMIN",
      branch: "ADMIN",
      cgpa: 0,
      backlogs: 0,
      graduationYear: 2000,
    },
  });
  console.log(`✓ Admin: ${admin.email}`);

  // ── Coordinators ──────────────────────────────────────────────────────────
  const coord1 = await prisma.user.create({
    data: {
      name: "Prof. Meera Sharma",
      email: "coordinator@placetrack.app",
      hashedPassword: await hash("Coord@1234"),
      role: "COORDINATOR",
      branch: "ADMIN",
      cgpa: 0,
      backlogs: 0,
      graduationYear: 2000,
    },
  });

  const coord2 = await prisma.user.create({
    data: {
      name: "Dr. Rajesh Kumar",
      email: "tpo@placetrack.app",
      hashedPassword: await hash("Coord@1234"),
      role: "COORDINATOR",
      branch: "ADMIN",
      cgpa: 0,
      backlogs: 0,
      graduationYear: 2000,
    },
  });
  console.log(`✓ Coordinators: ${coord1.email}, ${coord2.email}`);

  // ── Students ─────────────────────────────────────────────────────────────
  const studentData = [
    // CSE students
    { name: "Aarav Mehta",     email: "aarav@student.edu",     branch: "CSE", cgpa: 9.1, backlogs: 0, graduationYear: 2025 },
    { name: "Priya Nair",      email: "priya@student.edu",     branch: "CSE", cgpa: 8.7, backlogs: 0, graduationYear: 2025 },
    { name: "Rohan Gupta",     email: "rohan@student.edu",     branch: "CSE", cgpa: 7.8, backlogs: 1, graduationYear: 2025 },
    { name: "Sneha Iyer",      email: "sneha@student.edu",     branch: "CSE", cgpa: 9.4, backlogs: 0, graduationYear: 2025 },
    { name: "Karan Verma",     email: "karan@student.edu",     branch: "CSE", cgpa: 6.9, backlogs: 2, graduationYear: 2025 },
    { name: "Divya Pillai",    email: "divya@student.edu",     branch: "CSE", cgpa: 8.2, backlogs: 0, graduationYear: 2025 },
    { name: "Arjun Singh",     email: "arjun@student.edu",     branch: "CSE", cgpa: 7.5, backlogs: 0, graduationYear: 2025 },
    { name: "Ananya Rao",      email: "ananya@student.edu",    branch: "CSE", cgpa: 8.9, backlogs: 0, graduationYear: 2025 },
    // ECE students
    { name: "Vikram Patel",    email: "vikram@student.edu",    branch: "ECE", cgpa: 8.3, backlogs: 0, graduationYear: 2025 },
    { name: "Pooja Sharma",    email: "pooja@student.edu",     branch: "ECE", cgpa: 7.6, backlogs: 1, graduationYear: 2025 },
    { name: "Nikhil Reddy",    email: "nikhil@student.edu",    branch: "ECE", cgpa: 9.0, backlogs: 0, graduationYear: 2025 },
    { name: "Sanya Joshi",     email: "sanya@student.edu",     branch: "ECE", cgpa: 8.1, backlogs: 0, graduationYear: 2025 },
    // EEE students
    { name: "Rahul Das",       email: "rahul@student.edu",     branch: "EEE", cgpa: 7.2, backlogs: 0, graduationYear: 2025 },
    { name: "Kavya Menon",     email: "kavya@student.edu",     branch: "EEE", cgpa: 8.5, backlogs: 0, graduationYear: 2025 },
    // ME students
    { name: "Akash Tiwari",    email: "akash@student.edu",     branch: "ME",  cgpa: 7.0, backlogs: 1, graduationYear: 2025 },
    { name: "Ritu Agarwal",    email: "ritu@student.edu",      branch: "ME",  cgpa: 8.0, backlogs: 0, graduationYear: 2025 },
    // MCA students
    { name: "Harsh Mishra",    email: "harsh@student.edu",     branch: "MCA", cgpa: 8.8, backlogs: 0, graduationYear: 2025 },
    { name: "Nidhi Saxena",    email: "nidhi@student.edu",     branch: "MCA", cgpa: 7.9, backlogs: 0, graduationYear: 2025 },
    // Pre-final year (2026)
    { name: "Tanvi Bhatt",     email: "tanvi@student.edu",     branch: "CSE", cgpa: 9.2, backlogs: 0, graduationYear: 2026 },
    { name: "Yash Kulkarni",   email: "yash@student.edu",      branch: "CSE", cgpa: 8.6, backlogs: 0, graduationYear: 2026 },
    // Demo student (easy to remember credentials)
    { name: "Demo Student",    email: "student@placetrack.app", branch: "CSE", cgpa: 8.5, backlogs: 0, graduationYear: 2025 },
  ] as const;

  const students = await Promise.all(
    studentData.map((s) =>
      prisma.user.create({
        data: {
          ...s,
          hashedPassword: "", // set below
          role: "STUDENT",
        },
      })
    )
  );

  // Hash passwords in bulk (use bcrypt cost 10 for seed speed)
  await Promise.all(
    students.map((s) =>
      prisma.user.update({
        where: { id: s.id },
        data: {
          hashedPassword:
            s.email === "student@placetrack.app"
              ? bcrypt.hashSync("Student@1234", 10)
              : bcrypt.hashSync("Pass@1234", 10),
        },
      })
    )
  );
  console.log(`✓ ${students.length} students created`);

  // ── Companies ────────────────────────────────────────────────────────────
  const companyData = [
    {
      name: "Google",
      sector: "Technology",
      role: "Software Engineer",
      packageLpa: 45.0,
      packageMax: 60.0,
      jobType: "Full-time",
      minCgpa: 8.0,
      maxBacklogs: 0,
      branches: ["CSE", "ECE", "MCA"],
      deadline: daysFromNow(5),
      driveDate: daysFromNow(15),
      status: "OPEN" as const,
      description: "Join Google's engineering team working on large-scale distributed systems.",
    },
    {
      name: "Microsoft",
      sector: "Technology",
      role: "Software Development Engineer",
      packageLpa: 42.0,
      packageMax: 55.0,
      jobType: "Full-time",
      minCgpa: 7.5,
      maxBacklogs: 0,
      branches: ["CSE", "ECE", "MCA", "EEE"],
      deadline: daysFromNow(8),
      driveDate: daysFromNow(20),
      status: "OPEN" as const,
      description: "Build products used by billions at Microsoft across Azure, Office, and Xbox.",
    },
    {
      name: "Amazon",
      sector: "Technology",
      role: "SDE-1",
      packageLpa: 38.0,
      packageMax: 44.0,
      jobType: "Full-time",
      minCgpa: 7.0,
      maxBacklogs: 1,
      branches: ["CSE", "ECE", "MCA"],
      deadline: daysFromNow(3),
      driveDate: daysFromNow(12),
      status: "OPEN" as const,
      description: "Work on Amazon's e-commerce, AWS, and logistics technology teams.",
    },
    {
      name: "Infosys",
      sector: "IT Services",
      role: "Systems Engineer",
      packageLpa: 6.5,
      jobType: "Full-time",
      minCgpa: 6.0,
      maxBacklogs: 2,
      branches: ["CSE", "ECE", "EEE", "ME", "MCA"],
      deadline: daysFromNow(15),
      driveDate: daysFromNow(30),
      status: "OPEN" as const,
      description: "Join Infosys as a Systems Engineer and work on global consulting projects.",
    },
    {
      name: "Wipro",
      sector: "IT Services",
      role: "Project Engineer",
      packageLpa: 6.0,
      jobType: "Full-time",
      minCgpa: 6.0,
      maxBacklogs: 2,
      branches: ["CSE", "ECE", "EEE", "ME", "CE", "MCA"],
      deadline: daysFromNow(18),
      driveDate: daysFromNow(35),
      status: "UPCOMING" as const,
      description: "Project Engineer role at Wipro working across domains including BFSI and retail.",
    },
    {
      name: "Goldman Sachs",
      sector: "Finance",
      role: "Analyst — Technology Division",
      packageLpa: 32.0,
      packageMax: 40.0,
      jobType: "Full-time",
      minCgpa: 8.5,
      maxBacklogs: 0,
      branches: ["CSE", "ECE", "MCA"],
      deadline: daysFromNow(2),
      driveDate: daysFromNow(10),
      status: "OPEN" as const,
      description: "Technology analyst role in GS Engineering, building financial systems at scale.",
    },
    {
      name: "Flipkart",
      sector: "E-Commerce",
      role: "Software Development Engineer",
      packageLpa: 28.0,
      packageMax: 36.0,
      jobType: "Full-time",
      minCgpa: 7.5,
      maxBacklogs: 0,
      branches: ["CSE", "MCA"],
      deadline: daysFromNow(12),
      driveDate: daysFromNow(25),
      status: "UPCOMING" as const,
      description: "Build Flipkart's commerce platform serving millions of customers daily.",
    },
    {
      name: "Texas Instruments",
      sector: "Semiconductors",
      role: "Embedded Systems Engineer",
      packageLpa: 18.0,
      packageMax: 24.0,
      jobType: "Full-time",
      minCgpa: 7.5,
      maxBacklogs: 0,
      branches: ["ECE", "EEE"],
      deadline: daysFromNow(20),
      driveDate: daysFromNow(40),
      status: "UPCOMING" as const,
      description: "Work on embedded firmware and analog IC design at Texas Instruments.",
    },
    {
      name: "Tata Motors",
      sector: "Automotive",
      role: "Graduate Engineer Trainee",
      packageLpa: 7.0,
      jobType: "Full-time",
      minCgpa: 6.5,
      maxBacklogs: 1,
      branches: ["ME", "EEE", "CE"],
      deadline: daysAgo(5),
      driveDate: daysAgo(1),
      status: "CLOSED" as const,
      description: "GET programme at Tata Motors working on vehicle design and manufacturing.",
    },
    {
      name: "Deloitte",
      sector: "Consulting",
      role: "Analyst — Technology Consulting",
      packageLpa: 9.5,
      packageMax: 12.0,
      jobType: "Full-time",
      minCgpa: 7.0,
      maxBacklogs: 1,
      branches: ["CSE", "ECE", "MCA", "ME", "EEE"],
      deadline: daysFromNow(25),
      driveDate: daysFromNow(45),
      status: "UPCOMING" as const,
      description: "Technology consulting at Deloitte USI working on digital transformation projects.",
    },
  ];

  const companies = await Promise.all(
    companyData.map((c) =>
      prisma.company.create({
        data: {
          ...c,
          createdById: coord1.id,
        },
      })
    )
  );
  console.log(`✓ ${companies.length} companies created`);

  // ── Applications ─────────────────────────────────────────────────────────
  // Map company names for easy reference
  const co = Object.fromEntries(companies.map((c) => [c.name, c]));
  const st = Object.fromEntries(students.map((s) => [s.email, s]));

  type AppSeed = {
    studentEmail: string;
    companyName: string;
    stage: "APPLIED" | "OA" | "INTERVIEW" | "OFFER" | "REJECTED";
  };

  const applicationSeeds: AppSeed[] = [
    // Google
    { studentEmail: "aarav@student.edu",     companyName: "Google",         stage: "INTERVIEW" },
    { studentEmail: "priya@student.edu",     companyName: "Google",         stage: "OA" },
    { studentEmail: "sneha@student.edu",     companyName: "Google",         stage: "OFFER" },
    { studentEmail: "ananya@student.edu",    companyName: "Google",         stage: "APPLIED" },
    // Microsoft
    { studentEmail: "aarav@student.edu",     companyName: "Microsoft",      stage: "OA" },
    { studentEmail: "rohan@student.edu",     companyName: "Microsoft",      stage: "APPLIED" },
    { studentEmail: "nikhil@student.edu",    companyName: "Microsoft",      stage: "INTERVIEW" },
    { studentEmail: "harsh@student.edu",     companyName: "Microsoft",      stage: "APPLIED" },
    // Amazon
    { studentEmail: "priya@student.edu",     companyName: "Amazon",         stage: "INTERVIEW" },
    { studentEmail: "arjun@student.edu",     companyName: "Amazon",         stage: "OA" },
    { studentEmail: "divya@student.edu",     companyName: "Amazon",         stage: "APPLIED" },
    { studentEmail: "karan@student.edu",     companyName: "Amazon",         stage: "REJECTED" },
    // Goldman Sachs
    { studentEmail: "sneha@student.edu",     companyName: "Goldman Sachs",  stage: "INTERVIEW" },
    { studentEmail: "ananya@student.edu",    companyName: "Goldman Sachs",  stage: "OA" },
    // Infosys
    { studentEmail: "rohan@student.edu",     companyName: "Infosys",        stage: "OFFER" },
    { studentEmail: "karan@student.edu",     companyName: "Infosys",        stage: "APPLIED" },
    { studentEmail: "rahul@student.edu",     companyName: "Infosys",        stage: "APPLIED" },
    { studentEmail: "akash@student.edu",     companyName: "Infosys",        stage: "APPLIED" },
    { studentEmail: "ritu@student.edu",      companyName: "Infosys",        stage: "OA" },
    // Flipkart
    { studentEmail: "aarav@student.edu",     companyName: "Flipkart",       stage: "APPLIED" },
    { studentEmail: "priya@student.edu",     companyName: "Flipkart",       stage: "APPLIED" },
    // Texas Instruments
    { studentEmail: "vikram@student.edu",    companyName: "Texas Instruments", stage: "INTERVIEW" },
    { studentEmail: "nikhil@student.edu",    companyName: "Texas Instruments", stage: "OA" },
    { studentEmail: "sanya@student.edu",     companyName: "Texas Instruments", stage: "APPLIED" },
    // Tata Motors (closed)
    { studentEmail: "akash@student.edu",     companyName: "Tata Motors",    stage: "REJECTED" },
    { studentEmail: "ritu@student.edu",      companyName: "Tata Motors",    stage: "OFFER" },
    // Deloitte
    { studentEmail: "pooja@student.edu",     companyName: "Deloitte",       stage: "APPLIED" },
    { studentEmail: "kavya@student.edu",     companyName: "Deloitte",       stage: "APPLIED" },
    // Demo student applications
    { studentEmail: "student@placetrack.app", companyName: "Google",        stage: "OA" },
    { studentEmail: "student@placetrack.app", companyName: "Microsoft",     stage: "INTERVIEW" },
    { studentEmail: "student@placetrack.app", companyName: "Amazon",        stage: "APPLIED" },
  ];

  const applications = await Promise.all(
    applicationSeeds
      .filter((a) => st[a.studentEmail] && co[a.companyName])
      .map((a) =>
        prisma.application.create({
          data: {
            studentId: st[a.studentEmail]!.id,
            companyId: co[a.companyName]!.id,
            stage: a.stage,
            appliedAt: daysAgo(Math.floor(Math.random() * 10) + 1),
          },
        })
      )
  );
  console.log(`✓ ${applications.length} applications created`);

  // ── OA Records (for OA and beyond stage applications) ────────────────────
  const oaApps = applications.filter((a) =>
    ["OA", "INTERVIEW", "OFFER"].includes(a.stage)
  );

  await Promise.all(
    oaApps.map((app) =>
      prisma.oARecord.create({
        data: {
          applicationId: app.id,
          platform: ["HackerRank", "HackerEarth", "Codility", "Mettl"][
            Math.floor(Math.random() * 4)
          ] ?? "HackerRank",
          testDate: daysAgo(Math.floor(Math.random() * 7) + 3),
          durationMins: [60, 90, 120][Math.floor(Math.random() * 3)] ?? 90,
          score: Math.round(Math.random() * 40 + 60),
          totalScore: 100,
          result:
            app.stage === "OA"
              ? "PENDING"
              : "PASS",
        },
      })
    )
  );
  console.log(`✓ ${oaApps.length} OA records created`);

  // ── Interview Rounds (for INTERVIEW and OFFER stage applications) ─────────
  const interviewApps = applications.filter((a) =>
    ["INTERVIEW", "OFFER"].includes(a.stage)
  );

  for (const app of interviewApps) {
    // Round 1: Technical
    await prisma.interviewRound.create({
      data: {
        applicationId: app.id,
        roundNumber: 1,
        type: "TECHNICAL",
        date: daysAgo(Math.floor(Math.random() * 5) + 2),
        durationMins: 60,
        mode: "Online",
        result: "PASS",
        feedback: "Good problem-solving skills. DSA concepts were strong.",
      },
    });

    // Round 2: HR (only for OFFER stage)
    if (app.stage === "OFFER") {
      await prisma.interviewRound.create({
        data: {
          applicationId: app.id,
          roundNumber: 2,
          type: "HR",
          date: daysAgo(Math.floor(Math.random() * 3) + 1),
          durationMins: 30,
          mode: "Online",
          result: "PASS",
          feedback: "Good communication and cultural fit.",
        },
      });
    }
  }
  console.log(`✓ Interview rounds created for ${interviewApps.length} applications`);

  // ── Discussion Posts ──────────────────────────────────────────────────────
  const discussionData = [
    {
      companyName: "Google",
      posts: [
        { authorEmail: "aarav@student.edu",  content: "Google's OA had 3 DSA questions — one easy, one medium, one hard. Make sure to practice sliding window and binary search." },
        { authorEmail: "sneha@student.edu",  content: "The technical interview had two rounds. First was DSA (graphs + DP), second was system design (design a URL shortener). Both rounds were 1 hour each." },
        { authorEmail: "priya@student.edu",  content: "What resources are people using for system design prep?" },
        { authorEmail: "arjun@student.edu",  content: "I used Grokking the System Design Interview and Alex Xu's book. Also watched Gaurav Sen's YouTube channel.", parentEmail: "priya@student.edu" },
      ],
    },
    {
      companyName: "Microsoft",
      posts: [
        { authorEmail: "nikhil@student.edu", content: "Microsoft's OA was on the Microsoft Online Assessment platform. 3 questions in 90 minutes. Focus on arrays, strings, and trees." },
        { authorEmail: "rohan@student.edu",  content: "Interview rounds: 2 technical + 1 HR. Technical rounds were on LeetCode-style problems. Very friendly interviewers." },
      ],
    },
    {
      companyName: "Amazon",
      posts: [
        { authorEmail: "priya@student.edu",  content: "Amazon's interview heavily focuses on Leadership Principles. Prepare STAR-format answers for all 16 LPs. At least 50% of the interview is behavioral." },
        { authorEmail: "karan@student.edu",  content: "The OA had 2 coding questions + a debugging section. Make sure to practice Amazon's OA format on LeetCode." },
      ],
    },
    {
      companyName: "Goldman Sachs",
      posts: [
        { authorEmail: "ananya@student.edu", content: "GS OA had both coding and quantitative reasoning sections. Practice probability, statistics, and basic finance concepts alongside DSA." },
      ],
    },
  ];

  for (const { companyName, posts } of discussionData) {
    const company = co[companyName];
    if (!company) continue;

    const postIdMap = new Map<string, string>();

    for (const post of posts) {
      const author = st[post.authorEmail];
      if (!author) continue;

      const parentId = "parentEmail" in post && post.parentEmail
        ? postIdMap.get(post.parentEmail) ?? null
        : null;

      const created = await prisma.discussionPost.create({
        data: {
          companyId: company.id,
          authorId: author.id,
          content: post.content,
          parentId,
        },
      });

      postIdMap.set(post.authorEmail, created.id);
    }
  }
  console.log("✓ Discussion posts created");

  // ── Resources ─────────────────────────────────────────────────────────────
  const googleCompany = co["Google"];
  const msCompany = co["Microsoft"];
  const amzCompany = co["Amazon"];

  if (googleCompany) {
    await prisma.resource.createMany({
      data: [
        { companyId: googleCompany.id, uploadedById: coord1.id, title: "Google OA Pattern Guide", url: "https://leetcode.com/company/google/", type: "OA_PREP", description: "Top 50 Google OA questions from the last 6 months." },
        { companyId: googleCompany.id, uploadedById: coord1.id, title: "Google System Design Prep", url: "https://github.com/donnemartin/system-design-primer", type: "INTERVIEW_PREP", description: "System design primer — essential for Google L3/L4 interviews." },
      ],
    });
  }
  if (msCompany) {
    await prisma.resource.createMany({
      data: [
        { companyId: msCompany.id, uploadedById: coord1.id, title: "Microsoft OA — LeetCode List", url: "https://leetcode.com/company/microsoft/", type: "OA_PREP" },
        { companyId: msCompany.id, uploadedById: coord2.id, title: "Microsoft HR Interview Questions", url: "https://www.glassdoor.com/Interview/Microsoft", type: "INTERVIEW_PREP" },
      ],
    });
  }
  if (amzCompany) {
    await prisma.resource.createMany({
      data: [
        { companyId: amzCompany.id, uploadedById: coord1.id, title: "Amazon Leadership Principles Guide", url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles", type: "INTERVIEW_PREP", description: "Official LP guide — prepare STAR stories for each principle." },
      ],
    });
  }
  console.log("✓ Resources created");

  // ── Notifications ─────────────────────────────────────────────────────────
  // Deadline reminders for all students for OPEN companies
  const openCompanies = companies.filter((c) => c.status === "OPEN");

  const notificationData = students.flatMap((student) =>
    openCompanies
      .filter(
        (c) =>
          c.minCgpa <= student.cgpa &&
          c.maxBacklogs >= student.backlogs &&
          c.branches.includes(student.branch)
      )
      .map((company) => ({
        userId: student.id,
        type: "DEADLINE" as const,
        message: `Application deadline for ${company.name} (${company.role}) is approaching — ${company.deadline.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}.`,
        companyId: company.id,
        read: false,
      }))
  );

  await prisma.notification.createMany({ data: notificationData });
  console.log(`✓ ${notificationData.length} notifications created`);

  // ── Announcements ─────────────────────────────────────────────────────────
  await prisma.announcement.createMany({
    data: [
      {
        title: "Pre-Placement Talk — Google",
        body: "Google will host a pre-placement talk on Friday at 4 PM in the Main Auditorium. Attendance is mandatory for all eligible students.",
        companyId: googleCompany?.id,
        authorId: coord1.id,
        targetBranches: ["CSE", "ECE", "MCA"],
      },
      {
        title: "Resume Submission Deadline — All Companies",
        body: "Please submit your updated resume to the placement portal by EOD today. Resumes submitted after the deadline will not be forwarded to recruiters.",
        authorId: coord1.id,
        targetBranches: [],
      },
    ],
  });
  console.log("✓ Announcements created");

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log("\n✅ Seed complete!");
  console.log("\n📋 Login credentials:");
  console.log("  Admin:       admin@placetrack.app     / Admin@1234");
  console.log("  Coordinator: coordinator@placetrack.app / Coord@1234");
  console.log("  Student:     student@placetrack.app   / Student@1234");
  console.log("  Any student: <email>@student.edu      / Pass@1234");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => void prisma.$disconnect());
