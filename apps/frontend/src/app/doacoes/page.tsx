/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { axisOptions, donationStatusLabels, statusOptions } from "@/lib/constants";
import { getErrorMessage } from "@/lib/http";
import type { Donation, DonationListResponse } from "@/lib/types";

type StatusFilter = (typeof statusOptions)[number];

function getApiBase() {
  return "/api";
}

export default function DoacoesPage() {
  const apiBase = useMemo(() => getApiBase(), []);
  const [error, setError] = useState<string | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pageSize: 10, totalPages: 1 });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [axisFilter, setAxisFilter] = useState("");

  const fetchDonations = useCallback(
    async (page = 1) => {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(meta.pageSize),
      });
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (axisFilter) params.set("targetAxis", axisFilter);

      const response = await fetch(`${apiBase}/donations?${params.toString()}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Falha ao carregar doações."));
      }
      const payload = (await response.json()) as DonationListResponse;
      setDonations(payload.data);
      setMeta(payload.meta);
    },
    [apiBase, axisFilter, meta.pageSize, statusFilter],
  );

  useEffect(() => {
    void fetchDonations(1).catch((err) =>
      setError(err instanceof Error ? err.message : "Erro ao carregar doações."),
    );
  }, [fetchDonations]);

  return (
    <AppShell
      title="Doações"
      subtitle="Listagem de propostas para consulta e encaminhamento da comissão."
    >
      {error ? (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
          {error}
        </p>
      ) : null}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-white">Fila de doações</h2>
          <div className="flex flex-wrap gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as StatusFilter)} className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-100">
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL" ? "Todos os status" : donationStatusLabels[status] ?? status}
                </option>
              ))}
            </select>
            <select value={axisFilter} onChange={(e) => setAxisFilter(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-slate-100">
              <option value="">Todos os eixos</option>
              {axisOptions.map((axis) => (
                <option key={axis} value={axis}>
                  {axis}
                </option>
              ))}
            </select>
            <button onClick={() => void fetchDonations(1)} className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-600">
              Filtrar
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-slate-400">
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Título</th>
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Eixo</th>
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Doador</th>
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Status</th>
                <th className="border-b border-slate-800 px-3 py-2 font-medium">Ação</th>
              </tr>
            </thead>
            <tbody className="text-slate-200">
              {donations.map((item) => (
                <tr key={item.id}>
                  <td className="border-b border-slate-800 px-3 py-2">{item.title}</td>
                  <td className="border-b border-slate-800 px-3 py-2">{item.targetAxis}</td>
                  <td className="border-b border-slate-800 px-3 py-2">{item.donor.name}</td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    {donationStatusLabels[item.status] ?? item.status}
                  </td>
                  <td className="border-b border-slate-800 px-3 py-2">
                    <Link className="text-cyan-300 underline" href={`/doacoes/${item.id}`}>
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
          <span>{meta.total} registros</span>
          <div className="flex items-center gap-2">
            <button disabled={meta.page <= 1} onClick={() => void fetchDonations(meta.page - 1)} className="rounded border border-slate-700 px-2 py-1 disabled:opacity-40">
              Anterior
            </button>
            <span>
              Página {meta.page}/{meta.totalPages}
            </span>
            <button disabled={meta.page >= meta.totalPages} onClick={() => void fetchDonations(meta.page + 1)} className="rounded border border-slate-700 px-2 py-1 disabled:opacity-40">
              Próxima
            </button>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
