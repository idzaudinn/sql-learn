# SQL-Learn (Next.js)

Next.js project for SQL-Learn, ready to deploy on Vercel.

## Test login

- Username: `admin`
- Password: `admin`

## Files

- `app/page.js` - Home page
- `app/login/page.js` - Login and create account page
- `app/dashboard/page.js` - Protected page after login
- `app/globals.css` - Shared styles and theme
- `vercel.json` - Vercel configuration and basic security headers

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

Then visit: `http://localhost:3000`

## Deploy to Vercel

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Login:

```bash
vercel login
```

3. Deploy:

```bash
vercel
```

4. For production deploy:

```bash
vercel --prod
```
