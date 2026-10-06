import { redirect } from 'next/navigation';
import { supabaseServer } from '@/lib/supabase/server';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const db = supabaseServer();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect('/login?next=/admin');
  const { data: me } = await db.from('profiles').select('role').eq('id', user.id).single();
  if (!me || !['admin', 'teacher'].includes(me.role)) redirect('/');
  return <><h1 className="font-serif text-3xl font-bold text-brand">Admin dashboard</h1><p className="text-sm text-gray-600">Signed in as {me.role}</p>{children}</>;
}
