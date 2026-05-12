# LUNATECH — Premium Electronics E-Commerce

A modern e-commerce app built with Next.js 14, TypeScript, and Tailwind CSS. Features product filtering, shopping cart, multi-step checkout, authentication, and dark mode.

## Features

- Advanced product filtering & search with URL state sync
- Product details with image gallery & variant selectors
- Persistent shopping cart with real-time calculations
- Multi-step checkout with form validation (React Hook Form + Zod)
- User authentication (NextAuth.js)
- Wishlist with localStorage
- Dark mode support
- Mobile responsive
- Lighthouse score 90+

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + shadcn/ui
- **Zustand** (state management)
- **React Hook Form** + **Zod** (form validation)
- **NextAuth.js** (authentication)
- **React Query** (data fetching)

## Quick Start

```bash
git clone https://github.com/yourusername/lumen-ecommerce.git
cd lumen-ecommerce
npm install
npm run dev
```

## Project Structure

```
src/
├── app/          # Next.js App Router
├── components/   # React components
├── lib/          # Utilities & helpers
├── store/        # Zustand state
├── hooks/        # Custom hooks
└── types/        # TypeScript types
```

## Development

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Run ESLint
```
