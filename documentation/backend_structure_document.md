# Backend Structure Document

This document outlines the entire “backend” setup for our single‐user task management PWA. In this case, the backend lives entirely in the browser—there is no remote server. All data, business logic, and offline capabilities run on the client side.

## 1. Backend Architecture

*   **Client-Only Architecture**\
    • No server or remote API—everything runs in the user’s browser.\
    • State and data live in `localStorage` via a lightweight state manager (Zustand).\
    • Service Worker (from Vite PWA plugin) handles offline serving and caching.
*   **Design Patterns and Frameworks**\
    • **Repository Pattern**: Abstract data operations behind simple methods (`getUser()`, `saveProject()`, etc.).\
    • **Singleton Store**: One global Zustand store holds user profile, projects, tasks.\
    • **Middleware**: `zustand/middleware` for persistence, automatically syncing store to `localStorage`.
*   **Scalability, Maintainability, Performance**\
    • Horizontal scalability is inherent—each client is self-contained with no server bottleneck.\
    • Small code modules (repositories, services) keep logic organized and easy to maintain.\
    • Service Worker cache and local reads/writes are fast, ensuring quick load times and offline reliability.

## 2. Database Management

*   **Storage Technology**\
    • **Type**: Client-side key/value store.\
    • **System**: `window.localStorage`, wrapped by Zustand’s persistence middleware.
*   **Data Structure and Access**\
    • Data is stored as JSON strings under well-known keys (`user`, `projects`, `tasks`).\
    • On app load, the store hydrates from `localStorage`.\
    • All CRUD operations go through the Zustand store, which writes back to `localStorage` automatically.
*   **Data Management Practices**\
    • **Versioning**: Include a simple version key to migrate older data shapes if needed.\
    • **Compression**: Images are compressed client-side before being Base64-encoded.\
    • **Size Limits**: Profile photos capped at 200 KB; project logos likewise, ensuring `localStorage` limits aren’t exceeded.

## 3. Database Schema

Because we’re using a NoSQL-style key/value store, our “schema” is a set of JSON object shapes. Below is a human-readable description.

User Profile (`user` key)

*   id: unique string identifier
*   firstName: user’s given name
*   lastName: user’s family name
*   profilePhoto: Base64-encoded image data (max 150×150px)

Project (`projects` key holds an array)

*   id: unique string identifier
*   name: project title
*   description: free-text details
*   category: one of Office, Personal, Study, Work
*   dates: object with startDate and endDate (DD/MM/YYYY)
*   logo: Base64-encoded image data (max 100×100px)
*   progress: number (0–100)
*   tasks: array of Task IDs belonging to this project

Task (`tasks` key holds an array)

*   id: unique string identifier
*   projectId: string ID of parent project
*   title: task name
*   status: one of To-do, In Progress, Completed
*   scheduledDate: date string (DD/MM/YYYY)
*   scheduledTime: time string (HH:mm)

## 4. API Design and Endpoints

There are no HTTP endpoints. Instead, we expose a small, consistent set of client-side methods:

*   **UserRepository**\
    • `getUser()`: Return user object or null.\
    • `saveUser(user)`: Create/update user in store.
*   **ProjectRepository**\
    • `listProjects()`: Return array of project objects.\
    • `createProject(project)`, `updateProject(id, updates)`, `deleteProject(id)`.
*   **TaskRepository**\
    • `listTasks(filter?)`: Return tasks, optional filter by projectId or status.\
    • `createTask(task)`, `updateTask(id, updates)`, `deleteTask(id)`.

These methods are simple JavaScript/TypeScript functions imported wherever the UI needs them.

## 5. Hosting Solutions

*   **Static Hosting on Vercel**\
    • Live CDN edge network for global asset distribution.\
    • Automatic HTTPS with custom domains.\
    • Built-in support for Vite, deploy on each Git push.
*   **Benefits**\
    • **Reliability**: Vercel’s 99.99% uptime SLA.\
    • **Scalability**: Unlimited concurrent users; no server resources to manage.\
    • **Cost-Effectiveness**: Free tier covers most needs; usage billed only if you exceed limits.

## 6. Infrastructure Components

*   **Service Worker & Caching**\
    • Powered by Vite PWA plugin.\
    • Precaches core assets (HTML, JS, CSS) at install time.\
    • Defines runtime caching for images and API calls (none in this case).
*   **Content Delivery Network (CDN)**\
    • Vercel’s global CDN automatically serves assets from the nearest edge location.
*   **Build & CI/CD**\
    • **GitHub Actions**: Runs type checks, lints, and tests on each PR.\
    • On merge to `main`, auto-deploy to Vercel.

## 7. Security Measures

*   **Transport Security**\
    • HTTPS enforced by Vercel for all assets.\
    • Service Worker only runs over secure origins.
*   **Content Security Policy (CSP)**\
    • Restricts scripts, styles, images to approved sources (self, data URIs).\
    • Prevents injection attacks.
*   **Data Protection**\
    • Profile and project images stored as Base64 in `localStorage`—never sent over network.\
    • No sensitive data leaves the browser.
*   **Authentication & Authorization**\
    • Single-user app—no sign-in.\
    • All data is scoped to the current browser instance.

## 8. Monitoring and Maintenance

*   **Error Tracking & Logs**\
    • Local console logs during development.\
    • Optional: integrate Sentry or LogRocket if future debugging needs arise.
*   **Performance Monitoring**\
    • Vercel Analytics for real-user metrics (LCP, FID, CLS).\
    • Lighthouse CI audits during builds (performance, accessibility, best practices).
*   **Maintenance Strategy**\
    • Regular dependency updates via automated tools (Dependabot).\
    • Versioned migrations for `localStorage`—on new releases, detect old data shapes and migrate.

## 9. Conclusion and Overall Backend Summary

Our app’s “backend” is entirely client-side, built on a simple, reliable pattern: Zustand for state + persistence, service worker for offline, and Vercel for static hosting. This approach perfectly fits a single-user PWA: it minimizes complexity, maximizes performance, and eliminates server costs. All data stays on the user’s device, the UI talks to well-defined repository methods, and assets are served from a global CDN. Together, these components satisfy our goals of offline readiness, ease of maintenance, and a smooth user experience.
