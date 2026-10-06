import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';

export const metadata = { title: 'Sports' };
export const dynamic = 'force-dynamic';

export default async function Sports() {
  const db = supabaseServer();
  const [t, c] = await Promise.all([
    db.from('tournaments').select('*').neq('status', 'completed').order('starts_on'),
    db.from('champions').select('*').order('year', { ascending: false }),
  ]);
  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-brand">Sports</h1>
      <section className="mt-6" aria-labelledby="tour">
        <h2 id="tour" className="font-serif text-2xl font-bold">Tournaments</h2>
        {t.error ? <p role="alert" className="mt-3 rounded border border-red-300 bg-red-50 p-4">Tournaments could not be loaded.</p>
          : !t.data?.length ? <p className="mt-3 text-gray-600">No tournaments are scheduled. Check back soon.</p>
          : <ul className="mt-3 grid gap-4 md:grid-cols-3">{t.data.map((x) => (
            <li key={x.id} className="rounded border bg-white p-4">
              <p className="text-sm text-gray-600">{x.sport} · {x.status.replace('_', ' ')}</p>
              <h3 className="font-serif text-lg font-bold">{x.title}</h3>
              <p className="mt-1 text-sm">{x.starts_on}{x.ends_on ? ` to ${x.ends_on}` : ''}<br />{x.venue}{x.register_by && <><br />Register by {x.register_by}</>}</p>
              {x.status === 'registration_open' && <Link href={`/sports/${x.id}/register`} className="mt-3 inline-block rounded bg-brand px-4 py-2 text-sm font-semibold text-white">Register</Link>}
            </li>))}</ul>}
      </section>
      <section className="mt-10" aria-labelledby="hall">
        <h2 id="hall" className="font-serif text-2xl font-bold">Hall of fame</h2>
        {!c.data?.length ? <p className="mt-3 text-gray-600">Champions will be listed here.</p>
          : <ul className="mt-3 grid gap-4 md:grid-cols-3">{c.data.map((x) => (
            <li key={x.id} className="rounded border bg-white p-4">
              {x.photo_url && <img src={x.photo_url} alt={`${x.team_or_individual}, ${x.sport} ${x.year}`} className="mb-3 h-40 w-full rounded object-cover" />}
              <p className="text-sm text-gray-600">{x.sport} · {x.year}</p>
              <h3 className="font-semibold">{x.team_or_individual}</h3><p>{x.achievement}</p>
            </li>))}</ul>}
      </section>
    </>
  );
}
