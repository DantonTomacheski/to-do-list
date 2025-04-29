# Implementation plan

## Phase 1: Environment Setup

1. **Prevalidation**: Check if current directory already has a Vite/React project by running `test -f package.json`. If true, skip steps 2–9. (Project Summary: Important Considerations)
2. Install Node.js v18.x. (Project Summary: Key Technologies: Frontend)
3. **Validation**: Run `node -v` and confirm output starts with `v18.`. (Project Summary: Key Technologies: Frontend)
4. Install Git. (Project Summary: Development Tools)
5. **Validation**: Run `git --version` to confirm installation. (Project Summary: Development Tools)
6. Initialize a new Git repo: `git init`. (Project Summary: Development Tools)
7. Create `/ .gitignore` and add:
   - `node_modules/`
   - `dist/`
   - `.env`
     (Project Summary: Important Considerations)
8. Create a new Vite React+TS project:
   ````bash
   npm create vite@latest my-tasks-app -- --template react-ts !!IMPORTANT, use REACT 18 because tailwind has not support in react 19
   ```  (Project Summary: Key Technologies: Frontend)
   ````
9. `cd my-tasks-app` && run `npm install`. (Project Summary: Key Technologies: Frontend)
10. Open the project in Windsurf IDE. (Project Summary: Development Tools: Windsurf IDE)
11. **Validation**: Run `npm run dev` and verify the app is live at http://localhost:3000. (Project Summary: Key Technologies: Frontend)

## Phase 2: Frontend Development

12. Create Atomic Design folders under `/src`:
    - `/atoms`
    - `/molecules`
    - `/organisms`
    - `/templates`
    - `/pages`  
      (Project Summary: Key Technologies: Atomic Design)
13. Install Tailwind CSS, PostCSS, Autoprefixer:
    ````bash
    npm install -D tailwindcss@latest postcss autoprefixer
    npx tailwindcss init -p
    ```  (Project Summary: Key Technologies: Frontend)
    ````
14. Configure `tailwind.config.cjs`:
    ````js
    module.exports = {
      content: ['./index.html','./src/**/*.{ts,tsx}'],
      theme: {
        extend: {
          colors: {
            purple: '#5B3FFF',
            pink:   '#EC4899',
            orange: '#F97316',
          },
        },
      },
      plugins: [require('@tailwindcss/forms')],
    }
    ```  (Project Summary: Styling & UI)
    ````
15. Install Lucide React icons: `npm install lucide-react`. (Project Summary: Styling & UI)
16. Install state & persistence libraries:
    ````bash
    npm install zustand browser-image-compression
    ```  (Project Summary: Key Technologies: State Management & Persistence)
    ````
17. Install date library: `npm install dayjs`. (Project Summary: Key Technologies: Date & Time)
18. Install i18n libs:
    ````bash
    npm install i18next react-i18next
    ```  (Project Summary: Key Technologies: i18n)
    ````
19. Create `/src/i18n.ts` and configure English and Portuguese namespaces. (Project Summary: Important Considerations: i18n)
20. Install PWA tooling: `npm install -D workbox-cli`. (Project Summary: Key Technologies: PWA)
21. Add `workbox-config.js` in project root to precache `/index.html`, `/src/**/*.{js,css}`. (Project Summary: Key Technologies: PWA)
22. Create `/public/manifest.json` with app name, icons, `start_url: '.'`, `display: 'standalone'`. (Project Summary: Key Technologies: PWA)
23. Install testing tools:
    ````bash
    npm install -D jest @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest
    npx ts-jest config:init
    ```  (Project Summary: Key Technologies: Testing)
    ````
24. **Validation**: Run `npm test -- --coverage` and confirm setup passes with no tests. (Project Summary: Key Technologies: Testing)
25. Install React Router: `npm install react-router-dom@6`. (Project Summary: Key Features: Onboarding)

## Phase 3: Core Feature Implementation

26. **Onboarding**  
    a. Create `/src/pages/Onboarding.tsx`.  
    b. Add form fields: `nome`, `sobrenome`, and file input for profile picture.  
    c. Use `browser-image-compression` to compress before storing Base64.  
    d. On submit, save to Zustand store with persistence.  
    **Validation**: Write `Onboarding.test.tsx` under `/src/__tests__`, run `npm test Onboarding`. (Project Summary: Key Features: Onboarding)
27. **User Store**:  
    Create `/src/stores/userStore.ts` with Zustand + `persist` middleware to `localStorage`. (Project Summary: Key Technologies: State Management & Persistence)
