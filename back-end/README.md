# Backend Service

This folder contains the backend API for the document translation application.

The backend is responsible for handling file uploads, managing document metadata, authenticating users, creating and processing translation jobs, and executing the document translation pipeline using local AI models.

---

## Responsibilities

The backend provides APIs for:

- User authentication and authorization
- Document upload and metadata management
- Translation job creation and tracking
- Document processing workflows
- Health checks and service monitoring

It also runs a background worker that processes translation jobs asynchronously, keeping long-running translation tasks separate from the main API request lifecycle.

---

## Main Technologies

### Runtime and Framework

- **Node.js**
- **TypeScript**
- **Express.js**

### Database and ORM

- **MySQL** — persistent data storage
- **Sequelize** — database ORM and model management

### Background Processing

- **BullMQ** — distributed job queue management
- **Redis** — queue storage and job coordination

### Document Processing

The backend supports reading, translating, and generating multiple document formats.

Libraries used:

- **pdfjs-dist** — PDF text extraction
- **pdfkit** — PDF generation
- **mammoth** — DOCX content extraction
- **docx** — DOCX document generation
- **jszip** — DOCX package manipulation

### Authentication and Security

Security and API protection are implemented using:

- **JWT** — user authentication and authorization
- **Helmet** — HTTP security headers
- **CORS** — cross-origin request management
- **Morgan** — HTTP request logging

### AI Translation Engine

The translation pipeline integrates with **Ollama**, allowing the application to run local large language models (LLMs) for document translation without relying on external AI APIs.

---

## Project Structure

```
src/
├── index.ts                 # Application entry point
│
├── api/                     # API layer
│   ├── controllers/         # Request handlers
│   ├── routes/              # API route definitions
│   └── services/            # Business logic for API operations
│
├── application/             # Application-level services
│   └── translation pipeline and business workflows
│
├── config/                  # Environment and infrastructure configuration
│
├── infrastructure/          # External integrations
│   ├── document readers
│   ├── document writers
│   └── Ollama LLM services
│
├── models/                  # Sequelize database models and relationships
│
└── workers/                 # Background workers for queued jobs
```

## Development

Install dependencies:

```bash
npm install
```

Run the API server:

```bash
npm run dev
```

Run the background worker:

```bash
npm run worker
```

Build for production:

```bash
npm run build
```

---

## Environment Variables

Create an environment configuration file and provide the required values:

```env
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

JWT_SECRET=

OLLAMA_ENDPOINT=
OLLAMA_MODEL=

FRONTEND_URL=
```

---

## Architecture Overview

The backend follows a layered architecture:

- **API Layer** handles HTTP requests and responses.
- **Application Layer** contains business workflows and use cases.
- **Infrastructure Layer** manages external dependencies such as databases, document processing, and AI services.
- **Worker Layer** handles asynchronous background processing.

This separation keeps the system modular, testable, and easier to extend with additional document formats or translation models.
