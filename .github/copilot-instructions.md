# GitHub Copilot Instructions for Echo

> **AI Career Agent** - Full-stack pnpm monorepo with RAG-powered chat for recruiters.

## Quick Reference

```bash
pnpm dev              # Start all (backend :3000, frontend :5173)
pnpm dev:back         # Backend only
pnpm dev:front        # Frontend only
pnpm test             # Run all tests
pnpm lint && pnpm build  # Pre-commit checks
```

---

## Architecture Overview

### Backend (`apps/backend`) - Hexagonal Architecture

```
src/
├── adapters/inbound/http/     # Controllers, routes, middlewares
├── adapters/outbound/         # Repositories, external services (Supabase, Gemini, MongoDB)
├── application/               # Use cases (one per file: *.use-case.ts)
├── domain/                    # Entities, ports (interfaces)
└── infrastructure/            # Config, DI constants, server setup
```

**Data Flow**: Controller → Use Case → Repository (via port interface) → External Service

### Frontend (`apps/frontend`) - Screaming Architecture

```
src/
├── auth/      # Feature: Authentication (components/, hooks/, api/, types/)
├── agents/    # Feature: Agent management
├── chat/      # Feature: Chat interface
├── profile/   # Feature: Profile management
├── shared/    # Shared utilities, UI components (NO business logic)
└── app/       # App shell, routing, providers
```

**Import Rule**: Features import from `@/shared` or other features' `index.ts` barrel exports only.

---

## Critical Patterns

### Backend: Dependency Injection (TypeDI)

```typescript
// Use cases get repositories via Container.get() with string constants
@Service()
export class ListDocumentsUseCase {
  private readonly documentRepository: DocumentRepository =
    Container.get(DOCUMENT_REPOSITORY); // from infrastructure/constants.ts
}

// Controllers get use cases directly via Container.get()
export class MyController {
  private readonly myUseCase = Container.get(MyUseCase);
}
```

### Backend: Authentication Pattern

```typescript
const user = (request as AuthenticatedRequest).user;
if (!user) throw new HttpError(401, "Unauthorized");
// ALWAYS verify ownership for user-specific resources
if (resource.userId !== user.id) throw new HttpError(403, "Forbidden");
```

### Backend: Validation with Zod

Define schemas in controllers, validate request bodies:

```typescript
const schema = z.object({ agent_id: z.string(), title: z.string().optional() });
const parsed = schema.parse(request.body);
```

### Frontend: TanStack Query Pattern

```typescript
// Centralized query keys in shared/api/queryKeys.ts
export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

// Feature-specific hooks wrap queries
export const useGetUser = (id: string) =>
  useQuery({ queryKey: userKeys.detail(id), queryFn: () => fetchUser(id) });
```

---

## RAG Pipeline (Vector Search)

1. **Upload**: PDF → chunk (1000 chars, 200 overlap) → Gemini embeddings (768-dim)
2. **Store**: Supabase pgvector (`document_chunks` table)
3. **Search**: Query → embedding → `match_documents` RPC

**CRITICAL**: Always filter by `user_id` for data isolation:

```typescript
await supabase.rpc("match_documents", {
  query_embedding: embedding,
  filter_user_id: userId, // REQUIRED
  match_threshold: 0.5,
  match_count: k,
});
```

---

## File Naming & Conventions

| Type           | Pattern                  | Example                                        |
| -------------- | ------------------------ | ---------------------------------------------- |
| Use case       | `kebab-case.use-case.ts` | `upload-document.use-case.ts`                  |
| Test           | `*.test.ts` (colocated)  | `upload-document.use-case.test.ts`             |
| Component      | `PascalCase.tsx`         | `ChatMessage.tsx`                              |
| Port interface | Domain folder            | `domain/ports/outbound/document-repository.ts` |

- **ES Modules**: Use `.js` extensions in imports (TypeScript ESM)
- **Named exports only**: No default exports
- **Strict TypeScript**: Explicit types for props, return values

---

## OpenAPI Sync

When modifying routes in `apps/backend/src/adapters/inbound/http/`:

1. Update `src/infrastructure/openapi.yaml`
2. Verify at `http://localhost:3000/docs`

---

## UI Component Library (`apps/storybook`)

Atomic Design methodology - compose up from atoms:

```
atoms → molecules → organisms → templates → pages
```

| Level     | Examples                                               |
| --------- | ------------------------------------------------------ |
| Atoms     | `Button`, `Icon`, `Avatar`, `Badge`, `Spinner`         |
| Molecules | `MessageBubble`, `AgentIdentity`, `StreamingIndicator` |
| Organisms | `Composer`, `Sidebar`, `Modal`, `MessageList`          |
| Templates | `MainPanel`, `FirstRunExperience`                      |

```bash
cd apps/frontend && pnpm storybook  # http://localhost:6006
```

**Usage Rules**:

- Import from atomic level: `import { Button } from "@/shared/ui/atoms"`
- Use semantic variants (`primary`, `success`, `error`) - never hardcode colors
- Compose organisms from molecules/atoms - don't bypass hierarchy

---

## Testing

```typescript
// Mock repositories, test use case logic
describe("MyUseCase", () => {
  let useCase: MyUseCase;
  let mockRepo: jest.Mocked<Repository>;

  beforeEach(() => {
    mockRepo = { findById: jest.fn() } as jest.Mocked<Repository>;
    useCase = new MyUseCase(mockRepo);
  });
});
```

---

## Don't

- ❌ Import between features directly (use barrel exports)
- ❌ Put business logic in controllers
- ❌ Skip `user_id` filter in vector searches
- ❌ Use `npm`/`yarn` (pnpm only)
- ❌ Use `React.FC` (use explicit props interfaces)
- ❌ Use default exports
- ❌ Hardcode colors - use design tokens
- ❌ Bypass component hierarchy (atoms → molecules → organisms)