28. **Dashboard Page**:  
    a. Create `/src/pages/Dashboard.tsx`.  
    b. Add progress card, horizontally scrollable project list, grouped task overview, bottom nav.  
    **Validation**: Write visual/storybook snapshot or RTL tests. (Project Summary: Key Features: Dashboard)
29. **Project Management**  
    a. Under `/src/organisms/`, create `ProjectCard.tsx`, `ProjectForm.tsx`.  
    b. Allow create/edit/delete with fields: `nome`, `categoria`, `descricao`, dates, logo upload.  
    c. Store in Zustand store under `projetos`.  
    **Validation**: Write `/src/__tests__/ProjectForm.test.tsx`. (Project Summary: Key Features: Project Management)
30. **Task Management**  
    a. Under `/src/organisms/`, create `TaskList.tsx`, `TaskForm.tsx`.  
    b. Support statuses: To-do, In Progress, Completed; dates & times.  
    c. Persist in store under `tarefas`.  
    **Validation**: Write `/src/__tests__/TaskForm.test.tsx`. (Project Summary: Key Features: Task Management)
31. **Calendar & Filters**  
    a. Create `/src/organisms/CalendarView.tsx` showing 5-day window.  
    b. Add status filter buttons.  
    **Validation**: Write `/src/__tests__/CalendarView.test.tsx`. (Project Summary: Key Features: Calendar & Filters)
32. **Notifications**  
    a. In `/src/hooks/`, create `useNotifications.ts` that scans tasks and emits in-app alerts for upcoming/overdue.  
    b. Display under a new `/src/organisms/NotificationsPanel.tsx`.  
    **Validation**: Simulate in RTL test. (Project Summary: Key Features: Notifications)

## Phase 4: PWA & Offline Support

33. Register service worker in `/src/main.tsx`:
    ````js
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
    ```  (Project Summary: Key Technologies: PWA)
    ````
34. Build production assets: `npm run build`. (Project Summary: Key Technologies: PWA)
35. Serve locally with Workbox CLI:
    ````bash
    npx workbox-cli injectManifest
    npx serve -s dist
    ```  (Project Summary: Key Technologies: PWA)
    ````
36. **Validation**: Load `http://localhost:5000`, go offline in DevTools, and confirm app still functions (add/edit tasks). (Project Summary: Important Considerations: Offline Functionality)

## Phase 5: CI/CD & Deployment

37. Create GitHub Actions workflow under `/.github/workflows/ci.yml`:
    ````yaml
    name: CI
    on: [push]
    jobs:
      build-and-test:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - uses: actions/setup-node@v3
            with: { node-version: '18' }
          - run: npm ci
          - run: npm test -- --coverage
          - run: npm run build
    ```  (Project Summary: CI/CD & Hosting)
    ````
38. **Validation**: Push to GitHub, confirm Actions passes on main branch. (Project Summary: CI/CD & Hosting)
39. Connect repo to Vercel: set framework to Vite, build command `npm run build`, output `dist`. (Project Summary: CI/CD & Hosting)
40. Deploy to Vercel and enable Preview Deployments. (Project Summary: CI/CD & Hosting)
41. **Validation**: Visit production URL, test onboarding → dashboard → offline support → PWA install prompt. (Project Summary: Important Considerations)

## Phase 6: End-to-End Testing & Final Review

42. Install Cypress: `npm install -D cypress`. (Project Summary: Key Technologies: Testing)
43. Initialize Cypress in project root: `npx cypress open`. (Project Summary: Key Technologies: Testing)
44. Write e2e tests for main flows under `/cypress/e2e/`:
    - onboarding.cy.ts
    - projects.cy.ts
    - tasks.cy.ts
    - offline.cy.ts  
      **Validation**: Run `npx cypress run` and confirm all pass. (Project Summary: Key Features)
45. Add `cypress run` to CI workflow under a new job. (Project Summary: CI/CD & Hosting)
46. **Final Review**: Audit code for TS strict compliance, ensure no console errors, confirm all tests & e2e pass. (Project Summary: Important Considerations)
47. Document developer setup in `/README.md`: environment, commands, architecture overview. (Project Summary: Important Considerations)
48. Tag release `v1.0.0` and publish changelog. (Project Summary: Important Considerations)
49. Share installable PWA link with stakeholders and collect feedback. (Project Summary: Important Considerations)
50. Plan roadmap for multi–device sync (future). (Project Summary: Important Considerations)
