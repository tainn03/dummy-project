# Task Manager Prototype

A client-side task management application prototype built with Next.js and TypeScript. The project is designed to demonstrate modern productivity workflows using mock data, supporting simulated user authentication and robust task management features.

## Tech Stack

- **Frontend:** Next.js + TypeScript
- **State Management:** Redux Toolkit
- **Mock Data:** Client-side simulated API

## Features

### Mock API Implementation

- **Authentication:**
  - Mock login functionality
  - Mock logout functionality
  - Mock password change functionality
- **Task Management:**
  - `GET /tasks` – Get all tasks (with filter & sort)
  - `GET /tasks/:id` – Get task detail
  - `POST /tasks` – Create new task
  - `PUT /tasks/:id` – Update task
  - `DELETE /tasks/:id` – Delete task
- **Database Models:**
  - `User`: `id`, `name`, `email`, `password`, `created_at`
  - `Task`: `id`, `title`, `description`, `status`, `deadline`, `created_by`, `created_at`
- **Sessions:** User sessions stored in Redis
- **Config:** All sensitive config via environment variables

### Frontend

- **Pages & Components:**
  - Login Page
  - Dashboard Page (task table)
  - Task Detail Page, Create/Update Task Page
  - Navigation Bar (Dashboard, Profile, Logout)
- **Functions:**
  - Authentication: Login, Logout, Register
  - Task Management: List, View, Create, Edit, Delete, Filter tasks
- **State Management:** Redux Toolkit or React Context API, react-query
- **Routing:** Protected routes for dashboard and tasks
- **Form Validation:** react-hook-form
- **Responsive Design:** Mobile and desktop support

### Containerization

- **Dockerfile** for backend and frontend
- **docker-compose.yml** to run all services (frontend, backend, db, redis) together
