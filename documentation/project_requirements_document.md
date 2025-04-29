# Project Requirements Document (PRD)

## 1. Project Overview

This project is a lightweight, single-user task management Progressive Web App (PWA) built with Vite, React 18, and TypeScript. It lets a guest user track projects and tasks entirely in the browser without any backend. All data—user profile, projects, tasks, even images—is stored in localStorage via Zustand’s persistence middleware. The app follows the Atomic Design methodology for a modular, maintainable UI and uses Tailwind CSS for a modern, responsive look.

We’re building this to give individuals an installable, offline-capable to-do system with clear project progress, date-based filtering, and simple visual notifications. Success is measured by achieving instant page loads (<2s), 100% data persistence across reloads, full mobile-first responsiveness, and a test suite covering all critical logic and UI flows.

## 2. In-Scope vs. Out-of-Scope

### In-Scope (Version 1)

*   **Onboarding / Guest login**: Welcome screen + name, surname, optional photo upload → stored in localStorage.

*   **Dashboard**:

    *   Header with profile picture + in-app notification icon.
    *   Progress card (e.g. “85% complete”).
    *   Horizontally scrollable project cards.
    *   Grouped tasks overview.
    *   Bottom nav with “Add” button.

*   **Project Tasks Screen**:

    *   Five-day calendar navigator.
    *   Status filters (All, To-do, In Progress, Completed).
    *   Task list with date/time/status.
    *   Drag or tap icons to move tasks through statuses.

*   **Add / Edit Project**:

    *   Form fields: category (fixed list), name, description, start/end dates, logo upload and preview.
    *   Real-time validation.

*   **Add / Edit Task**:

    *   Title, date, time input.
    *   Feedback animations and tactile cues.

*   **Notifications UI**:

    *   Bell icon with badge count.
    *   Dropdown listing in-app reminders for upcoming or overdue tasks.

*   **State Management**:

    *   Zustand store slices for user, projects, tasks, with helper actions (progress calculation, filters).

*   **Persistence**:

    *   All data synced to `localStorage`.
    *   Images stored as compressed Base64 (≤200 KB).

