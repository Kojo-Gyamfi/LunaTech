# LunaTech E-Commerce

LunaTech is a modern premium electronics storefront built with Next.js, TypeScript, Tailwind CSS, and Zustand. It includes product browsing, a persistent cart, a multi-step checkout flow, Paystack inline payments, and a support contact form powered by email.

## Features

- Responsive product catalog and product detail pages
- Persistent shopping cart with subtotal, shipping, tax, and total calculations
- Multi-step checkout for customer info, shipping, and payment
- Paystack Pop inline payment modal with server-side transaction verification
- Order confirmation page with payment status handling
- Support form using Nodemailer/SMTP
- Dark, polished UI with Tailwind CSS and Lucide icons

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Zustand
- Paystack
- Nodemailer
- Sonner toasts
- Lucide React icons


## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

The app is ready to deploy on Vercel. Before using live payments, rotate any exposed local secrets, add production environment variables, and configure Paystack live keys and webhooks.
