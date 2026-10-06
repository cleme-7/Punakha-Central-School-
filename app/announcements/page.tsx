import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';

export const metadata = { title: 'Announcements & Reports' };
export const dynamic = 'force-dynamic';
const cats = ['Exam', 'Holiday', 'Event', 'Urgent', 'Report', 'General'];

export default async function Announcements({ searchParams: sp }: { searchParams: { category?: string; q?: string; from?: string } }) {
  let q = supabaseServer().from('announcements').select('id,title,category,summary,published_on,pinned').order('published_on', { ascending: false });
  if (sp.category) q = q.eq('category', sp.category);
  if (sp.from) q = q.gte('published_on', sp.from);
  const s = sp.q?.replace(/[%,()*]/g, '').trim();
  if (s) q = q.or(`title.ilike.%${s}%,summary.ilike.%${s}%`);
  const { data, error } = await q;
  const top = (a: any) => Number(a.pinned || a.category === 'Urgent');
  const items = [...(data ?? [])].sort((a, b) => top(b) - top(a));

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-brand">Announcements & Reports</h1>
      <form method="get" className="mt-4 grid gap-3 rounded border bg-white p-4 md:grid-cols-4">
        <label className="text-sm font-medium">Search<input name="q" defaultValue={sp.q} className="mt-1 block w-full rounded border p-2" /></label>
        <label className="text-sm font-medium">Category
          <select name="category" defaultValue={sp.category ?? ''} className="mt-1 block w-full rounded border bg-white p-2"><option value="">All</option>{cats.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="text-sm font-medium">Published since<input type="date" name="from" defaultValue={sp.from} className="mt-1 block w-full rounded border p-2" /></label>
        <button className="self-end rounded bg-brand px-4 py-2 font-semibold text-white">Apply filters</button>
      </form>
      {error ? <p role="alert" className="mt-6 rounded border border-red-300 bg-red-50 p-4">Announcements could not be loaded. Try again shortly.</p>
        : items.length === 0 ? <p className="mt-6 text-gray-600">No announcements match. Clear the filters to see everything.</p>
        : <ul className="mt-6 space-y-3">{items.map((a) => (
          <li key={a.id} className={`rounded border bg-white p-4 ${top(a) ? 'border-l-4 border-l-brand' : ''}`}>
            <p className="text-sm text-gray-600">{a.pinned ? 'Pinned · ' : ''}{a.category} · {a.published_on}</p>
            <h2 className="font-serif text-xl font-bold"><Link href={`/announcements/${a.id}`} className="hover:underline">{a.title}</Link></h2>
            <p className="mt-1">{a.summary}</p>
          </li>))}</ul>}
    </>
  );
}
