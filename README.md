# EduMart - School Marketplace & Community Platform

A complete MERN stack application that enables schools to create their own marketplace and community ecosystem. Students can join using unique school codes, buy/sell items, create clubs, and earn points for participation.

## 🚀 Features

### For Schools:
- Register and get a unique school code
- View all items and clubs in your school ecosystem
- Dashboard with school statistics

### For Students:
- Join school using unique school code
- Buy and sell items in the school marketplace
- Create and join clubs
- Earn points for participation:
  - 10 points for listing an item
  - 50 points for creating a club

## 📋 Tech Stack

### Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS

### Frontend:
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React (icons)

## 📁 Project Structure

```
EduMart/
├── backend/
│   ├── models/
│   │   ├── School.js
│   │   ├── User.js
│   │   ├── Item.js
│   │   └── Club.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Mart.jsx
    │   │   └── Clubs.jsx
    │   ├── App.jsx
    │   ├── api.js
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 🛠️ Installation & Setup

### Prerequisites:
- Node.js (v14 or higher)
- MongoDB Atlas account (already configured)

### Backend Setup:

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. The `.env` file is already configured with the MongoDB connection string.

4. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup:

1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎯 Usage Guide

### 1. Register a School:
- Click "Register School"
- Fill in school name, email, and password
- You'll receive a unique school code (e.g., SCH-45)
- Share this code with your students

### 2. Register as a Student:
- Click "Register as Student"
- Fill in your details
- Enter the school code provided by your school
- Join your school's ecosystem

### 3. Login:
- Students: Click "Student Login"
- Schools: Click "School Login"
- Enter your credentials

### 4. Using the Marketplace:
- Navigate to "Mart"
- Click "Sell Item" to list a new item
- Earn 10 points for each item listed
- Browse items from other students in your school

### 5. Creating/Joining Clubs:
- Navigate to "Clubs"
- Click "Create Club" to start a new club
- Earn 50 points for creating a club
- View all clubs in your school
- Click "Join Club" to become a member

## 🔌 API Endpoints

### Authentication:
- `POST /api/auth/register-school` - Register a new school
- `POST /api/auth/register-student` - Register a new student
- `POST /api/auth/login` - Login (student or school)

### Items (Marketplace):
- `GET /api/items?schoolId={id}` - Get all items for a school
- `POST /api/items` - Create a new item listing

### Clubs:
- `GET /api/clubs?schoolId={id}` - Get all clubs for a school
- `POST /api/clubs` - Create a new club

## 💾 Database Models

### School:
- name (String)
- email (String, unique)
- password (String)
- uniqueCode (String, unique)

### User:
- name (String)
- email (String, unique)
- password (String)
- role (enum: 'student', 'school')
- schoolId (ObjectId ref School)
- points (Number, default: 0)
- clubsJoined (Array of ObjectId ref Club)

### Item:
- title (String)
- description (String)
- price (Number)
- category (String)
- condition (enum: 'new', 'like-new', 'good', 'fair', 'poor')
- seller (ObjectId ref User)
- schoolId (ObjectId ref School)

### Club:
- name (String)
- description (String)
- createdBy (ObjectId ref User)
- members (Array of ObjectId ref User)
- schoolId (ObjectId ref School)

## 🎨 Key Features Explained

### Points System:
Students earn points for contributing to the school ecosystem:
- Listing an item: +10 points
- Creating a club: +50 points

### School Code System:
- Each school gets a unique code (format: SCH-XX)
- Students must use this code during registration
- Ensures students only see items and clubs from their school

### Protected Routes:
- Authentication required for Dashboard, Mart, and Clubs pages
- Auto-redirect to login if not authenticated
- Token stored in localStorage for persistence

## 🔒 Security Notes

**IMPORTANT**: This is a development version. For production:
- Implement proper password hashing (bcrypt)
- Use JWT tokens instead of simple string tokens
- Add input validation and sanitization
- Implement rate limiting
- Add HTTPS
- Add authentication middleware

## 🐛 Troubleshooting

### Backend won't start:
- Check if MongoDB connection string is correct
- Ensure port 5000 is not in use
- Verify all dependencies are installed

### Frontend won't start:
- Ensure port 5173 is not in use
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

### Can't register/login:
- Ensure backend is running
- Check browser console for errors
- Verify MongoDB is connected

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork, modify, and use this project for your learning!

---

**Built with 💙 using the MERN Stack**
