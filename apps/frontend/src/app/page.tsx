export default function Home() {
  return (
    <div className="min-h-screen">
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
          <nav className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 text-sm text-slate-300">
            <a className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-slate-800" href="#dashboard">Dashboard</a>
            <a className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-slate-800" href="#cadastro">Cadastro</a>
            <a className="shrink-0 rounded-lg px-3 py-1.5 hover:bg-slate-800" href="#doacoes">Doações</a>
          </nav>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-4 sm:px-6 sm:py-6">
        <section className="rounded-2xl border border-slate-800 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-900 p-4 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            MVP pronto para evolução
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-4xl">
            Plataforma moderna, fluida e mobile-first para assistência social
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-300 sm:text-base">
            Estrutura preparada para doador, comissão e gestão, com backend em
            NestJS + Prisma e deploy automatizado em EasyPanel.
          </p>
        </section>

        <section id="dashboard" className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="text-sm font-semibold text-white">Resumo operacional</h2>
            <p className="mt-3 text-sm text-slate-300">98 propostas recebidas</p>
            <p className="text-sm text-slate-300">24 em análise</p>
            <p className="text-sm text-slate-300">61 aprovadas</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <h2 className="text-sm font-semibold text-white">Eixo prioritário</h2>
            <p className="mt-3 text-sm text-slate-300">Pessoas idosas</p>
            <p className="text-sm text-slate-300">Maior demanda por mobilidade e acessibilidade.</p>
          </article>
          <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4 md:col-span-2 xl:col-span-1">
            <h2 className="text-sm font-semibold text-white">Status da API</h2>
            <p className="mt-3 text-sm text-slate-300">
              Endpoint de saúde disponível em{" "}
              <code className="rounded bg-slate-800 px-1 py-0.5 text-cyan-300">/api/health</code>.
            </p>
          </article>
        </section>

        <section id="cadastro" className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <h2 className="text-base font-semibold text-white">Cadastro rápido de doador</h2>
          <form className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1 text-sm text-slate-300">
              Nome / Razão Social
              <input
                type="text"
                placeholder="Ex.: Empresa Exemplo LTDA"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-300">
              CPF/CNPJ
              <input
                type="text"
                placeholder="00.000.000/0001-00"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-300">
              E-mail
              <input
                type="email"
                placeholder="contato@empresa.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-300">
              Telefone
              <input
                type="tel"
                placeholder="(16) 99999-9999"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </label>
            <button
              type="button"
              className="mt-1 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 md:col-span-2 md:w-fit"
            >
              Salvar cadastro
            </button>
          </form>
        </section>

        <section id="doacoes" className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <h2 className="text-base font-semibold text-white">Fila de doações</h2>
          <div className="mt-3 grid gap-3 sm:hidden">
            <article className="rounded-xl border border-slate-800 bg-slate-800/50 p-3">
              <p className="text-sm font-medium text-white">Kits de higiene</p>
              <p className="mt-1 text-xs text-slate-300">Pessoas em situação de rua</p>
              <span className="mt-2 inline-flex rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">Em análise</span>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-800/50 p-3">
              <p className="text-sm font-medium text-white">Cadeiras de rodas</p>
              <p className="mt-1 text-xs text-slate-300">Pessoa idosa</p>
              <span className="mt-2 inline-flex rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">Aprovada</span>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-800/50 p-3">
              <p className="text-sm font-medium text-white">Reforma de espaço</p>
              <p className="mt-1 text-xs text-slate-300">Crianças e adolescentes</p>
              <span className="mt-2 inline-flex rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300">Enviada</span>
            </article>
          </div>
          <div className="mt-3 hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[540px] border-collapse text-sm">
              <thead>
                <tr className="text-left text-slate-400">
                  <th className="border-b border-slate-800 px-3 py-2 font-medium">Título</th>
                  <th className="border-b border-slate-800 px-3 py-2 font-medium">Eixo</th>
                  <th className="border-b border-slate-800 px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-200">
                <tr>
                  <td className="border-b border-slate-800 px-3 py-2">Kits de higiene</td>
                  <td className="border-b border-slate-800 px-3 py-2">Pessoas em situação de rua</td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    <span className="inline-flex rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">Em análise</span>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-slate-800 px-3 py-2">Cadeiras de rodas</td>
                  <td className="border-b border-slate-800 px-3 py-2">Pessoa idosa</td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    <span className="inline-flex rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">Aprovada</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2">Reforma de espaço</td>
                  <td className="px-3 py-2">Crianças e adolescentes</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-semibold text-blue-300">Enviada</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
