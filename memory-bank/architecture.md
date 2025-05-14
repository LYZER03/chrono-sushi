# Sushi Samurai Express - Architecture Documentation

## Project Overview

Sushi Samurai Express is a headless CMS and e-commerce platform for a sushi restaurant, built using React, TypeScript, and Supabase. This document outlines the architectural decisions, file structure, and component organization.

## Directory Structure

```
/
├── public/                 # Static assets served as-is
├── src/                    # Source code
│   ├── api/                # API clients and services
│   ├── components/         # UI components
│   │   ├── layout/         # Layout components (header, footer, etc.)
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and helpers
│   ├── pages/              # Page components and routes
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point
│   └── vite-env.d.ts       # Vite environment type definitions
├── .env.example            # Example environment variables
├── .eslintrc.js            # ESLint configuration
├── .gitignore              # Git ignore rules
├── .prettierrc             # Prettier configuration
├── index.html              # HTML entry point
├── package.json            # Project dependencies and scripts
├── README.md               # Project documentation
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

## Key Files and Their Purpose

### Configuration Files

- **package.json**: Defines project dependencies, scripts, and metadata
- **tsconfig.json**: Configures TypeScript compiler options
- **vite.config.ts**: Configures Vite build tool and its plugins
- **.env.example**: Template for environment variables needed by the application
- **.eslintrc.js**: Rules for code linting and style enforcement
- **.prettierrc**: Configuration for code formatting
- **.gitignore**: Specifies files that Git should ignore

### Entry Points

- **index.html**: The HTML template that loads the application
- **src/main.tsx**: JavaScript entry point that renders the React application
- **src/App.tsx**: Root React component that sets up routing and app-wide providers

### Component Structure

#### Layout Components (`src/components/layout/`)

Layout components provide the overall structure of the application, including:

- **Header**: Navigation, brand identity, and user controls
- **Footer**: Site-wide links, copyright, and additional information
- **Sidebar**: Navigation for admin/backoffice views
- **Layout**: Wrapper component that combines header, footer, and main content

#### UI Components (`src/components/ui/`)

Reusable UI elements used throughout the application:

- **Button**: Various button styles and variants
- **Card**: Content container with consistent styling
- **Input**: Form input elements with validation integration
- **Modal**: Popup dialogs for various interactions
- **Table**: Data table with sorting and filtering capabilities

### State Management

The application uses Zustand for global state management and React Query for server state:

- **Zustand Stores**: Located in `src/lib/stores/`
- **React Query Hooks**: Located in `src/hooks/queries/`

### API Integration

API clients and services in `src/api/` handle communication with Supabase and other services:

- **supabase.ts**: Central Supabase client configuration that initializes the connection and provides a health check function to validate connectivity. This is the foundation for all Supabase interactions.

- **auth.ts**: Authentication-related API functions including:
  - Email/password sign-in and sign-up
  - Social authentication (Google)
  - Password reset and recovery
  - Session management
  - User profile management

- **collections.ts**: Generic API functions for dynamic content management:
  - Strongly typed CRUD operations for any collection
  - Filtering, pagination, and sorting
  - Advanced search functionality
  - Relationship handling

- **media.ts**: Complete media management system:
  - File uploads to Supabase Storage
  - Metadata tracking and organization
  - Public URL generation
  - Secure deletion of files and records

## Design Patterns

### Component Organization

1. **Atomic Design**: Components follow a hierarchy from atoms (basic UI elements) to organisms (complex components) to templates (page layouts)

2. **Container/Presentation Pattern**: Separates data fetching and state management (containers) from rendering (presentation components)

3. **Hooks Pattern**: Custom React hooks encapsulate reusable logic

### Data Flow

1. **Unidirectional Data Flow**: Data flows down through components via props

2. **Context for Themes/Auth**: React Context used for theme, authentication, and other app-wide concerns

3. **Zustand for Global State**: Simple, flexible state management with Zustand

4. **React Query for Server State**: Handles caching, refetching, and synchronization with the server

## Environment Configuration

The application supports three environments:

1. **Development**: Local development environment
2. **Testing**: For QA and integration testing
3. **Production**: Live production environment

Environment-specific behavior is controlled through environment variables defined in `.env.*` files.

## Authentication Flow

1. User attempts to access a protected route
2. Auth guard checks for valid session
3. If no session, redirect to login page
4. On successful login, Supabase JWT is stored and user redirected to original destination

## Database Schema

Managed through Supabase, the schema includes tables for:

- **Users**: Authentication and user profiles
- **Collections**: Defines the structure of dynamic content types
- **Collection Items**: Content entries for each collection
- **Media**: Uploaded images and files
- **Orders**: Customer orders with line items
- **Products**: Menu items and products for sale

## API Endpoints

Auto-generated based on collection schemas, following REST principles:

- **GET /collections/:slug**: List items in a collection
- **GET /collections/:slug/:id**: Get a specific item
- **POST /collections/:slug**: Create a new item
- **PUT /collections/:slug/:id**: Update an item
- **DELETE /collections/:slug/:id**: Delete an item

## Future Architectural Considerations

1. **Micro-Frontend Architecture**: As the application grows, consider breaking it into separate deployable modules

2. **Server Components**: Evaluate React Server Components for improved performance

3. **Edge Computing**: Explore moving certain functionality to edge functions for improved latency