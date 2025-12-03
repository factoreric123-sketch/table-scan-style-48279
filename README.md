# Digital Restaurant Menu Platform

A modern, full-featured digital menu platform for restaurants built with React, TypeScript, and Supabase.

## Project Overview

This platform allows restaurants to create beautiful, interactive digital menus that can be accessed via QR codes or direct links. Features include menu management, pricing tiers, analytics, and more.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager
- Supabase account and project

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies:
```sh
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id
```

4. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build with development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Project Structure

```
/workspace/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Route pages
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries and Supabase client
│   ├── integrations/  # Third-party integrations
│   └── main.tsx       # Application entry point
├── supabase/
│   ├── functions/     # Edge Functions
│   └── migrations/    # Database migrations
├── public/            # Static assets
└── index.html         # HTML entry point
```

## Features

- 🍽️ **Menu Management**: Create and manage restaurant menus with categories and dishes
- 📱 **QR Code Integration**: Generate QR codes for easy menu access
- 💳 **Premium Tiers**: Multiple subscription levels with different features
- 📊 **Analytics**: Track menu views and engagement
- 🎨 **Customizable Themes**: Multiple design options for menus
- 🖼️ **Image Management**: Upload and manage dish images
- 🔗 **Short Links**: Create memorable short links for menus
- 📧 **User Authentication**: Secure login and user management via Supabase Auth

## Database

The application uses Supabase PostgreSQL with the following main tables:
- `restaurants` - Restaurant information
- `menu_links` - Menu configurations and links
- `dishes` - Dish information
- `categories` - Menu categories
- `subscriptions` - User subscription data

See `supabase/migrations/` for complete database schema.

## Deployment

### Supabase Setup

1. Create a new Supabase project
2. Run the migrations in `supabase/migrations/` in order
3. Deploy the Edge Functions from `supabase/functions/`
4. Configure Storage buckets for images

### Frontend Deployment

Build the production bundle:
```sh
npm run build
```

The optimized files will be in the `dist/` directory, ready to deploy to any static hosting service (Vercel, Netlify, Cloudflare Pages, etc.).

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Your Supabase anonymous key
- `VITE_SUPABASE_PROJECT_ID` - Your Supabase project ID

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is private and proprietary.
