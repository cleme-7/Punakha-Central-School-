import { supabaseServer } from '@/lib/supabase/server';
import { getRankings, type RankParams } from '@/lib/rankings';
import PrintButton from '@/components/print-button';

export const metadata = { title: 'Academic Rankings' };
export const dynamic = 'force-dynamic';
const medal = ['🥇', '🥈', '🥉'];
const uniq = (a: (string | number)[]) => Array.from(new Set(a.map(String)));

function Sel({ name, label, value, options, all = true }: { name: string; label: string; value?: string; options: string[]; all?: boolean }) {
  return (
    <label className="text-sm font-medium">{label}
      <select name={name} defaultValue={value ?? ''} className="mt-1 block w-full rounded border bg-white p-2">
        {all && <option value="">All</option>}
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </label>
  );
}

export default async function Rankings({ searchParams: p }: { searchParams: RankParams }) {
  const { exams, exam, rows, error } = await getRankings(p);
  const db = supabaseServer();
  const { data: classes } = await db.from('classes').select('grade,section').order('grade');
  const { data: toppers } = exam
    ? await db.from('ranking_board').select('subject,display_name,grade,section,percentage').eq('exam_id', exam.id).eq('rank', 1).not('subject', 'is', null)
    : { data: [] as any[] };
  const qs = new URLSearchParams(Object.entries({ year: exam?.academic_year, term: exam?.term, grade: p.grade, section: p.section, subject: p.subject, q: p.q }).filter(([, v]) => v) as [string, string][]);

  return (
    <>
      <h1 className="font-serif text-3xl font-bold text-brand">Academic Rankings</h1>
      <form method="get" className="no-print mt-4 grid grid-cols-2 gap-3 rounded border bg-white p-4 md:grid-cols-6">
        <Sel name="year" label="Academic year" value={exam?.academic_year} options={uniq(exams.map((e) => e.academic_year))} all={false} />
        <Sel name="term" label="Exam / term" value={exam?.term} options={uniq(exams.filter((e) => e.academic_year === exam?.academic_year).map((e) => e.term))} all={false} />
        <Sel name="grade" label="Class" value={p.grade} options={uniq((classes ?? []).map((c) => c.grade))} />
        <Sel name="section" label="Section" value={p.section} options={uniq((classes ?? []).map((c) => c.section))} />
        <Sel name="subject" label="Subject" value={p.subject} options={uniq((toppers ?? []).map((t) => t.subject))} />
        <label className="text-sm font-medium">Name or roll no.<input name="q" defaultValue={p.q} className="mt-1 block w-full rounded border p-2" /></label>
        <button className="col-span-2 rounded bg-brand px-4 py-2 font-semibold text-white md:col-span-1">Apply filters</button>
      </form>
      <div className="no-print mt-3 flex gap-3">
        <a href={`/api/rankings/export?${qs}`} className="rounded border border-brand px-3 py-2 text-sm text-brand">Download CSV</a>
        <PrintButton />
      </div>

      {error ? <p role="alert" className="mt-6 rounded border border-red-300 bg-red-50 p-4">Rankings could not be loaded. Try again shortly.</p>
        : rows.length === 0 ? <p className="mt-6 text-gray-600">No results match these filters. Clear a filter or choose another exam.</p>
        : (
        <div className="mt-6 overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Rankings for {exam?.term} {exam?.academic_year}</caption>
            <thead className="bg-slate-100"><tr>{['Rank', 'Student', 'Class', 'Section', 'Roll no.', 'Total marks', 'Percentage', 'Grade', 'Remarks'].map((h) => <th key={h} scope="col" className="p-3">{h}</th>)}</tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className={`border-t ${r.rank <= 3 ? 'bg-amber-50' : ''}`}>
                  <td className="p-3 font-semibold">{r.rank <= 3 && <span role="img" aria-label={`Rank ${r.rank} medal`}>{medal[r.rank - 1]} </span>}{r.rank}</td>
                  <td className="p-3">{r.display_name}</td><td className="p-3">{r.grade}</td><td className="p-3">{r.section}</td><td className="p-3">{r.roll_no}</td>
                  <td className="p-3">{r.total_marks}</td><td className="p-3">{Number(r.percentage).toFixed(1)}%</td><td className="p-3">{r.grade_letter}</td><td className="p-3">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!!toppers?.length && (
        <section className="mt-8" aria-labelledby="toppers">
          <h2 id="toppers" className="font-serif text-2xl font-bold">Subject toppers</h2>
          <ul className="mt-3 grid gap-3 md:grid-cols-3">
            {toppers.map((t, i) => <li key={i} className="rounded border bg-white p-4"><p className="font-semibold">{t.subject}</p><p>{t.display_name}, Class {t.grade}{t.section}</p><p className="text-sm text-gray-600">{Number(t.percentage).toFixed(1)}%</p></li>)}
          </ul>
        </section>
      )}
    </>
  );
}
