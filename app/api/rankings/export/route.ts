import { getRankings } from '@/lib/rankings';
import { csvResponse } from '@/lib/csv';

export async function GET(req: Request) {
  const { rows } = await getRankings(Object.fromEntries(new URL(req.url).searchParams));
  return csvResponse('rankings.csv',
    ['Rank', 'Student', 'Class', 'Section', 'Roll No', 'Total Marks', 'Percentage', 'Grade', 'Remarks'],
    rows.map((r) => [r.rank, r.display_name, r.grade, r.section, r.roll_no, r.total_marks, r.percentage, r.grade_letter, r.remarks]));
}
