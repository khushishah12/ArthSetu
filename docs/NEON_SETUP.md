# Neon setup

## 1. Create the project

Create a Neon project named `arthsetu-ai` and copy its pooled connection
string into `DATABASE_URL`.

## 2. Enable Neon Auth

In Neon Console, open **Auth**, enable it for the production branch and copy
the Auth URL into `NEON_AUTH_BASE_URL`.

Generate one stable cookie secret of at least 32 characters:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

Save it as `NEON_AUTH_COOKIE_SECRET`.

## 3. Create ArthSetu tables

Open Neon SQL Editor and run `database/NEON_SETUP.sql` once.

The application stores only:

- user-owned assessment results;
- user-owned consent events.

Synthetic model profiles remain in the ML service.

## 4. Local environment

```env
DATABASE_URL=postgresql://...
NEON_AUTH_BASE_URL=https://...
NEON_AUTH_COOKIE_SECRET=...
ML_SERVICE_URL=http://127.0.0.1:8000
ML_SERVICE_API_KEY=local-development-key
ALLOW_DEMO_FALLBACK=true
```

## Security model

The browser never receives `DATABASE_URL`. Next.js Route Handlers obtain the
Neon Auth session and always filter reads and deletes by `session.user.id`.
