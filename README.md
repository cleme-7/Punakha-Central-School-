# Punakha Central School website

## Setup
1. `npx create-next-app@14 punakha-central-school --ts --tailwind --app --eslint --import-alias "@/*"`
2. Copy the contents of this folder over the new project (overwrite when asked), then `npm i @supabase/ssr @supabase/supabase-js zod`
3. Create a Supabase project. In the SQL editor run `supabase/migrations/001_schema.sql`, then `supabase/seed.sql`
4. `cp .env.example .env.local` and fill in the project URL and anon key (Supabase: Project settings, API)
5. `npm run dev`, open http://localhost:3000

## Demo users
Passwords are never shipped in a repo. In Supabase go to Authentication, Users, Add user, and create `admin@example.com` and `teacher@example.com` with passwords you choose. Then run:

    update profiles set role = 'admin'   where id = (select id from auth.users where email = 'admin@example.com');
    update profiles set role = 'teacher' where id = (select id from auth.users where email = 'teacher@example.com');

New sign-ups default to `student`.

## Deploy
Push to GitHub, import the repo in Vercel, add the three variables from `.env.example`.

## Privacy switch
`update settings set value = true where key = 'show_full_names';` shows full names on the public rankings page. Default is initials.

## Next
- `npx shadcn@latest init` to adopt shadcn/ui components
- Rate limiting: add Upstash Ratelimit in `middleware.ts` for `/sports/*/register`. The form already has a honeypot and a unique constraint per tournament and student
- Admin CRUD forms for rankings, announcements, tournaments and champions (RLS policies already permit them)
