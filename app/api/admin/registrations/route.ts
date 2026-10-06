import { supabaseServer } from '@/lib/supabase/server';
import { csvResponse } from '@/lib/csv';

export async function GET() {
  // Row-level security returns rows to admins only.
  const { data } = await supabaseServer().from('registrations').select('*, tournaments(title)').order('created_at', { ascending: false });
  return csvResponse('registrations.csv',
    ['Tournament', 'Student', 'Class', 'Section', 'Roll No', 'Team', 'Guardian', 'Email', 'Emergency', 'Registered'],
    (data ?? []).map((r) => [r.tournaments?.title, r.student_name, r.grade, r.section, r.roll_no, r.team_name, r.guardian_contact, r.email, r.emergency_contact, r.created_at]));
}
