# Frontend Application

This folder contains the web client for the document translation system.

The frontend is built with **Next.js** and provides the user-facing interface for authentication, application navigation, document translation workflows, and interaction with backend services through APIs.

---

## Responsibilities

The frontend provides the user interface for:

- User authentication and session management
- Application navigation
- Uploading and managing translation tasks
- Displaying translation workflow status
- Communicating with backend APIs

The application is designed to provide a simple and responsive experience while keeping the UI layer separated from backend processing logic.

---

## Main Technologies

### Framework and Language

- **Next.js** — React framework for server-side rendering and application routing
- **React 19** — UI component development
- **TypeScript** — type-safe application development

### Styling and UI

- **Tailwind CSS** — utility-first styling framework

### Authentication

- **NextAuth** — authentication and session management

### Code Quality

- **ESLint** — code quality and consistency checks

---

## Project Structure

```
app/
├── api/
│   └── auth/                # NextAuth authentication API routes
│
├── home/                    # Main application interface
│
├── login/                   # User login page
│
├── layout.tsx               # Global application layout
└── page.tsx                 # Application entry page

components/                 # Reusable UI components

public/                     # Static assets

types/                      # Shared TypeScript type definitions
```

## Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the application for production:

```bash
npm run build
```

Run the production build:

```bash
npm start
```

---

## Environment Variables

The frontend requires environment configuration for API communication and authentication.

Example:

```env
NEXT_PUBLIC_API_URL=

NEXTAUTH_URL=
NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

---

## Architecture Overview

The frontend follows a component-based architecture:

- **App Router** manages application routes and layouts.
- **Components** contain reusable UI elements.
- **Types** define shared TypeScript contracts.
- **NextAuth** manages authentication and user sessions.
- **API integration** connects the frontend with backend services.

This structure keeps the frontend maintainable, scalable, and ready for future features such as document history, user dashboards, and additional translation workflows.
