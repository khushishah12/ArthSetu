# Deployment

## 1. Neon

1. Create the Neon project.
2. Enable Neon Auth.
3. Run `database/NEON_SETUP.sql`.
4. Save:
   - `DATABASE_URL`
   - `NEON_AUTH_BASE_URL`
   - `NEON_AUTH_COOKIE_SECRET`

## 2. Render

Create a Blueprint from the repository's `render.yaml`.

After deployment save:

- `ML_SERVICE_URL`
- `ML_SERVICE_API_KEY`

## 3. Vercel

Import the GitHub repository and add:

```env
DATABASE_URL=
NEON_AUTH_BASE_URL=
NEON_AUTH_COOKIE_SECRET=
ML_SERVICE_URL=
ML_SERVICE_API_KEY=
ALLOW_DEMO_FALLBACK=true
NEXT_PUBLIC_SITE_URL=https://YOUR_PROJECT.vercel.app
```

After Vercel deploys, add the production Vercel origin to Neon Auth's allowed
origins.

## 4. Verify

Open:

- `/api/health`
- `/signup`
- `/app/assessment`
- `/app/history`

The health response should report Neon Auth configured, database connected and
ML connected.
