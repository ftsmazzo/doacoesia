"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

type Donor = {
  id: string;
  name: string;
  donorType: "PF" | "PJ";
  document: string;
};

type Donation = {
  id: string;
  title: string;
  targetAxis: string;
  status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "COMPLETED";
  donor: Donor;
};

type DonationListResponse = {
  data: Donation[];
  meta: { total: number; page: number; pageSize: number; totalPages: number };
};

const axisOptions = [
  "Crianças e Adolescentes",
  "Pessoa Idosa",
  "Pessoas com Deficiência",
  "Pessoas em Situação de Rua",
  "Mulheres em Situação de Violência",
  "Jovens em processo de saída das ruas",
  "Calamidade Pública e Emergências",
];

const statusOptions = ["ALL", "DRAFT", "SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED", "COMPLETED"] as const;
type StatusFilter = (typeof statusOptions)[number];

function getApiBase() {
  return "/api";
}

async function getErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(payload.message)) {
      return payload.message.join(" | ");
    }
    if (typeof payload.message === "string") {
      return payload.message;
    }
  } catch {
    // noop
  }
  return `${fallback} (HTTP ${response.status})`;
}

export default function Home() {
  const apiBase = useMemo(() => getApiBase(), []);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pageSize: 10, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [axisFilter, setAxisFilter] = useState("");
  const [donorForm, setDonorForm] = useState({
    donorType: "PJ",
    name: "",
    document: "",
    email: "",
    phone: "",
  });
  const [donationForm, setDonationForm] = useState({
    donorId: "",
    title: "",
    description: "",
    targetAxis: axisOptions[0],
    proposedQuantity: "",
    status: "SUBMITTED",
  });

  const fetchDonors = useCallback(async () => {
    const response = await fetch(`${apiBase}/donors`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Falha ao carregar doadores."));
    }
    const data = (await response.json()) as Donor[];
    setDonors(data);
    if (!donationForm.donorId && data[0]) {
      setDonationForm((prev) => ({ ...prev, donorId: data[0].id }));
    }
  }, [apiBase, donationForm.donorId]);

  const fetchDonations = useCallback(async (page = 1) => {
    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(meta.pageSize),
    });
    if (statusFilter !== "ALL") query.set("status", statusFilter);
    if (axisFilter) query.set("targetAxis", axisFilter);

    const response = await fetch(`${apiBase}/donations?${query.toString()}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(await getErrorMessage(response, "Falha ao carregar doações."));
    }
    const payload = (await response.json()) as DonationListResponse;
    setDonations(payload.data);
    setMeta(payload.meta);
  }, [apiBase, axisFilter, meta.pageSize, statusFilter]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchDonors(), fetchDonations(1)]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [fetchDonations, fetchDonors]);

  async function onDonorSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`${apiBase}/donors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...donorForm,
          phone: donorForm.phone || undefined,
        }),
      });
      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Não foi possível salvar o doador."));
      }
      setDonorForm({ donorType: "PJ", name: "", document: "", email: "", phone: "" });
      await fetchDonors();
      setMessage("Doador cadastrado com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar doador.");
    }
  }

  async function onDonationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const response = await fetch(`${apiBase}/donations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorId: donationForm.donorId,
          title: donationForm.title,
          description: donationForm.description,
          targetAxis: donationForm.targetAxis,
          proposedQuantity: donationForm.proposedQuantity
            ? Number(donationForm.proposedQuantity)
            : undefined,
          status: donationForm.status,
        }),
      });
      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Não foi possível cadastrar a doação."));
      }
      setDonationForm((prev) => ({
        ...prev,
        title: "",
        description: "",
        proposedQuantity: "",
      }));
      await fetchDonations(1);
      setMessage("Doação cadastrada com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar doação.");
    }
  }

  async function applyFilters() {
    setLoading(true);
    try {
      await fetchDonations(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao aplicar filtros.");
    } finally {
      setLoading(false);
    }
  }

  function statusLabel(status: Donation["status"]) {
    return (
      {
        DRAFT: "Rascunho",
        SUBMITTED: "Enviada",
        UNDER_REVIEW: "Em análise",
        APPROVED: "Aprovada",
        REJECTED: "Rejeitada",
        COMPLETED: "Concluída",
      }[status] ?? status
    );
  }

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
            <p className="mt-3 text-sm text-slate-300">{meta.total} propostas recebidas</p>
            <p className="text-sm text-slate-300">{donors.length} doadores cadastrados</p>
            <p className="text-sm text-slate-300">Página {meta.page} de {meta.totalPages}</p>
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

        {error && <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
        {message && <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}

        <section id="cadastro" className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <h2 className="text-base font-semibold text-white">Cadastro rápido de doador</h2>
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onDonorSubmit}>
            <label className="grid gap-1 text-sm text-slate-300">
              Tipo de doador
              <select
                value={donorForm.donorType}
                onChange={(event) =>
                  setDonorForm((prev) => ({ ...prev, donorType: event.target.value as "PF" | "PJ" }))
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              >
                <option value="PF">Pessoa Física</option>
                <option value="PJ">Pessoa Jurídica</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm text-slate-300">
              Nome / Razão Social
              <input
                type="text"
                placeholder="Ex.: Empresa Exemplo LTDA"
                required
                value={donorForm.name}
                onChange={(event) => setDonorForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-300">
              CPF/CNPJ
              <input
                type="text"
                placeholder="00.000.000/0001-00"
                required
                value={donorForm.document}
                onChange={(event) => setDonorForm((prev) => ({ ...prev, document: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-300">
              E-mail
              <input
                type="email"
                placeholder="contato@empresa.com"
                required
                value={donorForm.email}
                onChange={(event) => setDonorForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-300">
              Telefone
              <input
                type="tel"
                placeholder="(16) 99999-9999"
                value={donorForm.phone}
                onChange={(event) => setDonorForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </label>
            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 md:col-span-2 md:w-fit"
            >
              Salvar cadastro
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <h2 className="text-base font-semibold text-white">Nova doação</h2>
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onDonationSubmit}>
            <label className="grid gap-1 text-sm text-slate-300">
              Doador
              <select
                required
                value={donationForm.donorId}
                onChange={(event) => setDonationForm((prev) => ({ ...prev, donorId: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              >
                <option value="">Selecione um doador</option>
                {donors.map((donor) => (
                  <option key={donor.id} value={donor.id}>
                    {donor.name} - {donor.document}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm text-slate-300">
              Eixo de destinação
              <select
                required
                value={donationForm.targetAxis}
                onChange={(event) => setDonationForm((prev) => ({ ...prev, targetAxis: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              >
                {axisOptions.map((axis) => (
                  <option key={axis} value={axis}>{axis}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm text-slate-300 md:col-span-2">
              Título
              <input
                type="text"
                required
                value={donationForm.title}
                onChange={(event) => setDonationForm((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-300 md:col-span-2">
              Descrição
              <textarea
                required
                rows={3}
                value={donationForm.description}
                onChange={(event) => setDonationForm((prev) => ({ ...prev, description: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-300">
              Quantidade (opcional)
              <input
                type="number"
                min={1}
                value={donationForm.proposedQuantity}
                onChange={(event) => setDonationForm((prev) => ({ ...prev, proposedQuantity: event.target.value }))}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              />
            </label>
            <label className="grid gap-1 text-sm text-slate-300">
              Status inicial
              <select
                value={donationForm.status}
                onChange={(event) =>
                  setDonationForm((prev) => ({ ...prev, status: event.target.value as Donation["status"] }))
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
              >
                <option value="SUBMITTED">Enviada</option>
                <option value="UNDER_REVIEW">Em análise</option>
                <option value="APPROVED">Aprovada</option>
              </select>
            </label>
            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 md:col-span-2 md:w-fit"
            >
              Cadastrar doação
            </button>
          </form>
        </section>

        <section id="doacoes" className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white">Fila de doações</h2>
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-100"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "ALL" ? "Todos os status" : statusLabel(status as Donation["status"])}
                  </option>
                ))}
              </select>
              <select
                value={axisFilter}
                onChange={(event) => setAxisFilter(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-100"
              >
                <option value="">Todos os eixos</option>
                {axisOptions.map((axis) => (
                  <option key={axis} value={axis}>{axis}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={applyFilters}
                className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-600"
              >
                Filtrar
              </button>
            </div>
          </div>
          <div className="mt-3 grid gap-3 sm:hidden">
            {donations.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-800 bg-slate-800/50 p-3">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="mt-1 text-xs text-slate-300">{item.targetAxis}</p>
                <p className="text-xs text-slate-400">{item.donor.name}</p>
                <span className="mt-2 inline-flex rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                  {statusLabel(item.status)}
                </span>
              </article>
            ))}
            {!loading && donations.length === 0 && (
              <p className="text-sm text-slate-400">Nenhuma doação encontrada.</p>
            )}
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
                {donations.map((item) => (
                  <tr key={item.id}>
                    <td className="border-b border-slate-800 px-3 py-2">{item.title}</td>
                    <td className="border-b border-slate-800 px-3 py-2">{item.targetAxis}</td>
                    <td className="border-b border-slate-800 px-3 py-2">
                      <span className="inline-flex rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-300">
                        {statusLabel(item.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{meta.total} registros</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={meta.page <= 1 || loading}
                onClick={() => void fetchDonations(meta.page - 1)}
                className="rounded border border-slate-700 px-2 py-1 disabled:opacity-40"
              >
                Anterior
              </button>
              <span>Página {meta.page}/{meta.totalPages}</span>
              <button
                type="button"
                disabled={meta.page >= meta.totalPages || loading}
                onClick={() => void fetchDonations(meta.page + 1)}
                className="rounded border border-slate-700 px-2 py-1 disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
