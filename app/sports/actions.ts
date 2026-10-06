'use server';
import { supabaseServer } from '@/lib/supabase/server';
import { registrationSchema } from '@/lib/validators';

export type FormState = { ok: boolean; message?: string; errors?: Record<string, string[] | undefined> };

export async function registerAction(_: FormState, fd: FormData): Promise<FormState> {
  const parsed = registrationSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { ok: false, errors: parsed.error.flatten().fieldErrors };
  const { website, ...row } = parsed.data;
  if (website) return { ok: true, message: 'Registration received.' };
  const { error } = await supabaseServer().from('registrations').insert({ ...row, team_name: row.team_name || null, consent: true });
  if (error) return { ok: false, message: error.code === '23505' ? 'This student is already registered for this tournament.' : 'Registration could not be saved. Check that registration is still open and try again.' };
  return { ok: true, message: 'Registration received. The sports office will confirm by email.' };
}
