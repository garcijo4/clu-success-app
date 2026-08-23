import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 text-center">
      <h1 className="font-display text-2xl font-semibold">That page is not here</h1>
      <p className="mt-2 text-body">Choose a chapter from the home page and keep going.</p>
      <Link
        href="/"
        className="mt-5 flex min-h-[48px] items-center justify-center rounded-full bg-clu-gold px-5 font-semibold text-clu-purple"
      >
        Back to home
      </Link>
    </div>
  );
}
