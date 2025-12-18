# Echo Frontend

Personal AI Professional Growth Agent — Frontend Application

## 📖 Description

The Echo frontend is a React application that provides the conversational interface for interacting with your personal AI career agent. Built with a conversation-first philosophy, it enables immediate, streaming interactions without onboarding flows or mandatory setup.

## 🎯 Product Philosophy

- **Conversation is the Interface**: All interaction happens through natural dialogue
- **Intent Before Identity**: Focus on what you're trying to achieve, not profile completeness
- **Streaming-First UX**: Token-by-token responses for fast feedback loops
- **Progressive Context**: Build your professional profile through conversation over time

## ✨ Features

- **💬 Real-Time Chat**: Streaming responses with abort/retry capabilities
- **🔄 Conversation History**: Persistent conversations you can continue anytime
- **📤 Document Upload**: Add career documents to enhance agent context
- **⚡ Optimistic UI**: Immediate feedback with graceful error handling
- **♿ Accessibility**: WCAG-compliant design with keyboard navigation

## 🛠 Tech Stack

| Category         | Technology                  |
| ---------------- | --------------------------- |
| Framework        | React 19 + TypeScript       |
| Build Tool       | Vite                        |
| Styling          | Tailwind CSS                |
| State Management | TanStack Query + XState     |
| Routing          | React Router v7             |
| Architecture     | Screaming Architecture      |

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Start development server
pnpm dev
```

App runs at `http://localhost:5173`

## 📁 Project Structure

This project follows **Screaming Architecture** — folders represent business domains, not technical concerns.

```
src/
├── agents/              # 🤖 Agent management
│   ├── api/             # Agent API calls
│   ├── hooks/           # useAgent, useAgents
│   └── types/           # Agent types
│
├── auth/                # 🔐 Authentication
│   ├── api/             # Auth API calls
│   ├── components/      # LoginForm, SignupForm
│   ├── context/         # AuthProvider
│   ├── hooks/           # useAuth, useCurrentUser
│   └── types/           # Auth types
│
├── chat/                # 💬 Conversation interface
│   ├── api/             # Chat streaming API
│   ├── hooks/           # useChat, useConversation
│   ├── machines/        # XState chat machine
│   └── types/           # Message, Conversation types
│
├── shared/              # 🔧 Shared utilities
│   ├── api/             # API client, error handling
│   ├── errors/          # Error types and boundaries
│   ├── types/           # Common types
│   ├── ui/              # Shared UI components
│   └── utils/           # Helper functions
│
└── app/                 # 🏠 App shell
    ├── App.tsx          # Root component
    ├── Router.tsx       # Route definitions
    ├── pages/           # Page components
    └── providers/       # Context providers
```

### Why Screaming Architecture?

1. **Domain-First**: Top-level folders represent business capabilities
2. **Feature Isolation**: Each feature is self-contained
3. **Discoverability**: New developers understand the app from folder structure
4. **Scalability**: Features can evolve independently

## 🗺 Implementation Status

- [x] Core React + TypeScript + Vite setup
- [x] Screaming architecture structure
- [x] Authentication (Supabase)
- [x] Chat state machine (XState)
- [x] Streaming integration (SSE)
- [ ] Full conversation UI integration
- [ ] Goal/intent capture flow
- [ ] Profile view
- [ ] Document upload UI

## 🔐 Environment Variables

```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🧪 Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint

# Fix lint issues
pnpm lint:fix
```

## 📄 License

MIT
