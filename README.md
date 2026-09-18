# 🎓 Smart Campus Management System

> **One Platform for Smarter Campus Management**  
> A full-stack web application designed to connect students, faculty, and administrators into an integrated academic environment.

---

## 📌 Project Overview

The **Smart Campus Management System** is an enterprise-grade academic portal built with the **MERN** stack (MongoDB, Express.js, React.js, Node.js). It streamlines academic administration, class scheduling, attendance tracking with statutory alerts (75% requirement), digital assignment workflows with grading and feedback, notice board broadcasts, and role-tailored analytical dashboards.

---

## 🚀 Key Features by Role

### 🛡️ Administrator Portal
* **Executive Dashboard**: Real-time KPI cards for students, faculty, departments, courses, average attendance %, and campus activity distributions powered by **Recharts**.
* **Student Management**: Full CRUD operations for student admission, roll numbers, department/course enrollment, contact records, and semester progression.
* **Faculty Management**: Full CRUD management for professors, designations, departmental affiliations, and subject assignments.
* **Academic Structure**: Manage Academic Departments, Degree Courses, and Course Subjects with credit allocations.
* **Timetable Builder**: Configure weekly class schedules by day, period, classroom, assigned faculty, and start/end times.
* **Campus Broadcasts**: Create and publish prioritized notices (pinned, high priority, urgent) targeting all or specific roles.
* **Campus Events**: Schedule academic conferences, seminars, hackathons, and cultural events.
* **Analytical Reports**: Exportable institutional reports on attendance, performance, and enrollment.

### 👨‍🏫 Faculty Portal
* **Faculty Dashboard**: Instant overview of assigned subjects, today's lecture schedule, class attendance metrics, and pending submissions.
* **Interactive Roll Call**: 1-click batch attendance marking (`Present` / `Absent`) with date selectors and class summaries.
* **Assignment Workflow**: Create assignments with due dates and descriptions; inspect student submissions, assign numerical marks, and provide qualitative feedback.
* **Curriculum Materials**: Upload, categorize, and manage study materials and lecture notes.
* **Student Performance**: Analyze student performance trends across subjects.

### 🎓 Student Portal
* **Student Dashboard**: Personalized greeting, overall attendance percentage with visual circular gauge, today's schedule, upcoming assignment deadlines, and latest announcements.
* **Statutory Attendance Tracker**: Subject-wise attendance breakdown with automatic status flags (`Compliant` vs `Warning (<75%)`).
* **Interactive Timetable**: Visual weekly class timetable with timings, rooms, and professor names.
* **Assignment Submissions**: View assignment details, submit work with solution files/notes, and monitor grading status.
* **Results & Performance**: Track grades and review faculty feedback on graded assignments.
* **Study Repository**: Access lecture notes, references, and study resources uploaded by course instructors.
* **Campus Life**: View upcoming campus events and departmental notice broadcasts.
* **Notifications**: Real-time notification center in top navigation bar with unread counters.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18, React Router v6 | Single Page Application with client-side routing |
| **Styling** | Tailwind CSS | Clean, modern academic UI with responsive layout |
| **Icons** | Lucide React | High-clarity iconography throughout navigation & cards |
| **Analytics** | Recharts | Interactive bar, area, and pie charts |
| **HTTP Client** | Axios | Centralized API client with JWT request interceptors |
| **Backend** | Node.js, Express.js | Robust RESTful API architecture |
| **Database** | MongoDB, Mongoose | Relational-style document modeling with ObjectIds |
| **Authentication** | JSON Web Tokens (JWT), bcrypt.js | Secure stateless authentication & password hashing |
| **File Handling** | Multer | Multi-part file upload support for assignments & materials |

---

## 📁 Folder Structure

```text
smart-campus-management-system/
│
├── frontend/
│   ├── public/                 # Static assets, icons, and favicon
│   ├── src/
│   │   ├── assets/             # Brand logos and images
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout.jsx      # Main authenticated wrapper with Sidebar & Navbar
│   │   │   ├── Navbar.jsx      # Top header with profile, role pill & notifications
│   │   │   ├── Sidebar.jsx     # Responsive role-aware navigation sidebar
│   │   │   ├── ProtectedRoute.jsx # JWT and role authorization route guard
│   │   │   ├── StatCard.jsx    # Analytics metric card component
│   │   │   ├── Modal.jsx       # Accessible animated dialog modal
│   │   │   └── Toast.jsx       # Floating notification alert toaster
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx # Hero showcase and feature introduction
│   │   │   ├── auth/           # Login & Register with 1-click Demo credentials
│   │   │   ├── admin/          # Admin Dashboard, CRUD managers, Timetable & Reports
│   │   │   ├── faculty/        # Faculty Dashboard, Attendance, Assignments & Materials
│   │   │   └── student/        # Student Dashboard, Attendance tracker, Results & Schedule
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global user state, JWT management, and toast triggers
│   │   ├── services/
│   │   │   ├── api.js          # Axios instance configured with JWT bearer headers
│   │   │   ├── authService.js  # Authentication endpoints
│   │   │   └── dataServices.js # REST endpoints for all campus entities
│   │   ├── hooks/              # Custom React hooks
│   │   ├── App.jsx             # Role-based route definitions
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind directives & custom CSS
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection with Mongoose
│   ├── models/                 # 14 Mongoose schema models
│   │   ├── User.js
│   │   ├── Student.js
│   │   ├── Faculty.js
│   │   ├── Department.js
│   │   ├── Course.js
│   │   ├── Subject.js
│   │   ├── Attendance.js
│   │   ├── Assignment.js
│   │   ├── Submission.js
│   │   ├── Notice.js
│   │   ├── Event.js
│   │   ├── Timetable.js
│   │   ├── Material.js
│   │   └── Notification.js
│   ├── controllers/            # Business logic for all entities
│   ├── routes/                 # Express API routing definitions
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification & role authorization
│   │   ├── errorMiddleware.js  # 404 handler & global error formatter
│   │   └── uploadMiddleware.js # Multer file upload storage configuration
│   ├── utils/
│   │   ├── generateToken.js    # JWT token signer
│   │   └── seed.js             # Comprehensive database seeder
│   ├── uploads/                # Directory for uploaded assignments & materials
│   ├── server.js               # Express application entry point
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

## 🗄️ MongoDB Setup

1. Ensure **MongoDB Community Server** is installed and running locally on default port `27017` or use MongoDB Atlas.
2. The database name is `smart_campus_db`.
3. Verify connection:
   ```bash
   mongosh --eval "db.adminCommand('ping')"
   ```

---

## 🔑 Environment Variables

The backend configuration is stored in `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart_campus_db
JWT_SECRET=campus_secret_jwt_key_2026_super_secure_academic_token
```

*(Note: `.env` is included in `.gitignore` to protect secrets).*

---

## 🚀 Installation & Run Commands

### 1. Clone & Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Seed the database with sample faculty, students, classes, and notices
npm run seed

# Start backend server (runs on http://localhost:5000)
npm run dev
```

