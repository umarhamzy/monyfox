# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

MonyFox is a comprehensive open-source financial management web application that runs 100% locally in the browser. It uses IndexedDB for local data storage, ensuring complete privacy and offline functionality. The application supports multi-currency finance tracking, investment monitoring, and financial visualization.

## Development Commands

### Primary Development
- **Start development server**: `yarn dashboard:dev`
- **Build production**: `yarn dashboard:build` (builds dashboard and dependencies)
- **Build all packages**: `yarn build`

### Testing & Quality
- **Run all tests**: `yarn test`
- **Run tests with coverage**: `yarn coverage` (uses npx vitest run --coverage)
- **Lint all packages**: `yarn lint`

### Single Package Commands
Since this is a monorepo, you can run commands on specific packages:
- **Dashboard-specific**: `yarn workspace @monyfox/dashboard [command]`
- **Test single file**: `npx vitest run [file-path]` (from dashboard directory)
- **Development preview**: `yarn workspace @monyfox/dashboard preview`

## Architecture Overview

### Monorepo Structure
This is a Yarn workspaces monorepo with the following key structure:
- `apps/client/dashboard/` - Main React application
- `packages/common/data/` - Core data schemas and types (Zod-based)
- `packages/common/symbol/` - Currency exchange rate clients
- `packages/common/symbol-exchange/` - Symbol exchange utilities
- `packages/tsconfig/` - Shared TypeScript configurations

### Core Technologies
- **Frontend**: React 19, TypeScript, TanStack Router (file-based routing)
- **Styling**: Tailwind CSS v4, Radix UI components
- **State Management**: TanStack Query, React Context
- **Database**: IndexedDB (via custom abstraction layer)
- **Forms**: React Hook Form + Zod validation
- **Testing**: Vitest, React Testing Library
- **Build**: Vite, with custom analytics plugin

### Key Architectural Patterns

#### Data Layer
- **Local-first**: All data stored in IndexedDB, no server dependencies
- **Schema-driven**: Zod schemas define all data structures in `@monyfox/common-data`
- **Type-safe**: Full TypeScript coverage with inferred types from Zod schemas
- **Encryption support**: Data can be stored encrypted or unencrypted (see `RawDataSchema`)

#### Component Architecture
- **Context Providers**: 
  - `DatabaseProvider` - Manages IndexedDB operations and caching
  - `ProfileProvider` - Handles user profile management
  - `SettingsProvider` - Application settings
  - `AssetSymbolExchangeRateProvider` - Currency exchange rates
- **File-based routing**: TanStack Router with routes in `src/routes/`
- **Component co-location**: Components with their tests (.test.tsx files)

#### Core Domain Models
- **Profile**: User profiles containing encrypted/unencrypted financial data
- **Account**: Financial accounts (checking, savings, investment, etc.)
- **Transaction**: Income, expense, transfer records
- **TransactionCategory**: Categorization for transactions
- **AssetSymbol**: Currencies and investment symbols
- **AssetSymbolExchange**: Exchange rates between symbols

### Data Flow
1. User selects/creates profile (stored in IndexedDB)
2. Profile contains all financial data (accounts, transactions, etc.)
3. Data flows through React Context providers
4. TanStack Query manages caching and state synchronization
5. Components use React Hook Form for data entry with Zod validation

### Testing Strategy
- **Comprehensive coverage**: All major components have `.test.tsx` files
- **Vitest configuration**: Global setup with jsdom environment
- **Mocked dependencies**: Uses MSW for API mocking when needed
- **Database mocking**: fake-indexeddb for testing database operations

### Development Notes
- **Path aliasing**: `@/` points to `src/` directory
- **Strict TypeScript**: Enabled with comprehensive linting rules
- **Modern React**: Uses React 19 features and modern patterns
- **Performance focused**: Lazy loading, memo usage where appropriate
- **Accessibility**: Radix UI components ensure good a11y by default

### Build & Deployment
- **Vite-based**: Fast development and optimized production builds
- **TypeScript compilation**: `tsc -b` for type checking before build
- **Static deployment**: Generates static files suitable for any web server
- **No server required**: Complete client-side application

### Currency & Exchange Rates
- **Multi-currency support**: Full support for different currencies
- **Exchange rate providers**: Pluggable system with Frankfurter client
- **Historical rates**: Stores exchange rate history for accurate calculations
- **Local caching**: Exchange rates cached in IndexedDB for offline use