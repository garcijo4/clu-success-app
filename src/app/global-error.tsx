'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-[#14111C] p-4 text-[#F2F0F7]">
        <main className="mx-auto mt-12 max-w-md rounded-2xl border-2 border-[#FFC222] bg-[#1E1A2A] p-6 text-center">
          <h1 className="text-2xl font-semibold">The app could not finish loading</h1>
          <p className="mt-2 leading-relaxed text-[#B9B3C7]">
            Your saved work stays in this browser. Try loading the app again.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 min-h-[48px] rounded-full bg-[#FFC222] px-5 font-semibold text-[#3B2360]"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
