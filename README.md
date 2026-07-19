# 🎓 PlaceTrack – AI-Powered Placement Management System

A full-stack Placement Management System that streamlines campus recruitment by connecting students, coordinators, professors, and placement officers on a single platform. PlaceTrack automates placement workflows while leveraging AI to provide smarter insights, resume evaluation, and interview preparation.

---

## 🚀 Features

### 👨‍🎓 Student Portal
- Student registration and authentication
- Personalized dashboard
- View eligible companies
- Apply for placement drives
- Resume upload and management
- Track application status
- AI Resume Score & Suggestions
- AI Interview Preparation Assistant

### 👨‍🏫 Professor Portal
- Review student profiles
- View placement statistics
- Monitor student progress
- Access department-wise analytics

### 🏢 Placement Coordinator Portal
- Manage placement drives
- Add and update company details
- Define eligibility criteria
- Manage applications
- View hiring analytics
- Generate placement reports

### 🤖 AI Features
- AI Resume Scorer
- AI Interview Preparation Coach
- Smart Eligibility Explainer
- AI-powered career guidance
- Personalized placement recommendations

### 📊 Analytics Dashboard
- Student placement statistics
- Company hiring insights
- Department-wise placement analysis
- Placement trends visualization

### 🔐 Authentication & Security
- Secure authentication
- Role-based access control
- Protected routes
- Session management

---

# 🛠️ Tech Stack

## Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Framer Motion

## Backend
- Next.js Server Actions
- NextAuth.js v5

## Database
- PostgreSQL
- Prisma ORM
- Supabase

## Authentication
- NextAuth.js
- Credentials Provider
- bcrypt

## AI
- Claude API
- Google Gemini API

## Validation
- Zod
- React Hook Form

## Deployment
- Vercel
- Supabase

---

# 📂 Project Structure

```
app/
components/
hooks/
lib/
prisma/
public/
types/
middleware.ts
auth.ts
```

---

# ⚙️ Installation

## Clone the Repository

```bash
git clone https://github.com/hitakshi13/placeTrack.git
```

## Navigate to the Project

```bash
cd placeTrack
```

## Install Dependencies

```bash
npm install
```

## Configure Environment Variables

Create a `.env` file in the root directory.

```env
DATABASE_URL=

DIRECT_URL=

AUTH_SECRET=

NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLAUDE_API_KEY=

GEMINI_API_KEY=
```

## Run Database Migrations

```bash
npx prisma migrate dev
```

## Generate Prisma Client

```bash
npx prisma generate
```

## Start Development Server

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

---

# 🎯 User Roles

### 👨‍🎓 Student
- Apply for companies
- View eligibility
- Track applications
- Upload resume
- Practice AI interviews

### 👨‍🏫 Professor
- View student performance
- Monitor placement progress
- Department analytics

### 👨‍💼 Placement Coordinator
- Manage companies
- Create placement drives
- Review applications
- Publish results
- Placement analytics

---

# 🤖 AI-Powered Modules

- Resume Analysis
- Resume Scoring
- Interview Question Generation
- Personalized Interview Preparation
- Eligibility Explanation
- Career Guidance
- Smart Placement Recommendations

---

# 📊 Dashboard Features

- Placement statistics
- Student insights
- Company hiring trends
- Department performance
- Application analytics
- Placement reports

---

# 📸 Screenshots

Add screenshots for:

- Landing Page
- Student Dashboard
- Professor Dashboard
- Coordinator Dashboard
- Company Management
- Resume Analysis
- AI Interview Coach
- Analytics Dashboard

---

# 🚀 Future Enhancements

- Email notifications
- Resume parsing
- Online coding assessments
- Company-specific interview preparation
- Interview scheduling
- Real-time notifications
- Student skill gap analysis
- Placement prediction using AI
- Mobile application

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository

2. Create a new feature branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push to GitHub

```bash
git push origin feature-name
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👩‍💻 Author

**Hitakshi Kharag**

- GitHub: https://github.com/hitakshi13
- LinkedIn: https://www.linkedin.com/in/hitakshikharag/

---

⭐ If you found this project useful, consider giving it a star!
