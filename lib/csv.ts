const esc = (v: unknown) => {
  let s = String(v ?? '');
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
};

export function csvResponse(name: string, head: string[], rows: unknown[][]) {
  const body = [head, ...rows].map((r) => r.map(esc).join(',')).join('\n');
  return new Response(body, {
    headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="${name}"` },
  });
}
