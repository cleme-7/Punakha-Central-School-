'use client';
import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

export default function Login() {
  const [msg, setMsg] = useState('');
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error } = await supabase.auth.signInWithPassword({ email: String(f.get('email')), password: String(f.get('password')) });
    if (error) return setMsg('Email or password is incorrect.');
    const next = new URLSearchParams(location.search).get('next') ?? '/portal';
    location.assign(next.startsWith('/') && !next.startsWith('//') ? next : '/portal');
  }
  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4">
      <h1 className="font-serif text-3xl font-bold text-brand">Sign in</h1>
      {msg && <p role="alert" className="rounded border border-red-300 bg-red-50 p-3">{msg}</p>}
      <label className="block text-sm font-medium">Email<input name="email" type="email" required autoComplete="username" className="mt-1 block w-full rounded border p-2" /></label>
      <label className="block text-sm font-medium">Password<input name="password" type="password" required autoComplete="current-password" className="mt-1 block w-full rounded border p-2" /></label>
      <button className="rounded bg-brand px-5 py-2 font-semibold text-white">Sign in</button>
    </form>
  );
}
