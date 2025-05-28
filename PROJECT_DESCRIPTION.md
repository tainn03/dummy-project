# Task Manager

A full-stack task management application built with Next.js, Express.js, TypeScript, MySQL, and Redis. The project is designed for modern productivity workflows, supporting user authentication, robust task management, and seamless containerized deployment.

## Tech Stack

- **Frontend:** Next.js + TypeScript
- **Backend:** Express.js + Node.js + TypeScript
- **Database:** MySQL
- **Session Store:** Redis
- **Containerization:** Docker + Docker Compose

## Features

### Backend

- **Authentication:**
  - `POST /auth/login` – Login user
  - `POST /auth/logout` – Logout user
  - `PUT /auth/change-password` – Change user password
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