### 2. Setup & Start Frontend

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend application (runs on http://localhost:3000)
npm start
```

* Frontend URL: **`http://localhost:3000`**
* Backend REST API: **`http://localhost:5000/api`**

---

## 👥 Demo Credentials

For quick evaluation, click the **1-Click Demo Buttons** on the Login page or use these credentials:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin@campus.edu` | `Admin@123` | Full administrative control, all managers, reports |
| **Faculty** | `elena.vance@campus.edu` | `Faculty@123` | Roll call attendance, create assignments, grade, materials |
| **Student** | `aarav.sharma@campus.edu` | `Student@123` | Student dashboard, attendance gauge, results, submissions |

---

## 📡 REST API Documentation

### 🔐 Authentication (`/api/auth`)
* `POST /api/auth/register` — Register a new student or faculty user
* `POST /api/auth/login` — Authenticate and receive JWT token + user profile
* `GET  /api/auth/me` — Retrieve current authenticated user profile (`Private`)
* `PUT  /api/auth/profile` — Update user profile information (`Private`)

### 🎓 Students (`/api/students`)
* `GET    /api/students` — List students with department/course filters (`Admin`, `Faculty`)
* `GET    /api/students/:id` — Get single student profile (`Private`)
* `POST   /api/students` — Register and enroll new student (`Admin`)
* `PUT    /api/students/:id` — Update student information (`Admin`)
* `DELETE /api/students/:id` — Delete student record (`Admin`)

### 👨‍🏫 Faculty (`/api/faculty`)
* `GET    /api/faculty` — List all faculty members (`Admin`, `Faculty`)
* `GET    /api/faculty/:id` — Get single faculty details (`Private`)
* `POST   /api/faculty` — Create faculty record (`Admin`)
* `PUT    /api/faculty/:id` — Update faculty profile (`Admin`)
* `DELETE /api/faculty/:id` — Remove faculty member (`Admin`)

### 🏛️ Departments & Courses (`/api/departments`, `/api/courses`, `/api/subjects`)
* `GET/POST/PUT/DELETE /api/departments` — Department CRUD (`Admin`)
* `GET/POST/PUT/DELETE /api/courses` — Academic degree courses CRUD (`Admin`)
* `GET/POST/PUT/DELETE /api/subjects` — Subject course mapping (`Admin`)

### ⏱️ Attendance (`/api/attendance`)
* `GET  /api/attendance` — Query attendance records with date/subject filters
* `POST /api/attendance` — Batch submit class attendance roll call (`Faculty`, `Admin`)
* `GET  /api/attendance/student/:studentId` — Query specific student attendance logs

### 📝 Assignments & Submissions (`/api/assignments`)
* `GET    /api/assignments` — List assignments
* `POST   /api/assignments` — Create assignment with due date (`Faculty`, `Admin`)
* `GET    /api/assignments/:id` — Get assignment details and all submissions
* `POST   /api/assignments/:id/submit` — Submit assignment solution (`Student`)
* `PUT    /api/assignments/submission/:id/grade` — Grade and provide feedback (`Faculty`)

### 📢 Notices & Events (`/api/notices`, `/api/events`)
* `GET/POST/PUT/DELETE /api/notices` — Institutional notice announcements
* `GET/POST/PUT/DELETE /api/events` — Campus event schedule

### 🗓️ Timetable & Notifications (`/api/timetable`, `/api/notifications`)
* `GET/POST/PUT/DELETE /api/timetable` — Class periods and room scheduling
* `GET /api/notifications` — User notifications list
* `PUT /api/notifications/read-all` — Mark notifications as read

### 📊 Reports & Analytics (`/api/reports`)
* `GET /api/reports/admin` — Institutional overview metrics & activity distributions
* `GET /api/reports/faculty` — Faculty teaching metrics, attendance, submission stats
* `GET /api/reports/student` — Student attendance %, timetable, graded results

---

## 🔮 Future Enhancements
* Integrated live video classroom links (Zoom / Google Meet integration).
* QR code-based mobile attendance check-in.
* Fee payment gateway integration (Stripe / Razorpay).
* Parent portal access for student attendance monitoring.
* SMS / Email notifications via SendGrid and Twilio.

---

## 📄 License
This project is licensed under the MIT License.
