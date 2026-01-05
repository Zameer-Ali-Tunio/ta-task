# Quick Setup Guide

## Installation Steps

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env file with your API key (already set by default)
npm install
npm run start:dev
```

Backend will run on: `http://localhost:3000`

### 2. Frontend Setup

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

Frontend will run on: `http://localhost:4200`

