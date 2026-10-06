import { supabaseServer } from '@/lib/supabase/server';

export const metadata = { title: 'Admin Dashboard' };
export const dynamic = 'force-dynamic';

export default async function Admin() {
  const { data, error } = await supabaseServer().from('registrations').select('*, tournaments(title)').order('created_at', { ascending: false }).limit(100);
  return (
    <section className="mt-6" aria-labelledby="regs">
      <div className="flex items-center justify-between">
        <h2 id="regs" className="font-serif text-2xl font-bold">Tournament registrations</h2>
        <a href="/api/admin/registrations" className="rounded border border-brand px-3 py-2 text-sm text-brand">Download CSV</a>
      </div>
      {error ? <p role="alert" className="mt-3 rounded border border-red-300 bg-red-50 p-4">Registrations could not be loaded.</p>
        : !data?.length ? <p className="mt-3 text-gray-600">No registrations yet. Entries from the Sports page appear here (admins only).</p>
        : <div className="mt-3 overflow-x-auto rounded border bg-white"><table className="w-full text-left text-sm">
          <thead className="bg-slate-100"><tr>{['Tournament', 'Student', 'Class', 'Roll no.', 'Team', 'Guardian', 'Email'].map((h) => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
          <tbody>{data.map((r) => <tr key={r.id} className="border-t"><td className="p-3">{r.tournaments?.title}</td><td className="p-3">{r.student_name}</td><td className="p-3">{r.grade}{r.section}</td><td className="p-3">{r.roll_no}</td><td className="p-3">{r.team_name}</td><td className="p-3">{r.guardian_contact}</td><td className="p-3">{r.email}</td></tr>)}</tbody>
        </table></div>}
    </section>
  );
}
