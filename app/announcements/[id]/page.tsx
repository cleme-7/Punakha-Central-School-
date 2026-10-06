import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

type Props = { params: { id: string } };
const load = (id: string) => supabaseServer().from('announcements').select('*').eq('id', id).maybeSingle();

export async function generateMetadata({ params }: Props) {
  const { data } = await load(params.id);
  return { title: data?.title ?? 'Announcement', description: data?.summary ?? undefined, openGraph: { title: data?.title } };
}

export default async function Announcement({ params }: Props) {
  const { data: a } = await load(params.id);
  if (!a) notFound();
  return (
    <article className="max-w-2xl">
      <p className="text-sm text-gray-600">{a.category} · {a.published_on}</p>
      <h1 className="font-serif text-3xl font-bold text-brand">{a.title}</h1>
      <p className="mt-4 whitespace-pre-line">{a.body}</p>
      {a.attachments.length > 0 && (
        <section className="mt-6" aria-labelledby="att"><h2 id="att" className="font-semibold">Attachments</h2>
          <ul className="list-disc pl-5">{a.attachments.map((u: string) => <li key={u}><a className="text-brand underline" href={u}>{decodeURIComponent(u.split('/').pop() ?? u)}</a></li>)}</ul>
        </section>
      )}
    </article>
  );
}
