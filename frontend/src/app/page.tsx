export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-sm">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 mb-6">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Frontend Foundation Active
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
          Dead Infrastructure Mapper
        </h1>

        <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
          Clean project foundation is successfully initialized. Next.js, TypeScript, and Tailwind CSS are active.
        </p>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-mono">Frontend</span>
            <span className="text-sm font-semibold text-emerald-400">Ready</span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-mono">Backend</span>
            <span className="text-sm font-semibold text-sky-400">FastAPI</span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-mono">Database</span>
            <span className="text-sm font-semibold text-amber-400">PostgreSQL</span>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
            <span className="text-xs text-slate-500 uppercase tracking-wider block font-mono">AI Module</span>
            <span className="text-sm font-semibold text-purple-400">Vision</span>
          </div>
        </div>
      </div>
    </main>
  );
}
