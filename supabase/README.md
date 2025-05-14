# Supabase Setup for Sushi Samurai Express

This document provides instructions on how to set up and configure a Supabase project for the Sushi Samurai Express application.

## Creating a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project
3. Choose a name for your project (e.g., "sushi-samurai-express")
4. Set a secure database password
5. Choose a region closest to your users
6. Wait for your project to be created (this may take a few minutes)

## Getting Your API Keys

Once your project is created:

1. Go to your project dashboard
2. In the left sidebar, click on **Project Settings** > **API**
3. Copy the **Project URL** value - this will be your `VITE_SUPABASE_URL` environment variable
4. Copy the **anon public** key - this will be your `VITE_SUPABASE_ANON_KEY` environment variable
5. Add these values to your `.env.local` file:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Setting Up Database Schema

You have two options to set up the database schema:

### Option 1: Using the Supabase UI

1. Go to the **Table Editor** in your Supabase dashboard
2. Create tables and relationships as defined in the `migrations/00001_initial_schema.sql` file
3. Set up Row Level Security (RLS) policies for each table

### Option 2: Using the SQL Editor

1. Go to the **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `migrations/00001_initial_schema.sql`
3. Run the SQL script

## Populating with Sample Data

To populate the database with sample data:

1. Go to the **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `seed.sql`
3. Run the SQL script

## Setting Up Authentication

1. Go to **Authentication** > **Providers** in your Supabase dashboard
2. Enable Email/Password sign-in
3. If needed, enable Google sign-in and configure OAuth credentials

## Enabling Storage

1. Go to **Storage** in your Supabase dashboard
2. Create a new bucket named `media`
3. Set the privacy to "Authenticated users only"
4. Create appropriate bucket policies for access control

## Testing the Connection

To test the connection between your application and Supabase:

1. Ensure your `.env.local` file has the correct API keys
2. Run the application with `npm run dev`
3. Open the browser console and check for any Supabase connection errors
4. Run tests with `npm test` to validate the Supabase integration

## Troubleshooting

- **CORS Issues**: Ensure your site URL is added to the allowed domains in Supabase settings
- **Authentication Errors**: Verify your API keys are correct and properly configured
- **Database Errors**: Check RLS policies and ensure they're properly set up
- **Connection Timeouts**: Verify your network connection and Supabase service status