*   **Styling & Theming**:

    *   Tailwind CSS with custom theme (purple #5B3FFF, pink #EC4899, orange #F97316, custom radii, shadows, animations).
    *   @tailwindcss/forms plugin.

*   **Internationalization (i18n)**:

    *   Default Brazilian Portuguese + English.
    *   Date format DD/MM/YYYY, 24h times.

*   **PWA Setup**:

    *   Service Worker for offline caching.
    *   Manifest.json with icons & splash screens.
    *   Installable on desktop/mobile.

*   **Testing**:

    *   Jest + React Testing Library.
    *   Unit tests for store logic & helper functions.
    *   Component tests (snapshots, user interactions).
    *   Integration tests for major flows.

*   **Hosting & CI/CD**:

    *   Vercel deployment with GitHub Actions.

### Out-of-Scope (Later Phases)

*   Real authentication (email/password) or multi-user sync in cloud.
*   Web Push API or server-driven notifications.
*   Export/import of data.
*   User-created categories or custom task statuses.
*   Admin roles or permission levels.

## 3. User Flow

A first-time visitor lands on a 3D-style welcome screen with title, subtitle, and a “Let’s Start” button. Tapping that opens a form for first name, last name, and optional profile photo (via file input or webcam). On submit, the app writes these details to `localStorage` and redirects to the main dashboard.

On the dashboard, the user sees their profile pic and a bell icon (with badge) in the header. Below, a progress card shows overall task completion, followed by horizontally scrollable project cards, each color-coded by category. A fixed bottom nav bar features a plus button. Tapping a project card navigates to its task screen, where the top calendar strip and status filters refine the task list. Hitting the plus button on any screen opens modals for adding projects or tasks. The notifications dropdown and profile-edit menu are also accessible from the header.

## 4. Core Features

*   **Onboarding & Guest Profile**

    *   Simple form, optional photo, persist via Zustand.

*   **Dashboard**

    *   Progress % card, project carousel, task groups, bottom nav.

*   **Project Management**

    *   Create, edit, delete projects with real-time validation & logo preview.

*   **Task Management**

    *   Add/edit tasks, date/time pickers, drag/tap status changes.

*   **Calendar & Filters**

    *   Five-day navigator, filter by All/To-do/In Progress/Completed.

*   **Notifications UI**

    *   Badge count, dropdown list of in-app reminders.

*   **State & Persistence**

    *   Zustand store + persist middleware → `localStorage`.

*   **Image Handling**

    *   client-side compression (browser-image-compression), Base64 storage.

*   **Styling & Theming**

    *   Tailwind CSS with custom theme and @tailwindcss/forms.

*   **Atomic Design Structure**

    *   /atoms, /molecules, /organisms, /templates, /pages.

*   **Internationalization**

    *   i18n setup for pt-BR & en-US, dayjs/date-fns for formatting.

*   **PWA Capabilities**

    *   Service worker, offline caching, install banner.

*   **Testing**

    *   Jest + React Testing Library for unit, component & integration tests.

## 5. Tech Stack & Tools

*   **Build & Framework**: Vite, React 18, TypeScript (strict mode)

*   **State**: Zustand + `zustand/middleware` (persist to `localStorage`)

*   **Styling**: Tailwind CSS (custom theme), @tailwindcss/forms

*   **Component Methodology**: Atomic Design (/atoms → /pages)

*   **Icons & Illustrations**:

    *   Lucide React (icons)
    *   unDraw, Blush or Storyset (3D illustrations)

*   **Image Compression**: browser-image-compression

*   **Date & Time**: dayjs or date-fns with locale plugins

*   **Testing**: Jest, React Testing Library

*   **PWA**: Vite PWA plugin (service worker, manifest)

*   **Hosting & CI/CD**: Vercel + GitHub Actions

*   **IDE & AI Assist**: Windsurf IDE, Claude 3.7 Sonnet, GPT-4.1

## 6. Non-Functional Requirements

*   **Performance**

    *   First meaningful paint <2s on 3G throttled network.
    *   UI interactions (<100 ms) with Tailwind transitions.

*   **Offline & PWA**

    *   Full offline functionality after initial load.
    *   Cache assets/data via service worker.

*   **Responsiveness**

    *   Mobile-first design (360px → 768px+).
    *   Layouts adapt via Flexbox & CSS Grid.

*   **Accessibility (a11y)**

    *   All buttons/inputs reachable via keyboard.
    *   ARIA labels for icons & forms.

*   **Security**

    *   Sanitize user inputs.
    *   Prevent XSS in profile/project names.

*   **Reliability**

    *   100% data persistence across page reloads.
    *   Graceful fallback if `localStorage` is full.

*   **Maintainability**

    *   Modular Atomic structure.
    *   Strict TypeScript types throughout.

*   **Internationalization**

    *   Locale detection + switcher.
    *   Standard date & number formats per region.

## 7. Constraints & Assumptions

*   **Browser Storage**: localStorage limited to ~5 MB – images must compress to ≤200 KB each.
*   **Environment**: modern evergreen browsers (Chrome, Firefox, Safari).
*   **Network**: online only for first load; full offline thereafter.
*   **Single-User**: no backend or multi-device sync.
*   **PWA Support**: expects Service Worker & manifest to work on target browsers.
*   **Image APIs**: HTML5 file/webcam inputs supported.
*   **Translations**: initial locale files provided for pt-BR & en-US.

## 8. Known Issues & Potential Pitfalls

*   **Storage Overflow**

    *   Compress images aggressively.
    *   Alert user if `localStorage` quota is reached.

*   **Service Worker Caching**

    *   Stale assets on update – implement cache versioning & SW skipWaiting logic.

*   **Date Handling**

    *   Inconsistent formats across locales – rely on dayjs/date-fns with locale flags.

*   **Tailwind Snapshot Tests**

    *   Utility-class name changes can break snapshots – consider structural queries over snapshots or update scripts.

*   **Responsive Calendar**

    *   Five-day view may overflow on very narrow screens – ensure horizontal scroll fallback.

*   **Testing Timeouts**

    *   Simulating image compression or i18n loading can slow tests – mock heavy APIs where possible.

This document fully defines the first-release scope, user flows, feature set, tooling, constraints, and quality goals so an AI-driven coding assistant can generate subsequent architecture, guidelines, and implementation plans without ambiguity.
