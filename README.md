# Sushi Samurai Express

## Overview

Sushi Samurai Express is a modular, headless web application platform designed for a sushi restaurant to offer online ordering (delivery or pickup) and manage content and operations through a centralized admin interface. The system includes a CMS-like structure for defining and managing data collections, alongside a business-specific backoffice for operational tasks like order and customer management.

## Features

### Customer-Facing

- Product catalog browsing with search, filtering, and categorization
- Shopping cart with quantity adjustment
- Secure checkout with Stripe payment integration
- Customer authentication (sign-up, login, password reset)
- Order history and address management

### Admin Interface (CMS + Backoffice)

- Define and manage collections (Products, Categories, etc.) via schema
- Auto-generated admin UI for content management
- Role-based access control (Admin, Staff, Customer)
- Media library with image preview and management
- Order dashboard for processing and tracking orders
- Customer management and analytics

## Tech Stack

- **Frontend**: React 18 with TypeScript 5
- **Build Tool**: Vite 4
- **Routing**: React Router 6
- **UI**: Tailwind CSS 3 with shadcn-ui components
- **State Management**: Zustand 4 and React Query 4
- **Forms**: React Hook Form 7 with Zod 3 validation
- **Backend**: Supabase (Auth, Database, Storage)
- **Database**: PostgreSQL 14 (via Supabase)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v7+) or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup

Copy the `.env.example` file to `.env.local` and update with your Supabase credentials.

## Development Environments

- **Development**: Local development environment (`npm run dev`)
- **Testing**: Test environment for QA (`npm run build:test`)
- **Production**: Live production environment (`npm run build`)

## Project Structure

```
/src
  /api          # API clients and services
  /components   # UI components
    /layout     # Layout components
    /ui         # Reusable UI components
  /hooks        # Custom React hooks
  /lib          # Utility functions and helpers
  /pages        # Page components
  /styles       # Global styles
  /types        # TypeScript type definitions
/public         # Static assets
```

## License

All rights reserved. This codebase is proprietary and confidential.

