# Technology stack

| Layer | Technology | Responsibility |
|---|---|---|
| Product app | Next.js 16 App Router | Public site, authenticated workspace and deployment unit |
| UI | React 19 + TypeScript | Interactive product states and maintainable components |
| Styling | Tailwind CSS 4 + authored CSS | Responsive design system and cinematic visual identity |
| Motion | Framer Motion, GSAP and Lenis | Entrance motion, guided demo choreography and smooth scrolling |
| Server routes | Next.js Route Handlers + Zod | Same-origin BFF, validation and secret isolation |
| Identity | Supabase Auth + `@supabase/ssr` | Cookie-based signup, login and server sessions |
| Persistence | Supabase PostgreSQL + RLS | User-scoped assessments, profiles and consent events |
| Intelligence | FastAPI + Pydantic | Bounded Python ML API |
| Model | scikit-learn + Joblib | Transparent alternative-data scoring |
| Hosting | Vercel + Supabase + Render | Web/BFF, database/auth and ML service |

The local demo requires only Node.js and Python. Supabase is optional until cloud mode is enabled.
