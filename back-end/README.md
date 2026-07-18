# Backend Service

This backend powers the document translation workflow for the application. It handles Google-based authentication, document upload, translation job creation, background processing, email notifications, and secure download links for translated files.

---

## What the backend does

The service currently provides:

- User authentication via Google login
- File upload for PDF, DOCX, and TXT documents
- Translation job submission to a Redis-backed queue
- Asynchronous document processing through a BullMQ worker
- Email notifications when a translation is ready
- Download access through a temporary token-based endpoint
- Health check support for monitoring

---

## Main technologies

### Runtime and framework

- Node.js
- TypeScript
- Express.js

### Data and persistence

- MySQL
- Sequelize

### Background jobs and caching

- Redis
- BullMQ
- ioredis

### Document processing and AI

- pdfjs-dist for PDF text extraction
- pdfkit for PDF generation
- mammoth for DOCX reading
- docx for DOCX generation
- Ollama for local LLM-based translation

### Security and utilities

- JWT for authentication
- Helmet for security headers
- CORS for frontend access
- Multer for file uploads
- Nodemailer for email delivery

---

## API overview

### Authentication

- POST /api/auth/google
  - Authenticates a user using Google identity data and returns a JWT

### Documents

- POST /api/documents/translate
  - Authenticates the user, accepts a document upload, and queues it for translation

### Downloads

- GET /api/download/:token
  - Returns the translated document when the token is valid

### Health check

- GET /health
  - Verifies that the API service is running

---

## Project structure

```text
src/
├── index.ts                   # Express app entry point
├── api/
│   ├── controllers/           # Request handlers
│   ├── routes/                # API routes
│   └── services/              # API-level services
├── application/
│   └── services/              # Translation workflow orchestration
├── config/                    # Database, Redis, multer, and Ollama config
├── infrastructure/
│   ├── docx/                  # DOCX layout translation logic
│   ├── email/                 # Email notifications
│   ├── llm/                   # Ollama translation integration
│   ├── readers/               # PDF/DOCX/TXT readers
│   └── writers/               # PDF/DOCX writers
├── middleware/                # Auth middleware
├── models/                    # Sequelize models and relationships
├── workers/                   # Background translation worker
└── utils/                     # Helper utilities
```

---

## Development setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a .env file in the backend folder with the following variables:

```env
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

JWT_SECRET=

REDIS_HOST=
REDIS_PORT=

OLLAMA_ENDPOINT=
OLLAMA_MODEL=

FRONTEND_URL=
APP_URL=

EMAIL=
EMAIL_PASSWORD=
```

### 3. Run the API server

```bash
npm run dev
```

### 4. Run the worker for background translation jobs

```bash
npm run worker
```

### 5. Build for production

```bash
npm run build
```

## Notes

- Supported upload types are PDF, DOCX, and TXT.
- Maximum upload size is 40 MB.
- The current setup is designed to work with a local Ollama instance and a local Redis instance.
- The worker process should be running whenever translation jobs need to be processed.
