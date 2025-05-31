# Task Manager Prototype

This is a client-side only prototype of a task management application built with [Next.js](https://nextjs.org). It uses mock data to simulate backend functionality without requiring any actual server or database.

## Getting Started

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Mock Data Implementation

This prototype uses a client-side mock data implementation to simulate backend functionality. The key components are:

- **Mock Data Adapter**: Located in `src/adapter/adapter.ts`, it provides mock implementations of all API endpoints
- **Redux Integration**: The mock adapter is seamlessly integrated with Redux for state management
- **Authentication**: Simulates user authentication with mock tokens and session handling
- **Task Management**: Provides full CRUD functionality for tasks with local state persistence

### Login Credentials

For testing purposes, you can use any email address with the password `password` to log in.
