# 📘 ChatBook Application

A **full-stack social media application** built with **Spring Boot (Java)** for backend and designed to be consumed by a **React frontend**.  
It supports **user authentication (JWT)**, **post creation with images**, **likes/unlikes**, and **comments**.

---

## 🚀 Features

### 🔑 Authentication
- User Registration (`/api/users/register`)
- User Login with JWT (`/api/users/login`)
- Secure endpoints protected by Spring Security + JWT

### 📝 Posts
- Create Post (with optional image upload)
- Update Post
- Delete Post
- Fetch Posts by ID or by User
- Like / Unlike a Post
- Add / Delete Comments

---

## 🛠️ Tech Stack

- **Backend**: Spring Boot, Spring Security, JWT
- **Database**: (PostgreSQL / MySQL / H2 — depending on configuration)
- **Frontend**: React.js (connects at `http://localhost:3000`)
- **Build Tool**: Maven
- **Java Version**: 17+

---

## 📂 Project Architecture




<img width="1024" height="1536" alt="image" src="https://github.com/user-attachments/assets/fd186644-f9c9-404a-9fc6-e28911560623" />

# Blog Application

A modern blog application built with React, Redux, and Material-UI. This application includes features like user authentication, blog post creation, comments, likes, and shares.

## Features

- User authentication (login/register) with JWT
- Role-based access control (RBAC)
- Create, read, update, and delete blog posts
- Like and share posts
- Comment on posts
- User profiles with statistics
- Responsive design using Material-UI

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
  ├── components/       # Reusable components
  ├── pages/           # Page components
  ├── store/           # Redux store and slices
  ├── services/        # API services
  ├── theme.ts         # Material-UI theme configuration
  ├── App.tsx          # Main App component
  └── index.tsx        # Application entry point
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## API Endpoints

The application expects the following API endpoints to be available:

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Blog Posts
- GET `/api/posts` - Get all posts
- GET `/api/posts/:id` - Get a specific post
- POST `/api/posts` - Create a new post
- PUT `/api/posts/:id` - Update a post
- DELETE `/api/posts/:id` - Delete a post

### Comments
- POST `/api/posts/:id/comments` - Add a comment to a post

### Interactions
- POST `/api/posts/:id/like` - Like a post
- POST `/api/posts/:id/share` - Share a post

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
