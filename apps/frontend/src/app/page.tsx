export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center gap-8 px-4 py-10 sm:px-6">
        <span className="w-fit rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-300">
          doacoesIA - MVP
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          Plataforma inteligente para gestão de doações da assistência social
        </h1>
        <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
          Frontend mobile-first já preparado para operar com backend separado,
          deploy em EasyPanel e migrações automáticas no startup.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="font-semibold text-cyan-300">Frontend</h2>
            <p className="mt-1 text-sm text-slate-300">
              Next.js 16 com estrutura responsiva para jornada do doador e
              backoffice.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="font-semibold text-cyan-300">Backend</h2>
            <p className="mt-1 text-sm text-slate-300">
              NestJS + Prisma com endpoint de saúde em{" "}
              <code className="text-cyan-200">/api/health</code>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
