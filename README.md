# ClassLink - Mini Learning Management System (LMS)

ClassLink is a personal project — a lightweight **Learning Management System (LMS)** designed to support instructors and students in managing classes, assignments, quizzes, course materials, and real-time communication.

## Key Features

- **Class Management**  
  Create/manage classes
  Add student to class
  Instructor role-based access control 
  
- **Student Account Management**  
  Create/manage student Accounts
  Instructor role-based access control

- **Course Materials**  
  Upload and organize documents (PDF, images, Word, etc.) per class

- **Assignments**  
  Instructors post assignments  
  Students submit files  
  Instructors grade and provide feedback

- **Online Quizzes**  
  Create timed quizzes (multiple-choice)  
  Attempt limits, time restrictions, automatic scoring

- **Real-time Chat**  
  Instant messaging between instructors and students within each class

- **Secure Authentication**  
  Email + OTP verification  


## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router) · React 19 · TypeScript
- **UI & Styling**: Ant Design 5 · Tailwind CSS 4
- **Data Fetching**: TanStack React Query v5 · Axios
- **Rich Text Editing**: Tiptap (Starter Kit + color, alignment, placeholder extensions)
- **Icons**: Font Awesome · React Icons
- **Firebase**: Client-side SDK (Auth, Firestore)

### Backend
- **Runtime**: Node.js + Express.js
- **Database & Storage**: Firebase Firestore + Firebase Storage
- **Authentication**: Firebase Authentication + Custom Tokens

### Development Tools
- ESLint + Next.js config
- TypeScript
- Git & GitHub
- Vercel (deployment)

## Live Demo & How to Test

**Live Demo**:  
https://classlink-fe.vercel.app/

**Quick Test Accounts** (for demo purposes on the live site):  
Use these pre-configured accounts to log in without registration:

- **Instructor account**  
  Email: `instructor@test.com`  
  OTP: `123456`

- **Student account**  
  Email: `student@test.com`  
  OTP: `123456`

  