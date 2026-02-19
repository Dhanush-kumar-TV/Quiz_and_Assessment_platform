<div align="center">

# 🧠 Quiz & Assessment Platform

<img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=800&size=35&duration=2000&pause=1000&color=4F46E5&center=true&vCenter=true&width=500&lines=Create+Quizzes;Test+Your+Knowledge;Track+Progress;Master+Skills" alt="Typing SVG" />

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue" />
  <img src="https://img.shields.io/badge/MongoDB-Database-green" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38bdf8" />
</p>

A modern, full-stack application for creating, managing, and attempting quizzes with real-time analytics and secure access control.

[Live Demo](https://quiz-and-assessment-platform.vercel.app/) • [Report Bug](https://github.com/Dhanush-kumar-TV/Quiz_and_Assessment_platform/issues)

</div>

## ✨ Features

### 🔐 Robust Authentication & Access Control
- **Secure Login/Signup**: Implementation using NextAuth.js.
- **Role-Based Access**: Distinguish between Quiz Creators (Teachers) and Takers (Students).
- **Password Protection**: Secure private quizzes with passcodes.
- **Approval System**: Request and grant access to private quizzes.

### 📝 Quiz Management
- **Dynamic Quiz Creation**: Easy-to-use interface for adding questions.
- **Multiple Question Types**: Support for multiple-choice questions with single or multiple correct answers.
- **Time Limits**: Set strict time limits for quiz attempts.
- **Access Settings**: Public, Private (Password), or Registration-based access.

### 📊 Analytics & Reporting
- **Instant Results**: Immediate scoring and feedback after submission.
- **Performance Dashboards**: Visual charts showing progress and score distribution.
- **Attempt History**: Detailed logs of past quiz attempts for users and creators.

---

## 📸 Screenshots

> *Add your screenshots here*

<div align="center">
  <!-- Replace these with actual screenshots -->
  <img src="https://placehold.co/600x400/1e293b/white?text=Dashboard+View" alt="Dashboard" width="45%" />
  <img src="https://placehold.co/600x400/1e293b/white?text=Quiz+Attempt+Interface" alt="Quiz UI" width="45%" />
  <br/>
  <img src="https://placehold.co/600x400/1e293b/white?text=Analytics+Results" alt="Analytics" width="45%" />
  <img src="https://placehold.co/600x400/1e293b/white?text=Mobile+Responsive" alt="Mobile View" width="45%" />
</div>

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Database**: [MongoDB](https://www.mongodb.com/) via Mongoose
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 Project Structure

```bash
├── app/                  # Next.js App Router pages
│   ├── (auth)/           # Authentication routes
│   ├── (dashboard)/      # Protected dashboard routes
│   └── api/              # API Routes (Serverless)
├── components/           # Reusable UI components
├── lib/                  # Utilities and Database models
│   ├── models/           # Mongoose Schemas (Quiz, Attempt, User)
│   └── mongodb.ts        # DB Connection
├── public/               # Static assets
└── types/                # TypeScript definitions
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
