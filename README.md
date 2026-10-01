# Gemini DataLab for Excel

> **Complete AI-Powered Data Science, Analytics & Machine Learning Studio integrated with Microsoft Excel.**

Gemini DataLab for Excel enables business analysts, data scientists, and engineers to perform full end-to-end data science workflows (profiling, cleaning, feature transformation, statistics, hypothesis testing, interactive visualization, and machine learning) natively inside Microsoft Excel and as a standalone web application—**without requiring Python**.

---

## Architecture Overview

Gemini DataLab is organized as a modular TypeScript monorepo managed with **pnpm workspaces**:

```text
excel/
├── apps/
│   ├── api/             # Express.js REST API, Pino logging, Zod validation, JWT, Mongoose, Redis
│   ├── web/             # Standalone React 18 + Vite analytics studio (18 studio modules)
│   └── excel-addin/     # Native Microsoft Excel task pane add-in (Office.js v1.1, basicSsl)
├── packages/
│   ├── shared-types/    # Shared TypeScript contracts (Dataset, Statistics, Excel, AI, Health)
│   └── validation/      # Runtime Zod validation schemas (Env, Auth, Datasets, Stats, Excel)
├── infrastructure/      # Docker compose definitions for MongoDB 7.0 and Redis 7.2
├── docs/                # Architecture specifications, ADRs, and module guides
├── .github/workflows/   # CI pipeline (Lint, Typecheck, Test, Build)
├── docker-compose.yml   # Multi-service dev container definitions
└── package.json         # Workspace orchestration scripts
```

---

## Core Principles

1. **No Python Dependency**: 100% written in modern TypeScript / JavaScript, utilizing native high-performance computation engines (DuckDB-Wasm, Arquero, Arrow, simple-statistics, ml-matrix, TensorFlow.js).
2. **Deterministic Computation**: Calculations are executed by deterministic math/statistics engines, **never** hallucinated by LLMs.
3. **AI Separation of Concerns**: Google Gemini (`@google/genai`) is responsible for natural language intent parsing, workflow planning, and human-readable insights.
4. **Non-Destructive Excel Operations**: Workbook write operations require explicit user approval and visual preview.

---

## Prerequisites

- **Node.js**: v20+ (v22.x LTS recommended)
- **pnpm**: v9+ (v10.x recommended)
- **Docker & Docker Compose** (Optional, for running MongoDB & Redis locally)

---

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

### 3. Start Database & Redis (Docker)

```bash
pnpm infra:up
```

### 4. Development Servers

To start all services in parallel:

```bash
pnpm dev
```

Or run individual components:

- **API Server** (`http://localhost:4000/api/v1`):
  ```bash
  pnpm dev:api
  ```
- **Standalone Web Studio** (`http://localhost:3000`):
  ```bash
  pnpm dev:web
  ```
- **Excel Task Pane** (`https://localhost:3001`):
  ```bash
  pnpm dev:excel
  ```

---

## Testing & Quality

- **Run Automated Tests**:
  ```bash
  pnpm test
  ```
- **Type Checking**:
  ```bash
  pnpm typecheck
  ```
- **Build All Workspaces**:
  ```bash
  pnpm build
  ```

---

## License

Proprietary — All rights reserved.
