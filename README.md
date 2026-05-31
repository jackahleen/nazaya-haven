# Nazaya Haven

AI-powered advocacy and support platform for families and children.

**Tagline:** *A Safe Place. A Stronger Future. Together.*

## Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- TypeScript
- Tailwind CSS v4
- React 19

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — branding, tagline, Create Account & Explore the Hub |
| `/login` | Sign in with email and password |
| `/dashboard` | Hub — Community Feed, Support Groups, Resources, Journal, Nazaya AI |

## Project structure

```
nazaya-haven/
├── public/
├── src/
│   ├── app/
│   │   ├── dashboard/page.tsx
│   │   ├── login/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx          # Home
│   └── components/
│       ├── BrandLogo.tsx
│       ├── Button.tsx
│       ├── DashboardCard.tsx
│       ├── PageShell.tsx
│       └── icons.tsx
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Run locally

### Prerequisites

Install [Node.js](https://nodejs.org/) **20 LTS or newer** (includes `npm`).

### Install dependencies

```bash
cd /Users/jacquelineosorio/Projects/nazaya-haven
npm install
```

### Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- Home: [http://localhost:3000](http://localhost:3000)
- Login: [http://localhost:3000/login](http://localhost:3000/login)
- Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

### Production build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## Theme

Soft **lavender**, **cream**, and **purple** palette defined in `src/app/globals.css` and used across all pages.
