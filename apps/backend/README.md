# Echo Backend API

Personal AI Professional Growth Agent — Backend Service

## 📖 Description

The Echo backend provides the AI agent infrastructure, conversation management, and knowledge retrieval services. It implements a hexagonal architecture that separates business logic from external concerns, enabling flexible integration with LLMs, databases, and authentication providers.

## ✨ Features

- **🤖 Agent System**: Configurable AI agents with LangChain integration
- **💬 Streaming Chat**: Real-time responses via Server-Sent Events (SSE)
- **📚 Knowledge Base**: Upload documents to build agent context (RAG)
- **🎯 Goal Tracking**: Track user's active professional intent
- **🔐 Authentication**: Supabase Auth integration
- **📊 Context Management**: Profile and conversation persistence

## 🛠 Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5
- **Architecture**: Hexagonal (Ports & Adapters)
- **AI / LLMs**: Gemini, LangChain
- **Vector Store**: Supabase (pgvector)
- **Document Store**: MongoDB Atlas
- **Authentication**: Supabase Auth
- **DI Container**: TypeDI
- **Streaming**: Server-Sent Events (SSE)
- **API Docs**: Scalar + OpenAPI 3.1
- **Testing**: Jest

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Start development server
pnpm run dev
```

Server runs at `http://localhost:3000`

## 📚 API Documentation

| Endpoint        | Description                   |
| --------------- | ----------------------------- |
| `/docs`         | Interactive API docs (Scalar) |
| `/openapi.json` | OpenAPI specification         |
| `/health`       | Health check                  |

## 📡 Key Endpoints

### Agents

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | `/api/v1/agents`        | List user's agents         |
| GET    | `/api/v1/agents/default`| Get default agent          |
| POST   | `/api/v1/agents`        | Create new agent           |

### Chat & Conversations

| Method | Endpoint                          | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| POST   | `/api/v1/conversations`           | Create conversation            |
| GET    | `/api/v1/conversations`           | List conversations             |
| POST   | `/api/v1/chat/stream`             | Stream chat response (SSE)     |
| POST   | `/api/v1/chat/interrupt`          | Abort streaming response       |
| DELETE | `/api/v1/conversations/:id/clear` | Clear conversation messages    |

### Documents

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | `/api/v1/ingest`   | Upload and vectorize documents |
| GET    | `/api/v1/context`  | View agent's knowledge         |

_(See `/docs` for the full OpenAPI specification)_

## 📁 Project Structure

```
src/
├── adapters/
│   ├── inbound/        # API Controllers (Express routes)
│   └── outbound/       # External services (Supabase, Gemini, MongoDB)
├── domain/
│   ├── entities/       # Core business entities
│   ├── ports/          # Interface definitions
│   └── services/       # Domain services
├── application/
│   ├── agents/         # Agent use cases
│   ├── chat/           # Chat & conversation use cases
│   ├── documents/      # Document ingestion use cases
│   └── profile/        # Profile management use cases
└── infrastructure/
    ├── config.ts       # Environment configuration
    ├── server.ts       # Express server setup
    ├── telemetry.ts    # Logging & observability
    └── langchain/      # LangChain adapter
```

## 🗺 Implementation Status

- [x] Express server & hexagonal architecture
- [x] Authentication (Supabase)
- [x] Agent CRUD & default agent
- [x] Conversation management
- [x] SSE streaming foundation
- [x] Document upload
- [x] Vector store integration (Supabase pgvector)
- [ ] RAG pipeline completion
- [ ] Goal/intent entity & tracking
- [ ] Streaming reliability & reconnection
- [ ] Profile progressive building

## 🔐 Environment Variables

See `.env.example` for required variables:

- `MONGO_URI` - MongoDB Atlas connection string
- `GEMINI_API_KEY` - Google Gemini API key
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service key
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 3000)

## 📄 License

MIT
