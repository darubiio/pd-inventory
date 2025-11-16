This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

### Development
- `pnpm dev` - Start Next.js development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Redis Management
- `pnpm redis list` - List all Redis keys (separated by environment)
- `pnpm redis clear-dev` - Clear all development keys (DEV: prefix)

### Session Management (Testing OAuth Refresh)
- `pnpm session list` - List all active sessions with expiry info
- `pnpm session expire [sessionId]` - Expire token immediately
- `pnpm session expire-soon [minutes] [sessionId]` - Set token to expire in X minutes (default: 4)

**Examples:**
```bash
# List all sessions
pnpm session list

# Expire token immediately (test automatic refresh)
pnpm session expire

# Set token to expire in 3 minutes (test preventive refresh)
pnpm session expire-soon 3
```

See [lib/api/REDIS.md](lib/api/REDIS.md) for more information about Redis key management.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
