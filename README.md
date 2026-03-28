# 🎓 Role-Based Academic Database Management System

A complete full-stack web application for centralizing academic data with secure, role-based access control. Built with **React + Vite** (frontend) and **FastAPI + PostgreSQL** (backend).

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Database Setup](#-database-setup)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Demo Credentials](#-demo-credentials)
- [Key Features by Role](#-key-features-by-role)

---

## ✨ Features

### 🔐 Authentication & Security
- User registration with role selection
- JWT-based authentication
- Password hashing with bcrypt
- Role-based route protection

### 👥 Role-Based Access Control
- **Admin**: Manage students, system records
- **HOD**: Monitor attendance and marks
- **Faculty**: Upload attendance, enter marks
- **Student**: View personal attendance, marks, SGPA/CGPA

### 📊 Core Functionality
- **Attendance Management**: Track and update student attendance
- **Marks Management**: Store and calculate grades
- **SGPA/CGPA Calculation**: Automatic grade point averaging
- **Data Visibility**: Role-based data filtering and access

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling

### Backend
- **FastAPI** - Web framework
- **Python 3.9+** - Language
- **SQLAlchemy** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

---

## 📂 Project Structure

```
student_details/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app
│   │   ├── database.py             # Database config
│   │   ├── models/
│   │   │   ├── user.py             # User model
│   │   │   ├── student.py          # Student model
│   │   │   ├── attendance.py       # Attendance model
│   │   │   └── marks.py            # Marks model
│   │   ├── schemas/
│   │   │   └── __init__.py         # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── auth.py             # Auth routes
│   │   │   ├── students.py         # Student routes
│   │   │   ├── attendance.py       # Attendance routes
│   │   │   └── marks.py            # Marks routes
│   │   └── auth/
│   │       ├── utils.py            # JWT & password utilities
│   │       └── dependencies.py     # Route dependencies
│   ├── main.py                     # Entry point
│   ├── requirements.txt            # Python dependencies
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── UI.jsx              # Reusable components
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── dashboards/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── HODDashboard.jsx
│   │   │       ├── FacultyDashboard.jsx
│   │   │       └── StudentDashboard.jsx
│   │   ├── services/
│   │   │   ├── api.js              # Axios config
│   │   │   └── index.js            # API endpoints
│   │   ├── utils/
│   │   │   └── auth.js             # Auth utilities
│   │   ├── App.jsx                 # Main app
│   │   ├── main.jsx                # Entry point
│   │   └── index.css               # Styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .gitignore
│   └── README.md
│
└── README.md                       # This file
```

---

## 📦 Prerequisites

Before you begin, ensure you have installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://www.python.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/)

### Verify Installations
```bash
# Check Node.js and npm
node --version
npm --version

# Check Python
python --version

# Check PostgreSQL
psql --version
```

---

## 🗄️ Database Setup

### 1. Create PostgreSQL Database

Open PostgreSQL command line or use pgAdmin:

```sql
-- Create database
CREATE DATABASE academic_db;

-- Create user (optional but recommended)
CREATE USER academic_user WITH PASSWORD 'password';

-- Grant privileges
ALTER ROLE academic_user SET client_encoding TO 'utf8';
ALTER ROLE academic_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE academic_user SET default_transaction_deferrable TO on;
ALTER ROLE academic_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE academic_db TO academic_user;
```

### 2. Update Database Configuration

Edit **backend/app/database.py**:

```python
# Update this line with your database credentials
DATABASE_URL = "postgresql://academic_user:password@localhost:5432/academic_db"
```

**Format:** `postgresql://username:password@host:port/database_name`

---

## 🚀 Installation & Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   # On Windows
   python -m venv venv
   venv\Scripts\activate

   # On macOS/Linux
   python -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create database tables**
   Tables will be created automatically when you start the server. To manually create them:
   ```bash
   python -c "from app.database import create_tables; create_tables()"
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration** (Optional)
   Create a `.env.local` file if you need to customize the API URL:
   ```
   VITE_API_URL=http://localhost:8000
   ```

---

## ▶️ Running the Application

### Start Backend Server

```bash
# From backend directory with virtual environment activated
cd backend

# Activate virtual environment (if not already activated)
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Run the server
python main.py

# Or use uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will run on:** `http://localhost:8000`

### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend

# Install dependencies if not done
npm install

# Start dev server
npm run dev
```

**Frontend will run on:** `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📚 API Documentation

### Interactive API Docs

Once the backend is running, visit:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### API Endpoints

#### Authentication
```
POST   /auth/signup        - Register new user
POST   /auth/login         - Login user
GET    /auth/me            - Get current user profile
```

#### Students
```
GET    /students/          - Get all students (Admin, HOD, Faculty)
POST   /students/          - Add new student (Admin)
GET    /students/my-profile - Get current student's profile (Student)
GET    /students/{id}      - Get specific student (Admin, HOD, Faculty)
PUT    /students/{id}      - Update student (Admin)
DELETE /students/{id}      - Delete student (Admin)
```

#### Attendance
```
GET    /attendance/student/{id}     - Get student's attendance
GET    /attendance/my-attendance    - Get current student's attendance
POST   /attendance/                 - Create/update attendance (Faculty, Admin)
PUT    /attendance/{id}             - Update attendance (Faculty, Admin)
DELETE /attendance/{id}             - Delete attendance (Admin)
```

#### Marks
```
GET    /marks/student/{id}          - Get student's marks
GET    /marks/my-marks              - Get current student's marks
GET    /marks/my-gpa                - Get current student's SGPA/CGPA
POST   /marks/                      - Create/update marks (Faculty, Admin)
PUT    /marks/{id}                  - Update marks (Faculty, Admin)
DELETE /marks/{id}                  - Delete marks (Admin)
GET    /marks/student/{id}/gpa      - Get student's GPA (Admin, HOD, Faculty)
```

---

## 🔑 Demo Credentials

Use these credentials to test the application:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password |
| HOD | hod@example.com | password |
| Faculty | faculty@example.com | password |
| Student | student@example.com | password |

**Note:** Create these users first by signing up or use the database directly.

---

## 👥 Key Features by Role

### 🔹 Admin
- ✅ Add and manage student records
- ✅ View all students
- ✅ Enter and manage semester results
- ✅ Delete student records
- ✅ Manage attendance and marks

### 🔹 HOD (Head of Department)
- ✅ View all students in department
- ✅ Monitor attendance trends
- ✅ Monitor marks and performance
- ✅ Generate reports (read-only)

### 🔹 Faculty
- ✅ Upload student attendance
- ✅ Enter internal marks (0-50)
- ✅ View student list
- ✅ Track attendance percentage

### 🔹 Student
- ✅ View personal attendance
- ✅ View personal marks
- ✅ View SGPA and CGPA
- ✅ Track academic progress

---

## 🧮 SGPA/CGPA Calculation

**Grading Scale:**
- 90-100: 4.0 (A+)
- 80-89: 3.7 (A)
- 70-79: 3.3 (B+)
- 60-69: 3.0 (B)
- 50-59: 2.0 (C)
- Below 50: 0.0 (F)

**SGPA:** Average of all grade points in the semester
**CGPA:** Average of all grade points (simplified - tracks all semesters equally)

---

## 🔒 Security Features

- ✅ JWT-based stateless authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based route protection
- ✅ CORS enabled for cross-origin requests
- ✅ Secure token storage in localStorage
- ✅ Automatic logout on token expiration

---

## 📝 Environment Variables

### Backend `.env` (Optional)

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/academic_db

# JWT
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend `.env.local` (Optional)

```
VITE_API_URL=http://localhost:8000
```

---

## 🧪 Testing the Application

1. **Sign Up** with different roles
2. **Login** with appropriate credentials
3. **Admin Dashboard:**
   - Add students
   - View all student records
4. **Faculty Dashboard:**
   - Upload attendance
   - Enter marks
5. **Student Dashboard:**
   - View attendance
   - View marks and GPA
6. **HOD Dashboard:**
   - Monitor students and data

---

## 🛠️ Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Use different port
uvicorn app.main:app --reload --port 8001
```

**Database connection error:**
- Verify PostgreSQL is running
- Check database credentials in `database.py`
- Ensure database exists

**Import errors:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**Port 5173 already in use:**
```bash
npm run dev -- --port 5174
```

**API connection errors:**
- Verify backend is running on `http://localhost:8000`
- Check CORS settings in `app/main.py`
- Verify API URL in `frontend/src/services/api.js`

---

## 📦 Building for Production

### Backend
```bash
cd backend
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

### Frontend
```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## 📄 License & Credits

This is an educational project demonstrating full-stack web development with modern technologies.

---

## ✅ Checklist Before Deployment

- [ ] Change `SECRET_KEY` in `backend/app/auth/utils.py`
- [ ] Update CORS allowed origins in `backend/app/main.py`
- [ ] Configure production database
- [ ] Set up environment variables
- [ ] Test all role functionalities
- [ ] Implement logging
- [ ] Add error handling
- [ ] Set up SSL/HTTPS
- [ ] Configure firewall rules

---

## 📞 Support & Questions

For issues or questions:
1. Check existing documentation
2. Review error messages in browser console or terminal
3. Verify all prerequisites are installed
4. Check API documentation at `/docs`

---

## 🎯 Future Enhancements

- Email notifications
- File upload for documents
- Advanced reporting
- Mobile app
- Real-time updates with WebSockets
- Two-factor authentication
- Audit logs

---

**Happy Learning! 🎓**