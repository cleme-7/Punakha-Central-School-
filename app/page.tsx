import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';

const quick = [['Rankings', '/academics/rankings'], ['Announcements', '/announcements'], ['Sports', '/sports'], ['Admissions', '/admissions'], ['Portal login', '/portal']];

export default async function Home() {
  const { data: notices } = await supabaseServer().from('announcements').select('id,title,category,published_on')
    .order('pinned', { ascending: false }).order('published_on', { ascending: false }).limit(5);
  return (
    <>
      <section className="rounded-xl bg-brand p-8 text-white md:p-12">
        <h1 className="font-serif text-3xl font-bold md:text-4xl">Punakha Central School</h1>
        <p className="mt-3 max-w-xl">Learning, character and community in the Punakha valley.</p>
        <Link href="/admissions" className="mt-6 inline-block rounded bg-gold px-5 py-2 font-semibold text-gray-900">Apply for admission</Link>
      </section>
      <nav aria-label="Quick links" className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        {quick.map(([l, h]) => <Link key={h} href={h} className="rounded border bg-white p-4 text-center font-medium text-brand hover:border-brand">{l}</Link>)}
      </nav>
      <section className="mt-8" aria-labelledby="latest">
        <h2 id="latest" className="font-serif text-2xl font-bold">Latest notices</h2>
        {notices?.length ? (
          <ul className="mt-3 divide-y rounded border bg-white">
            {notices.map((n) => (
              <li key={n.id}><Link href={`/announcements/${n.id}`} className="flex justify-between gap-4 p-3 hover:bg-slate-50"><span>{n.title}</span><span className="text-sm text-gray-600">{n.category} · {n.published_on}</span></Link></li>
            ))}
          </ul>
        ) : <p className="mt-3 text-gray-600">No notices yet. New announcements appear here.</p>}
      </section>
    </>
  );
}
