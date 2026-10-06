'use client';
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div role="alert" className="rounded border border-red-300 bg-red-50 p-6">
      <p>This page could not load. Check your connection and try again.</p>
      <button type="button" onClick={reset} className="mt-3 rounded bg-brand px-4 py-2 text-white">Try again</button>
    </div>
  );
}
