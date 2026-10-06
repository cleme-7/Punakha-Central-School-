'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  ['Home', '/'], ['About', '/about'], ['Rankings', '/academics/rankings'], ['Announcements', '/announcements'],
  ['Sports', '/sports'], ['Admissions', '/admissions'], ['Faculty', '/faculty'], ['Events', '/events'],
  ['Gallery', '/gallery'], ['Contact', '/contact'], ['Portal', '/portal'], ['Admin', '/admin'],
] as const;

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return (
    <header className="no-print relative bg-brand text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-serif text-lg font-bold">Punakha Central School</Link>
        <button type="button" className="rounded border border-white/60 px-3 py-1 xl:hidden" aria-expanded={open} aria-controls="main-nav" onClick={() => setOpen(!open)}>
          {open ? 'Close menu' : 'Menu'}
        </button>
        <nav id="main-nav" aria-label="Main" className={`${open ? 'block' : 'hidden'} absolute left-0 right-0 top-full z-10 bg-brand-dark p-4 xl:static xl:block xl:bg-transparent xl:p-0`}>
          <ul className="flex flex-col gap-1 xl:flex-row xl:gap-3">
            {links.map(([label, href]) => (
              <li key={href}>
                <Link href={href} onClick={() => setOpen(false)} aria-current={path === href ? 'page' : undefined}
                  className={`block rounded px-2 py-1 text-sm hover:underline ${path === href ? 'bg-white/20 font-semibold' : ''}`}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
