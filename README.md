# Task Management & To-Do App 📆

A slick, mobile-first task manager built with Vite, React 18, TypeScript & Tailwind CSS.

[![MIT License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Vite](https://img.shields.io/badge/Vite-%5E5.0-ff9a00?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-%5E3.0-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
[![React 18](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)

## ✨ Features

- **Beautiful gradient UI** inspired by modern mobile design
- **Vite + React 18** with lightning-fast HMR
- **Zustand Persist** for state management
- Utility-first **Tailwind CSS**
- Multi-language ready via **i18n**
- Strict **TypeScript** everywhere
- Custom CSS **animations** (`fade-in`, `slide-up`, `bounce`, `spin`)
- Unit & integration tests with **Jest + RTL**
- Dark-mode-ready tokens
- PWA-friendly setup
- Zero-config SVG & Rive asset support

## 🚀 Quick Start

```bash
# 1. Install deps
pnpm i  # or npm i / yarn

# 2. Run dev server  📲
pnpm dev

# 3. Build for prod
pnpm build && pnpm preview

# 4. Tests
pnpm test
```

> **Environment** – all `.env.*` variables are auto-imported via Vite (see `import.meta.env`).

## 🗂️ Project Structure

```
task-app/
├─ public/
├─ src/
│ ├─ assets/ # svg, rive, lottie, etc.
│ ├─ atoms/ # atomic UI primitives
│ ├─ molecules/ # small composed components
│ ├─ organisms/ # large feature blocks
│ ├─ templates/ # page layouts
│ ├─ pages/ # route entry points
│ ├─ routes.tsx # react-router config
│ ├─ store/ # zustand stores
│ ├─ i18n/ # translations
│ ├─ App.tsx # root component
│ ├─ main.tsx # vite entry
│ └─ index.css # Tailwind base + custom keyframes
├─ tailwind.config.ts
├─ vitest.config.ts
└─ README.md
```

## 📚 Documentation

A full set of living docs lives in the **`/documentation`** folder at project root:

| File                                                                                 | What it answers                            |
| ------------------------------------------------------------------------------------ | ------------------------------------------ |
| [`project_requirements_document.md`](documentation/project_requirements_document.md) | "What exactly are we building and why?"    |
| [`app_flow_document.md`](documentation/app_flow_document.md)                         | Step-by-step UX journey with edge-cases    |
| [`app_flowchart.md`](documentation/app_flowchart.md)                                 | Mermaid diagram of screen & data flow      |
| [`frontend_guidelines_document.md`](documentation/frontend_guidelines_document.md)   | Coding conventions, atomic rules, a11y     |
| [`tech_stack_document.md`](documentation/tech_stack_document.md)                     | Plain-language explanation of every tech   |
| [`implementation_plan.md`](documentation/implementation_plan.md)                     | Phase-by-phase checklist (setup → CI/CD)   |
| [`security_guideline_document.md`](documentation/security_guideline_document.md)     | Input sanitising, quota handling, SW notes |

> **Tip:** For a browsable doc site, run:
>
> ```bash
> cd documentation && mdbook serve
> ```
>
> (optional — `mdbook` not bundled)

## 🖌️ Styling & Animations

Tailwind core layers are injected via **`@tailwind base; components; utilities;`** in `index.css`.

### Custom Keyframes

| Class                  | Keyframe    | Purpose                  |
| ---------------------- | ----------- | ------------------------ |
| `.animate-fade-in`     | `fadeIn`    | Smooth page / card entry |
| `.animate-slide-up`    | `slideUp`   | Modal & sheet entrance   |
| `.animate-slide-down`  | `slideDown` | Dropdown / toast         |
| `.animate-bounce-once` | `bounce`    | FAB tap feedback         |
| `.animate-spin`        | `spin`      | Loaders / spinners       |

### Scrollbars

```css
.scrollbar-hide {
  @apply overflow-y-auto;
} /*  no ugly scrollbars  */
```

## 🛠️ Tech Stack

| Layer      | Library                           | Why                                       |
| ---------- | --------------------------------- | ----------------------------------------- |
| Build      | **Vite**                          | Insanely fast dev & optimized prod output |
| UI         | **React 18**                      | Concurrent features & ecosystem           |
| Styling    | **Tailwind CSS 3**                | Rapid utility-first workflow              |
| State      | **Zustand + Persist**             | Tiny, boilerplate-free global state       |
| Tests      | **Jest + @testing-library/react** | Focus on behaviour, not implementation    |
| i18n       | **react-i18next**                 | Simple multi-language support             |
| Animations | **CSS keyframes + Rive**          | High-performance, designer-friendly       |

## 🔒 Tests

- **`setupTests.ts`** mocks Zustand & i18n for deterministic snapshots
- Each page and store has dedicated unit specs under `__tests__/`

Run all specs:

```bash
pnpm test
```

## 📸 Screenshots

![Welcome Screen](docs/screens/welcome.png)
![Dashboard](docs/screens/dashboard.png)
![Calendar](docs/screens/calendar.png)
![Add Project](docs/screens/add-project.png)

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feat/amazing-thing`)
3. Commit using **conventional-commits** style
4. Open a PR

All discussions & RFCs in **GitHub Issues**.

## 📄 License

Released under the **MIT** License — see the [LICENSE](LICENSE) file for details.

---

> Made with ♥ and plenty of caffeine by Danton.
