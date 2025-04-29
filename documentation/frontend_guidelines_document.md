# Frontend Guideline Document

## Frontend Architecture

We’re building a modern, high-performance single-user task management Progressive Web App (PWA). Here’s how everything fits together:

- **Build Tool:** Vite gives us lightning-fast dev server startup and optimized production bundles out of the box.
- **Core Framework:** React 18 with functional components and hooks—keeps the codebase familiar to most developers.
- **Language:** TypeScript in strict mode ensures type safety, fewer runtime errors, and better editor support.
- **State Management:** Zustand provides a simple, minimal API for global state. We organize state into slices (user, projects, tasks) and persist it in `localStorage` via the Zustand persist middleware.
- **Styling:** Tailwind CSS with a custom theme for rapid, utility-first styling.
- **PWA Support:** A service worker handles offline caching of assets and API responses. A manifest.json with icons and splash screens lets users install the app on mobile or desktop.

This setup scales as your feature list grows: component-based React plus atomic design keeps things modular, Zustand slices stay small and focused, and Vite handles code splitting automatically. Performance is baked in, and maintenance is easier with clear boundaries between UI, state, and styling.

## Design Principles

1. **Usability:** Every screen follows a clear hierarchy. Primary actions (like adding a task) are always prominent.
2. **Accessibility:** We use semantic HTML, ARIA labels for interactive elements, and ensure color contrast meets WCAG AA.
3. **Responsiveness & Mobile-First:** We optimize for phones (360px width) first, then scale up to tablets and desktops. Touch targets are large enough for thumbs.
4. **Smooth Transitions & Tactile Feedback:** Subtle animations and feedback (button presses, drag-and-drop) guide the user’s eye and convey status changes.
5. **Internationalization:** Built-in support for Brazilian Portuguese (default) and English. Date formats (DD/MM/YYYY, long and short), day names, and 24-hour time ensure local users feel at home.

## Styling and Theming

### Approach
- **Tailwind CSS:** Utility-first classes speed up development. We configure a custom theme in `tailwind.config.js`.
- **Methodology:** We follow a loosely scoped utility approach instead of BEM or SMACSS—Tailwind utilities encourage consistency without extra class names.

### Theme & Style
- **Style:** Modern, flat design with occasional glassmorphic cards for key panels (e.g., progress overview).

### Color Palette
| Name         | Hex      | Usage                           |
|--------------|----------|---------------------------------|
| Purple       | #5B3FFF  | Primary buttons, highlights     |
| Pink         | #EC4899  | Secondary accents, links        |
| Orange       | #F97316  | Warnings, progress indicators   |
| Gray-700     | #374151  | Text primary                    |
| Gray-200     | #E5E7EB  | Backgrounds, borders            |

### Typography
- **Font Family:** Inter (system-fallbacks: -apple-system, BlinkMacSystemFont, ‘Segoe UI’).
- **Headings:** Bold, slightly larger line-height for clarity.
- **Body Text:** Regular weight, 1.5 line-height for readability.

## Component Structure

We organize UI code following **Atomic Design**:

- **Atoms:** Buttons, inputs, icons (Lucide React), badges.
- **Molecules:** Form groups, card headers, status chips.
- **Organisms:** Navigation bars, project carousels, task lists.
- **Templates:** Page layouts combining organisms—onboarding flow, dashboard shell.
- **Pages:** Route-driven views (Onboarding, Dashboard, Project Detail, Calendar).

Benefits:
- Reusability: Atoms and molecules can be shared across pages.
- Maintainability: Smaller files, clear folder structure (`src/components/atoms`, `/molecules`, etc.).

## State Management

We rely on **Zustand** for a lightweight store:

- **Slices:** Each domain (user, projects, tasks) has its own slice file.
- **Persistence:** Zustand’s `persist` middleware writes state to `localStorage`. On load, state hydrates automatically.
- **APIs:** Simple setter/getter functions. Example:
  ```ts
  // src/store/projectsSlice.ts
  import create from 'zustand';
  import { persist } from 'zustand/middleware';

  interface Project { /* id, name, color, dates, etc. */ }
  interface ProjectsState {
    projects: Project[];
    addProject: (p: Project) => void;
    // ...
  }

  export const useProjectsStore = create(
    persist<ProjectsState>((set) => ({
      projects: [],
      addProject: (p) => set((state) => ({ projects: [...state.projects, p] })),
    }), {
      name: 'projects-storage',
    })
  );
  ```

Shared state flows smoothly between Dashboard, Project pages, Task lists, and Filters.

## Routing and Navigation

- **Library:** React Router (v6) for declarative, nested routes.
- **Structure:**
  - `/onboarding` → Onboarding flow (Welcome → Profile Form)
  - `/dashboard` → Main hub (profile, progress, project carousel)
  - `/project/:id` → Project detail (tasks, calendar)
  - `/settings` → User preferences
- **Bottom Navigation (Mobile):** Icons for quick access: Dashboard, Calendar, Add Task, Projects, Profile.
- **Nav Guards:** If the user profile isn’t in localStorage, redirect to `/onboarding`.

## Performance Optimization

- **Code Splitting:** Vite automatically splits by route. We also use `React.lazy` + `Suspense` for heavy components (calendar view, 3D illustration viewer).
- **Asset Optimization:** Images loaded only when needed. 3D illustrations served in optimized SVG or low-res PNG.
- **Image Compression:** On the client, we compress uploads with `browser-image-compression` before encoding to Base64 (max 200KB for logos, 150×150px for profile).
- **Caching:** Service worker caches static assets and JSON data to keep the app snappy offline.

## Testing and Quality Assurance

- **Unit & Component Tests:** Jest + React Testing Library. We test individual components and custom hooks (e.g., useTasks, useProjects).
- **Integration Tests:** Combine related components (e.g., TaskList + TaskItem) to ensure end-to-end flows work locally.
- **Test Coverage:** Aim for >80% coverage on core slices and UI components.
- **Example Test:**
  ```tsx
  // src/components/atoms/Button.test.tsx
  import { render, screen, fireEvent } from '@testing-library/react';
  import Button from './Button';

  test('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByText(/click me/i));
    expect(onClick).toHaveBeenCalled();
  });
  ```

## Conclusion and Overall Frontend Summary

This frontend setup balances modern development speed (Vite, React 18, Tailwind) with robust architecture (Atomic Design, Zustand). It ensures:

- **Scalability:** Modular components and clear folder structure.
- **Maintainability:** TypeScript types, isolated state slices, and comprehensive testing.
- **Performance:** PWA support, code splitting, caching, and image compression.
- **User Focus:** Mobile-first, accessible, bilingual, and offline-ready.

With these guidelines in place, any developer—even without deep familiarity with the codebase—can confidently work on features, styles, or fixes, keeping the app reliable, fast, and delightful for users.