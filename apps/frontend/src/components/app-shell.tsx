import { ReactNode } from "react";
import { AppNav } from "./app-nav";

type Props = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

export function AppShell({ children, title, subtitle }: Props) {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300">
                doacoesIA
              </span>
              <p className="mt-1 truncate text-sm font-semibold text-slate-100">
                Gestão inteligente de doações
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
              MVP ativo
            </span>
          </div>
          <AppNav />
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-900 p-4 sm:p-6">
          <h1 className="break-words text-2xl font-bold leading-tight text-white sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-2 max-w-3xl break-words text-sm text-slate-300 sm:text-base">
              {subtitle}
            </p>
          ) : null}
        </section>
        {children}
      </main>
    </div>
  );
}
