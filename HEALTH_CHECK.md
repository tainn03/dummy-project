# Task Manager Health Check

This document provides a health check for the main components of the Task Manager prototype.

## Mock Data Adapter

The adapter.ts file has been successfully converted to use client-side mock data with the following functionality:

- Authentication (login, logout, register, change password)
- Task management (get tasks, get task by ID, create task, update task, delete task)
- Mock data for users and tasks

## API Routes

The API routes have been updated to reflect the client-side only approach.

## UI Components

The application includes the following key UI components:

- Authentication forms (login, register)
- Dashboard with task listing and filtering
- Task creation and editing forms
- Navigation and user profile components

## Getting Started

To run the application locally, use the following command:

```bash
npm run dev
```

Or for convenience, use the start script:

```bash
start.cmd
```

## Testing Credentials

For testing purposes, you can use any email with the password "password" to log in.

Example: test@example.com / password
