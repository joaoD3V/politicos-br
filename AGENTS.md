# PoliticosBR - Agent Development Guidelines

## Build & Development Commands

### Core Commands
```bash
# Development server with hot reload
yarn dev

# Production build
yarn build

# Start production server
yarn start

# Lint code (ESLint with Next.js config)
yarn lint

# Install dependencies
yarn install
```

### Testing Commands
```bash
# Note: This project currently does not have a dedicated test setup
# To run tests in the future, use:
yarn test          # Run all tests
yarn test <file>    # Run single test file
yarn test --watch   # Run tests in watch mode
```

## Project Architecture

### Tech Stack
- **Next.js 16.1.6** with App Router and Turbopack
- **TypeScript 5.x** with relaxed strictness
- **Tailwind CSS 3.4.17** with custom design system
- **React 19.2.3** with hooks and patterns
- **Radix UI** for accessible components
- **React Query** for data fetching and caching
- **Recharts** for data visualization

### Directory Structure
```
src/
├── app/              # Next.js App Router pages (Server Components by default)
├── components/        # Reusable UI and layout components
│   ├── ui/          # Base UI components (shadcn/ui)
│   ├── layout/       # Layout components (Header, Footer, etc.)
│   ├── deputies/     # Feature-specific components
│   └── charts/       # Data visualization components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and helpers
└── data/            # Type definitions and mock data
```

## Code Style Guidelines

### Import Organization
```typescript
// 1. React and Next.js imports first
'use client';
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// 2. Third-party libraries
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Search, Menu } from "lucide-react";

// 3. Internal imports (with @/ alias)
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { mockDeputies } from "@/data/mockDeputies";
```

### Component Patterns

#### Client Components
Add `'use client';` at the top of any component using:
- React hooks (useState, useEffect, etc.)
- Browser APIs
- Event handlers
- Next.js navigation hooks

```typescript
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MyComponent() {
  const [count, setCount] = useState(0);
  
  return <Button onClick={() => setCount(c => c + 1)}>Count: {count}</Button>;
}
```

#### Server Components
Default behavior for App Router pages. No `'use client'` directive needed.

```typescript
import { getDeputies } from "@/lib/api";

export default async function DeputiesPage() {
  const deputies = await getDeputies();
  return <DeputyList deputies={deputies} />;
}
```

#### Component Props
Use TypeScript interfaces extending HTML attributes when appropriate:

```typescript
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
```

### Naming Conventions

#### Files & Components
- **PascalCase** for component files: `DeputyCard.tsx`, `SearchBar.tsx`
- **camelCase** for utilities: `utils.ts`, `mockDeputies.ts`
- **kebab-case** for pages/routes: `deputado/[id]/page.tsx`

#### Variables & Functions
```typescript
// camelCase for variables and functions
const searchQuery = '';
const handleSearch = () => {};

// PascalCase for types and interfaces
interface DeputyProps {
  deputy: Deputy;
}

// UPPER_CASE for constants
const API_BASE_URL = 'https://dadosabertos.camara.leg.br';
```

### TypeScript Guidelines

#### Type Definitions
```typescript
// Use descriptive interface names
export interface Deputy {
  id: string;
  nome: string;
  partido: string;
  situacao: "Exercício" | "Afastado" | "Licenciado";
}

// Use union types for fixed values
type StatusType = "Aprovada" | "Em Tramitação" | "Arquivada" | "Rejeitada";

// Generic types for reusable components
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}
```

#### Import/Export Types
```typescript
// Explicitly import types when needed
import type { Deputy } from "@/data/mockDeputies";

// Export types for external use
export type { Deputy, DeputyProps };
```

### Styling Guidelines

#### Tailwind + Class Variance
```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// Use cn() for conditional styling
className={cn(buttonVariants({ variant, size }), className)}
```

#### Custom CSS Variables
```css
.status-approved {
  @apply bg-[hsl(var(--status-approved))] text-[hsl(var(--status-approved-foreground))];
}
```

### Error Handling

#### React Query Error Handling
```typescript
const { data, error, isLoading } = useQuery({
  queryKey: ['deputies'],
  queryFn: fetchDeputies,
  retry: 3,
  retryDelay: 1000,
});

if (error) {
  return <ErrorState error={error} />;
}
```

#### Try-Catch for Async Operations
```typescript
const handleSearch = async () => {
  try {
    const results = await searchDeputies(query);
    setResults(results);
  } catch (error) {
    console.error('Search failed:', error);
    toast.error('Falha ao buscar deputados');
  }
};
```

#### User-Facing Error Messages
```typescript
// Always provide user feedback
const ErrorState = ({ error }: { error: Error }) => (
  <div className="p-4 text-center">
    <p className="text-destructive">Ocorreu um erro inesperado</p>
    <p className="text-sm text-muted-foreground">Tente novamente mais tarde</p>
  </div>
);
```

### Next.js Specific Patterns

#### Navigation
```typescript
// Client components
import { useRouter, usePathname } from "next/navigation";

const router = useRouter();
const pathname = usePathname();

// Programmatic navigation
router.push('/buscar?q=term');
router.back();

// Link for navigation
<Link href="/deputado/123">Ver Perfil</Link>
```

#### Data Fetching
```typescript
// Server components (preferred)
async function DeputiesPage() {
  const deputies = await fetchDeputies();
  return <DeputyList deputies={deputies} />;
}

// Client components (when needed)
const { data: deputies } = useQuery({
  queryKey: ['deputies'],
  queryFn: fetchDeputies,
});
```

### Performance Guidelines

#### Image Optimization
```typescript
import Image from "next/image";

<Image
  src="/logo.svg"
  alt="PoliticosBR Logo"
  width={40}
  height={40}
  priority // For above-fold images
/>
```

#### Dynamic Imports
```typescript
// Code split heavy components
const HeavyChart = dynamic(() => import("@/components/charts/HeavyChart"), {
  loading: () => <div>Carregando...</div>,
});
```

## Design System

### Color Palette
```css
--primary: 221 83% 53%;           /* Institutional Blue */
--secondary: 215 20% 95%;          /* Light Gray */
--accent: 214 95% 93%;             /* Light Blue */
--muted: 210 20% 96%;              /* Background Gray */
--status-approved: 142 76% 36%;      /* Success Green */
--status-pending: 45 93% 47%;       /* Warning Yellow */
```

### Component Library
- **shadcn/ui** components in `src/components/ui/`
- **Custom variants** using class-variance-authority
- **Consistent spacing** with Tailwind utilities
- **Responsive design** mobile-first approach

## Git Workflow

### Commit Convention
```
feat: add deputy search functionality
fix: resolve navigation bug on mobile
docs: update API integration guide
refactor: improve component structure
test: add deputy card unit tests
```

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `hotfix/*` - Critical fixes

## Development Tips

### Component Development
1. Start with TypeScript interfaces
2. Use component composition
3. Test responsiveness early
4. Add proper error boundaries
5. Consider accessibility (ARIA labels, keyboard nav)

### Code Quality
- Run `yarn lint` before commits
- Use meaningful variable names in Portuguese
- Add JSDoc comments for complex functions
- Keep components small and focused
- Use proper loading states and error handling

### Browser Testing
- Test in Chrome, Firefox, Safari
- Verify mobile responsiveness
- Check accessibility with screen readers
- Validate form interactions