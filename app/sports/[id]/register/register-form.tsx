'use client';
import { useFormState, useFormStatus } from 'react-dom';
import { registerAction, type FormState } from '@/app/sports/actions';

const fields = [
  ['student_name', 'Student name', 'text'], ['grade', 'Class (1 to 12)', 'number'], ['section', 'Section', 'text'], ['roll_no', 'Roll number', 'text'],
  ['team_name', 'Team name (if any)', 'text'], ['guardian_contact', 'Guardian phone', 'tel'], ['email', 'Email', 'email'], ['emergency_contact', 'Emergency phone', 'tel'],
] as const;

function Submit() {
  const { pending } = useFormStatus();
  return <button disabled={pending} className="rounded bg-brand px-5 py-2 font-semibold text-white disabled:opacity-60">{pending ? 'Sending…' : 'Submit registration'}</button>;
}

export default function RegisterForm({ tournamentId }: { tournamentId: string }) {
  const [s, action] = useFormState<FormState, FormData>(registerAction, { ok: false });
  if (s.ok) return <p role="status" className="mt-6 rounded border border-green-400 bg-green-50 p-4">{s.message}</p>;
  const err = (n: string) => s.errors?.[n]?.[0];
  return (
    <form action={action} noValidate className="mt-6 space-y-4">
      {s.message && <p role="alert" className="rounded border border-red-300 bg-red-50 p-3">{s.message}</p>}
      <input type="hidden" name="tournament_id" value={tournamentId} />
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {fields.map(([n, label, type]) => (
        <div key={n}>
          <label htmlFor={n} className="block text-sm font-medium">{label}</label>
          <input id={n} name={n} type={type} required={n !== 'team_name'} aria-invalid={!!err(n)} aria-describedby={err(n) ? `${n}-e` : undefined} className="mt-1 block w-full rounded border p-2" />
          {err(n) && <p id={`${n}-e`} className="mt-1 text-sm text-red-700">{err(n)}</p>}
        </div>
      ))}
      <div>
        <label className="flex gap-2 text-sm"><input type="checkbox" name="consent" aria-describedby="consent-e" className="mt-1" />I am the student&apos;s guardian and consent to participation.</label>
        {err('consent') && <p id="consent-e" className="mt-1 text-sm text-red-700">{err('consent')}</p>}
      </div>
      <Submit />
    </form>
  );
}
