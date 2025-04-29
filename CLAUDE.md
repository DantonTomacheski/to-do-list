# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Testing Commands
- `npm run dev` - Start dev server
- `npm run build` - Compile TypeScript and build with Vite 
- `npm run lint` - Run ESLint on codebase
- `npm run preview` - Preview built application
- `npm test` - Run all tests
- `npm test -- -t "test name"` - Run specific test

## Code Style Guidelines
- **Architecture**: Follow Atomic Design (atoms → molecules → organisms → templates → pages)
- **TypeScript**: Strict mode with noImplicitAny and strictNullChecks
- **Components**: React 18 functional components with hooks
- **State**: Zustand with persist middleware for localStorage
- **Styling**: Tailwind CSS with custom theme (purple: #5B3FFF, pink: #EC4899, orange: #F97316)
- **Imports**: Group by external, then internal (components, utils, types)
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Routing**: React Router 6 with file-based routes in `src/routes/`
- **Error Handling**: Graceful fallbacks, especially for localStorage overflow
- **Images**: Compress with browser-image-compression (≤200KB)
- **i18n**: Support pt-BR (default) and en-US using i18next