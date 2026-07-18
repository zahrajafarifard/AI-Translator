# AI Document Translator

A full-stack AI-powered document translation application that converts **PDF**, **DOCX**, and **TXT** files into Persian using a local AI translation model.

This monorepo contains a backend API and a frontend web application. The backend manages document processing, authentication, database operations, and background translation jobs, while the frontend provides the user interface for interacting with the system.

---

## Project Overview

The application uses a modular architecture with:

- Backend API for document management and translation workflows
- Background workers for asynchronous processing
- Local AI model integration through Ollama
- Frontend interface for user interaction
- Email notifications that send a download link to the user when translation processing is completed

---

## Main Technologies

### Backend

- Node.js + TypeScript
- Express.js
- Sequelize + MySQL
- BullMQ + Redis
- JWT Authentication
- PDF, DOCX, and TXT processing libraries
- Ollama for local AI translation
- Nodemailer for sending translation-complete emails with download links

### Frontend

- Next.js
- React 19
- TypeScript
- Tailwind CSS
- NextAuth

---

## Repository Structure

```
AI-Document-Translator/

├── back-end/        # Backend API, processing logic, database, and workers
│
└── front-end/       # Next.js frontend application
```

Detailed documentation:

- [`back-end/README.md`](./back-end/README.md)
- [`front-end/README.md`](./front-end/README.md)

---

## Prerequisites

Required services:

- Node.js
- MySQL
- Ollama with a local translation model
- Redis running through Docker

Example:

```bash
docker run -d -p 6379:6379 redis
```

---

## Quick Start

Clone the repository:

```bash
git clone https://github.com/zahrajafarifard/AI-Translator
cd AI-Document-Translator
```

---

## Architecture

```
              Frontend
             (Next.js)
                  |
                  |
              REST API
                  |
                  |
            Backend API
           (Express.js)
                  |
      ┌───────────┴───────────┐
      |                       |
   MySQL DB           Redis + BullMQ
                              |
                           Worker
                              |
                           Ollama
                        Local AI Model
```

## Notes

The translation system runs completely with a local AI model through Ollama. Redis is used for background job processing and runs as a Docker container.

When a translation job completes, the backend sends the user an email through Nodemailer containing a secure download link for the translated document.
