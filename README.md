# Echo

**AI Career Agent & Personal Professional Assistant**

Echo is an AI-powered career management platform that transforms the traditional resume experience into an intelligent, conversational assistant. Job seekers interact through natural language, receive context-aware career assistance, and generate recruiter-ready profiles that can be shared with hiring professionals.

## 🎯 Product Vision

Echo provides professionals with a personal AI agent that encapsulates their entire career history. Users can upload CVs or provide conversational updates, generating public links with customizable context and tone. Recruiters can query the agent in natural language, receiving precise, role- or company-specific answers.

### Core Value Proposition

- **🤖 AI Career Agent**: Intelligent assistant that understands your professional journey
- **👤 Personal Professional Assistant**: Context-aware guidance tailored to your career goals
- **📋 Recruiter-Ready Profiles**: Optimized output designed for hiring professionals
- **💬 Natural Interaction**: Conversational interface replaces tedious form-filling
- **🔒 Privacy Control**: Full control over what is shared

## ✨ Features

### Frontend

- **📤 CV Upload & Smart Parsing**: Upload PDFs with real-time feedback and intelligent extraction
- **✏️ Interactive Profile Editor**: Edit and view your recruiter-ready profile
- **💬 Natural Language Q&A**: Chat interface powered by AI to refine your professional narrative
- **🔗 Shareable Profile Links**: Generate unique URLs to share with recruiters
- **♿ Accessibility Focus**: WCAG-compliant design with keyboard navigation

### Backend

- **📚 Knowledge Base**: Upload CVs and documents to build your agent's knowledge
- **🎭 Contextual Adaptation**: Generate public links with customizable context and personalities
- **❓ Recruiter Q&A**: Natural-language Q&A interface for recruiters
- **📊 Professional Presentation**: Ensures accurate and consistent representation

## 🛠 Tech Stack

### Frontend (`apps/frontend`)

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State Management | TanStack Query |
| Routing | React Router |

### Backend (`apps/backend`)

| Category | Technology |
|----------|------------|
| Runtime | Node.js + TypeScript |
| Framework | Express 5 |
| Architecture | Hexagonal (Ports & Adapters) |
| AI / LLMs | Gemini, LangChain |
| Vector Store | Supabase (pgvector) |
| Document Store | MongoDB Atlas |
| Authentication | Supabase Auth |
| DI Container | TypeDI |
| API Docs | Scalar + OpenAPI 3.1 |
| Testing | Jest |

## 📁 Project Structure

```
echo/
├── apps/
│   ├── frontend/          # React + Vite frontend application
│   │   └── src/
│   │       ├── agents/    # Agent-related features
│   │       ├── auth/      # Authentication
│   │       ├── chat/      # Chat interface
│   │       ├── profile/   # Profile management
│   │       └── shared/    # Shared utilities & components
│   │
│   └── backend/           # Express API server
│       └── src/
│           ├── adapters/  # Inbound/Outbound adapters
│           ├── domain/    # Business logic & entities
│           ├── application/ # Use cases
│           └── infrastructure/ # Config & setup
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

| Endpoint | Description |
|----------|-------------|
| `http://localhost:3000/docs` | Interactive API docs (Scalar) |
| `http://localhost:3000/openapi.json` | OpenAPI specification |
| `http://localhost:3000/health` | Health check |

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

### Phase 1: MVP (Current)
- ✅ Core architecture setup (Hexagonal backend, React frontend)
- ✅ Authentication (Supabase)
- ✅ Document ingestion (PDF upload)
- ✅ Vector store integration
- ⏳ RAG Pipeline implementation
- ⏳ Contextual chat endpoint

### Phase 2: Enhanced Features
- ⏳ Chat interface with AI-powered Q&A
- ⏳ Shareable profile link generation
- ⏳ Profile customization options
- ⏳ Real-time parsing feedback

### Phase 3: Optimization
- ⏳ Performance optimization
- ⏳ WCAG 2.1 AA compliance
- ⏳ Mobile-responsive design
- ⏳ PWA features

### Phase 4: Production Ready
- ⏳ Comprehensive testing suite
- ⏳ Error tracking & analytics
- ⏳ Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
