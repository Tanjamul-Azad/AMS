# StewardCare AMS

StewardCare AMS is a frontend prototype for an Antimicrobial Stewardship clinical decision support dashboard. It helps clinicians review patient antimicrobial therapy, inspect recommendations, manage alerts, track review queues, and generate stewardship reports from one workspace.

## Features

- Login landing screen with role selection
- Clinical dashboard with patient queue, review activity, and report summaries
- Patient search, filtering, and patient detail pages
- Treatment recommendation detail workflow
- Review queue and escalation review workflow
- Alerts center with patient case actions and resolved state
- Reports preview with export, print, and share demo actions
- Settings, profile menu, help center, and logout flow
- Responsive mobile navigation

## Tech Stack

- React
- Vite
- Tailwind CSS
- Lucide React icons

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal. If port `5173` is already in use, Vite may choose another port.

## Available Scripts

```bash
npm run dev
```

Runs the app in development mode.

```bash
npm run build
```

Builds the production-ready frontend into `dist/`.

```bash
npm run preview
```

Serves the production build locally for review.

## Project Structure

```text
src/
  App.jsx       Main application, routes, pages, and UI components
  data.js       Demo clinical data
  main.jsx      React entry point
  styles.css    Tailwind import and global styles
```

## Notes

This is a frontend-only prototype. Authentication, clinical data persistence, and report generation are represented as in-browser demo interactions and should be connected to secure backend services before production use.
