# 🎓 PlaceTrack – AI-Powered Placement Management System

A full-stack Placement Management System that streamlines campus recruitment by connecting students and administrators on a single platform. PlaceTrack automates placement workflows while leveraging AI to provide smarter insights, resume evaluation, and interview preparation.

---

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://place-track-pf7n.vercel.app/login)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)


**🔗 Live Application:** https://place-track-pf7n.vercel.app/login

---

# 🚀 Features

## 👨‍🎓 Student Portal
- Secure authentication and profile management
- Personalized dashboard
- View eligible companies
- Apply for placement drives
- Resume upload and management
- Track application status
- View placement history
- AI Resume Score & Suggestions
- AI Interview Preparation Assistant
- Smart eligibility checker

## 👨‍💼 Admin Portal
- Secure admin authentication
- Manage students
- Manage companies
- Create and update placement drives
- Define eligibility criteria
- Review applications
- Track placement progress
- Generate placement reports
- Dashboard with placement analytics
- Role-based access management

## 🤖 AI Features
- AI Resume Scorer
- AI Interview Preparation Coach
- Smart Eligibility Explainer
- Personalized career guidance
- Placement recommendations

## 📊 Analytics Dashboard
- Student placement statistics
- Company hiring insights
- Application analytics
- Placement trends
- Department-wise performance

## 🔐 Authentication & Security
- Secure authentication
- Role-based access control
- Protected routes
- Session management
- Password encryption

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

## 👨‍🎓 Student
- Register and log in
- Manage profile
- Upload resume
- Apply for placement drives
- Track application status
- Check eligibility
- Use AI interview preparation
- Receive AI resume feedback

## 👨‍💼 Admin
- Manage students
- Manage companies
- Create placement drives
- Configure eligibility criteria
- Review applications
- Publish results
- Monitor placement statistics
- Access analytics dashboard

---

# 🤖 AI-Powered Modules

- Resume Analysis
- Resume Scoring
- AI Interview Preparation
- Interview Question Generation
- Smart Eligibility Explanation
- Career Guidance
- Placement Recommendations

---

# 📊 Dashboard Features

- Placement statistics
- Student insights
- Company hiring trends
- Application analytics
- Placement reports
- Performance monitoring

---

# 🚀 Future Enhancements

- Email notifications
- Resume parsing
- Online coding assessments
- Company-specific interview preparation
- Interview scheduling
- Real-time notifications
- Student skill gap analysis
- AI-based placement prediction
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
