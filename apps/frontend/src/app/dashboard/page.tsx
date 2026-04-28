/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { donationStatusLabels } from "@/lib/constants";
import { getErrorMessage } from "@/lib/http";
import type { DashboardSummary, Donation, DonationListResponse } from "@/lib/types";

function getApiBase() {
  return "/api";
}

export default function DashboardPage() {
  const apiBase = useMemo(() => getApiBase(), []);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary>({
    status: { received: 0, underReview: 0, approved: 0, rejected: 0 },
    axis: [],
  });
  const [latest, setLatest] = useState<Donation[]>([]);

  const load = useCallback(async () => {
    setError(null);
    const [summaryRes, latestRes] = await Promise.all([
      fetch(`${apiBase}/donations/dashboard/summary`, { cache: "no-store" }),
      fetch(`${apiBase}/donations?page=1&pageSize=8`, { cache: "no-store" }),
    ]);
    if (!summaryRes.ok) {
      throw new Error(await getErrorMessage(summaryRes, "Falha ao carregar dashboard."));
    }
    if (!latestRes.ok) {
      throw new Error(await getErrorMessage(latestRes, "Falha ao carregar últimas doações."));
    }
    setSummary((await summaryRes.json()) as DashboardSummary);
    const listPayload = (await latestRes.json()) as DonationListResponse;
    setLatest(listPayload.data);
  }, [apiBase]);

  useEffect(() => {
    void load().catch((err) =>
      setError(err instanceof Error ? err.message : "Erro ao carregar dashboard."),
    );
  }, [load]);

  return (
    <AppShell
      title="Dashboard de doações"
      subtitle="Acompanhamento em tempo real do fluxo da comissão e dos eixos de atendimento."
    >
      {error ? (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <section className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-sm font-semibold text-white">Recebidas</h2>
          <p className="mt-3 text-sm text-slate-300">
            {summary.status.received} propostas recebidas
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-sm font-semibold text-white">Em análise</h2>
          <p className="mt-3 text-sm text-slate-300">
            {summary.status.underReview} propostas em análise
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-sm font-semibold text-white">Aprovadas</h2>
          <p className="mt-3 text-sm text-slate-300">
            {summary.status.approved} propostas aprovadas
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
          <h2 className="text-sm font-semibold text-white">Rejeitadas</h2>
          <p className="mt-3 text-sm text-slate-300">
            {summary.status.rejected} propostas rejeitadas
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <h2 className="text-base font-semibold text-white">Status por eixo de atendimento</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Eixo</th>
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Recebidas</th>
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Em análise</th>
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Aprovadas</th>
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Rejeitadas</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {summary.axis.map((axisRow) => (
                <tr key={axisRow.axis}>
                  <td className="border-b border-slate-800 px-3 py-2">{axisRow.axis}</td>
                  <td className="border-b border-slate-800 px-3 py-2">{axisRow.received}</td>
                  <td className="border-b border-slate-800 px-3 py-2">{axisRow.underReview}</td>
                  <td className="border-b border-slate-800 px-3 py-2">{axisRow.approved}</td>
                  <td className="border-b border-slate-800 px-3 py-2">{axisRow.rejected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <h2 className="text-base font-semibold text-white">Últimas doações</h2>
        <div className="mt-3 grid gap-3 sm:hidden">
          {latest.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-800 bg-slate-800/50 p-3">
              <p className="text-sm font-medium text-white">{item.title}</p>
              <p className="mt-1 text-xs text-slate-300">{item.targetAxis}</p>
              <p className="text-xs text-slate-400">{item.donor.name}</p>
              <p className="mt-1 text-xs text-cyan-300">
                {donationStatusLabels[item.status] ?? item.status}
              </p>
              <Link className="mt-2 inline-block text-xs text-cyan-300 underline" href={`/doacoes/${item.id}`}>
                Ver detalhes
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-3 hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[620px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Título</th>
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Eixo</th>
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Status</th>
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {latest.map((item) => (
                <tr key={item.id}>
                  <td className="border-b border-slate-800 px-3 py-2">{item.title}</td>
                  <td className="border-b border-slate-800 px-3 py-2">{item.targetAxis}</td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    {donationStatusLabels[item.status] ?? item.status}
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    <Link className="text-cyan-300 underline" href={`/doacoes/${item.id}`}>
                      Abrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
