export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-white text-zinc-900 dark:bg-black dark:text-zinc-50">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-[max(4rem,env(safe-area-inset-top))] text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>

        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-emerald-500">
          Hello World
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          MedSync
        </h1>
        <p className="mt-3 max-w-sm text-balance text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Your health, in sync. Track medications, appointments, and records —
          all from your phone.
        </p>

        <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
          <button
            type="button"
            className="h-12 w-full rounded-full bg-emerald-500 px-6 text-base font-medium text-white transition-colors hover:bg-emerald-600 active:bg-emerald-700"
          >
            Get started
          </button>
          <button
            type="button"
            className="h-12 w-full rounded-full border border-zinc-200 px-6 text-base font-medium transition-colors hover:bg-zinc-50 active:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:active:bg-zinc-800"
          >
            Learn more
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 text-center text-xs text-zinc-400 dark:text-zinc-600">
        Built with Next.js · Deployed on Vercel
      </footer>
    </main>
  );
}
