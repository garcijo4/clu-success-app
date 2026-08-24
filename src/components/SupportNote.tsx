const MAILTO =
  'mailto:jgarcia@callutheran.edu?subject=College%20Success%20App%20%E2%80%94%20issue%20report';

/** Where students go when the app itself misbehaves. */
export default function SupportNote() {
  return (
    <a
      href={MAILTO}
      className="mb-4 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4"
    >
      <span
        aria-hidden="true"
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-clu-gold"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-clu-purple" fill="none">
          <rect
            x="3"
            y="5"
            width="18"
            height="14"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path
            d="m3.5 6.5 8.5 6 8.5-6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="min-w-0">
        <span className="block font-semibold">Having trouble with the app?</span>
        <span className="block text-sm text-body">
          Email Dr. John Garcia — jgarcia@callutheran.edu
        </span>
      </span>
    </a>
  );
}
