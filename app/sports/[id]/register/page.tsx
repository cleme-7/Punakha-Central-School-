import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';
import RegisterForm from './register-form';

export const metadata = { title: 'Tournament registration' };

export default async function Register({ params }: { params: { id: string } }) {
  const { data: t } = await supabaseServer().from('tournaments').select('id,title,sport,status').eq('id', params.id).maybeSingle();
  if (!t || t.status !== 'registration_open') notFound();
  return (
    <div className="max-w-xl">
      <h1 className="font-serif text-3xl font-bold text-brand">Register: {t.title}</h1>
      <p className="mt-1 text-gray-700">Sport: {t.sport}</p>
      <RegisterForm tournamentId={t.id} />
    </div>
  );
}
