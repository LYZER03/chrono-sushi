# Web App & CMS Design Document

## Overview

A modular, headless web application platform allowing businesses (e.g., restaurants, retailers, groceries) to offer online ordering (delivery or pickup) and manage content and operations through a centralized admin interface. The system includes a CMS-like structure for defining and managing data collections, alongside a business-specific backoffice for operational tasks like order and customer management.

## Features

### Customer-Facing

* Product/service catalog browsing
* Search, filtering, and categorization
* Shopping cart with quantity adjustment
* Checkout with support for credit cards, PayPal, and mobile payment
* Customer authentication (sign-up, login, password reset)
* Order history and address management
* Optional real-time order tracking

### Admin Interface (CMS + Backoffice)

#### CMS Features:

* Define collections (e.g., Products, Pages, Categories, FAQs) via schema
* Field types: text, rich text, number, image, file, select, boolean, date, relationship
* Auto-generated admin UI for managing entries in collections
* Role-based access control (RBAC) per collection and action
* Uploads and media library with tagging and image preview
* Hooks and lifecycle events (before/after create/update/delete)
* Multi-language support for content
* REST and GraphQL APIs auto-exposed

#### Backoffice Features:

* Order dashboard: list, view, filter, and update order statuses
* Inventory management: stock levels, low stock alerts
* Customer management: profiles, history, communication
* Delivery/pickup status tracking and updates
* Analytics: sales charts, product performance, customer activity

## User Roles

* **Admin**: Full access to CMS and backoffice features
* **Staff**: Limited access (e.g., only view orders, no schema edits)
* **Customer**: Can browse and place orders, view order history

## UI Components

* Navbar, Sidebar (with collapsible menu)
* Forms with dynamic field rendering based on schema
* Rich Text Editor for content
* Drag-and-drop upload area
* Table views for collection entries (sortable, filterable)
* Notification/toast system for updates
* Pagination and modal support

## Backend Architecture

* **Node.js** with **Express** or **NestJS**
* **PostgreSQL** (with Supabase)
* Modular services for collections, auth, media, orders, etc.
* JWT authentication with role and permission guards
* Middleware for validation, logging, and error handling
* Webhooks/events for external integrations

## CMS Architecture

* Collection schema definitions stored in modular files (e.g., `/collections/product.js`)
* Admin panel reads these schemas and renders UI dynamically
* CRUD routes auto-generated based on schema
* Field-level validation and defaults
* Hook system: `beforeCreate`, `afterUpdate`, etc.
* RBAC enforced per route and field
* API layer auto-generates REST and GraphQL endpoints

## Tech Stack

* **Frontend**: React + Tailwind CSS
* **Backend**: Node.js + Express or NestJS
* **Database**: PostgreSQL (with Supabase)  
* **Auth**: JWT, bcrypt
* **File Storage**: Local or Cloud (e.g., S3, Cloudinary)
* **API**: REST + optional GraphQL
* **Admin UI**: Custom React panel with reusable components

## Database Schema (Example)

### Users

* `email` (string)
* `passwordHash` (string)
* `role` (enum: admin, staff, customer)

### Products

* `title` (string)
* `description` (richtext)
* `price` (float)
* `image` (file/image ref)
* `categoryId` (foreign key)

### Orders

* `userId` (foreign key)
* `items` (array of { productId, quantity })
* `status` (enum: pending, preparing, delivered)
* `totalPrice` (float)
* `deliveryMethod` (enum: delivery, pickup)

## APIs

* `POST /api/auth/login`
* `GET /api/products`
* `POST /api/orders`
* `GET /api/collections/:collectionSlug`
* `POST /api/collections/:collectionSlug`
* GraphQL endpoint (optional): `/graphql`

## Optional Enhancements

* Drag-and-drop CMS layout editor
* Marketplace for plugins and collection templates
* Customer chat integration
* POS system sync (for physical stores)
* White-labeling for multi-tenant use

## Future Considerations

* SaaS version with multiple tenant accounts
* Theme customization for stores
* Mobile app for order tracking and admin tasks
* Headless e-commerce integrations (Snipcart, Stripe, etc.)