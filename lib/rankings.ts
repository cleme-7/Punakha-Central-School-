import { supabaseServer } from '@/lib/supabase/server';

export type RankParams = { year?: string; term?: string; grade?: string; section?: string; subject?: string; q?: string };

export async function getRankings(p: RankParams) {
  const db = supabaseServer();
  const { data: exams } = await db.from('exams').select('id,academic_year,term').order('held_on', { ascending: false });
  const exam = exams?.find((e) => e.academic_year === p.year && (!p.term || e.term === p.term)) ?? exams?.[0];
  if (!exam) return { exams: [], exam: null, rows: [], error: null };
  let q = db.from('ranking_board').select('*').eq('exam_id', exam.id).order('rank').order('roll_no').limit(500);
  if (p.grade) q = q.eq('grade', parseInt(p.grade) || 0);
  if (p.section) q = q.eq('section', p.section);
  q = p.subject ? q.eq('subject', p.subject) : q.is('subject', null);
  const s = p.q?.replace(/[%,()*]/g, '').trim();
  if (s) q = q.or(`display_name.ilike.%${s}%,roll_no.ilike.%${s}%`);
  const { data, error } = await q;
  return { exams: exams ?? [], exam, rows: data ?? [], error };
}
