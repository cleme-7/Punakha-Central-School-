'use client';
export default function PrintButton() {
  return <button type="button" onClick={() => window.print()} className="rounded border border-brand px-3 py-2 text-sm text-brand">Print or save as PDF</button>;
}
