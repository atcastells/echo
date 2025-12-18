# Echo

**Personal AI Professional Growth Agent**

Echo is an AI-powered professional growth assistant that helps users develop their careers through continuous, context-aware conversation. Unlike generic chat assistants, Echo maintains continuity across conversations, understands your professional context, and adapts to your current goals.

## 🎯 Product Vision

Echo transforms career development from form-filling and document management into an intelligent, ongoing dialogue. The experience is **conversation-first**: users can start interacting immediately without onboarding flows or mandatory profile setup.

### Core Question

> **"What should I do next to move forward professionally — given who I am and what I'm trying to achieve right now?"**

### Core Value Proposition

- **🎯 Intent-First**: Prioritizes what you're trying to achieve over collecting profile data
- **🔄 Continuous Context**: Maintains understanding across conversations over time
- **💬 Conversation as Interface**: All interaction happens naturally through dialogue
- **📈 Goal-Aware Guidance**: Adapts advice based on your current professional objectives
- **🔒 Progressive Privacy**: You control what to share, when to share it

## 🧠 Design Principles

### 1. Intent Before Identity

The agent prioritizes **what you're trying to achieve** over who you are. Profile data is optional, incremental, and only requested when it improves the response.

### 2. Progressive Context, Not Forms

User context is built **over time** through conversation — no upfront data entry, no required profile completeness. Past information is treated as evidence, not absolute truth.

### 3. Streaming-First UX

All responses stream token-by-token, enabling fast feedback and a "thinking-with-you" experience. Users can abort, retry, and recover gracefully.

## ✨ Features

### Conversation & Agent

- **🤖 Personal AI Agent**: Each user has a default agent that learns their context
- **💬 Real-Time Streaming**: Token-by-token response streaming via SSE
- **🎯 Goal Tracking**: Explicit tracking of your current professional intent
- **🔄 Conversation History**: Persistent conversations you can continue anytime
- **⚡ Abort & Recover**: Stop responses mid-stream, retry on errors

### Knowledge & Context

- **📚 Document Upload**: Add CVs and career documents to build agent knowledge
- **🔍 RAG Pipeline**: Semantic retrieval for relevant context injection
- **📊 Profile Building**: Incremental, confidence-scored professional facts
- **🧠 Memory**: Long-term understanding that grows with you

## 🛠 Tech Stack

### Frontend (`apps/frontend`)

| Category         | Technology            |
| ---------------- | --------------------- |
| Framework        | React 19 + TypeScript |
| Build Tool       | Vite                  |
| Styling          | Tailwind CSS          |
| State Management | TanStack Query        |
| Routing          | React Router          |
| Architecture     | Screaming Architecture (domain-first) |

### Backend (`apps/backend`)

| Category       | Technology                   |
| -------------- | ---------------------------- |
| Runtime        | Node.js + TypeScript         |
| Framework      | Express 5                    |
| Architecture   | Hexagonal (Ports & Adapters) |
| AI / LLMs      | Gemini, LangChain            |
| Vector Store   | Supabase (pgvector)          |
| Document Store | MongoDB Atlas                |
| Authentication | Supabase Auth                |
| DI Container   | TypeDI                       |
| Streaming      | Server-Sent Events (SSE)     |
| API Docs       | Scalar + OpenAPI 3.1         |
| Testing        | Jest                         |

### Component Library (`apps/storybook`)

| Category   | Technology     |
| ---------- | -------------- |
| Framework  | Storybook 10   |
| Components | Atomic Design  |
| Styling    | Tailwind CSS   |

## 📁 Project Structure

```
echo/
├── .tasks/                # Development task board & roadmap
├── apps/
│   ├── frontend/          # React + Vite frontend application
│   │   └── src/
│   │       ├── agents/    # Agent management
│   │       ├── auth/      # Authentication
│   │       ├── chat/      # Conversation interface
│   │       └── shared/    # Shared utilities & components
│   │
│   ├── backend/           # Express API server
│   │   └── src/
│   │       ├── adapters/  # Inbound (controllers) / Outbound (services)
│   │       ├── domain/    # Business logic & entities
│   │       ├── application/ # Use cases (agents, chat, documents)
│   │       └── infrastructure/ # Config, streaming, telemetry
│   │
│   └── storybook/         # Component library & documentation
│       └── src/
│           ├── atoms/     # Button, Badge, Spinner, etc.
│           ├── molecules/ # MessageBubble, ThinkingIndicator, etc.
│           └── organisms/ # Composer, MessageList, ConversationHeader
│
├── package.json           # Root workspace config
├── pnpm-workspace.yaml    # pnpm workspace definition
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (recommended: Node.js 20 LTS)
- pnpm 9.0+

### Installation

```bash
# Install all dependencies
pnpm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your credentials

# Start all services in development mode
pnpm dev

# Or start individually
pnpm dev:back   # Backend only (http://localhost:3000)
pnpm dev:front  # Frontend only (http://localhost:5173)
```

### Build

```bash
# Build all packages
pnpm build

# Build individually
pnpm build:back
pnpm build:front
```

### Testing

```bash
# Run all tests
pnpm test

# Run backend tests
pnpm test:back
```

### Linting

```bash
# Lint all packages
pnpm lint

# Fix lint issues
pnpm lint:fix
```

## 📚 API Documentation

Once the backend is running, access the API documentation:

| Endpoint                             | Description                   |
| ------------------------------------ | ----------------------------- |
| `http://localhost:3000/docs`         | Interactive API docs (Scalar) |
| `http://localhost:3000/openapi.json` | OpenAPI specification         |
| `http://localhost:3000/health`       | Health check                  |

## 🔐 Environment Variables

### Backend (`apps/backend/.env`)

```env
# MongoDB
MONGO_URI=mongodb+srv://...

# Google AI
GEMINI_API_KEY=your-gemini-api-key

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-jwt-secret
```

### Frontend (`apps/frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
```

## 🗺 Roadmap

See [.tasks/](.tasks/) for the detailed task board.

### Current Focus: Core Agent Experience

- ✅ Hexagonal architecture (backend)
- ✅ Screaming architecture (frontend)
- ✅ Authentication (Supabase)
- ✅ Agent CRUD & default agent
- ✅ Conversation persistence
- ✅ SSE streaming foundation
- ✅ Document upload
- 🚧 RAG pipeline completion
- 🚧 Goal/intent tracking
- 🚧 Streaming reliability & abort

### Next: Context & Intelligence

- ⏳ Progressive profile building
- ⏳ Goal-aware agent responses
- ⏳ Multi-conversation management
- ⏳ Context window optimization

### Future: Polish & Scale

- ⏳ WCAG 2.1 AA compliance
- ⏳ Performance optimization
- ⏳ Comprehensive test coverage
- ⏳ Production observability

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
