/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { donationStatusLabels } from "@/lib/constants";
import { getErrorMessage } from "@/lib/http";
import type { Donation, DonationDocument, DonationStatus } from "@/lib/types";

function getApiBase() {
  return "/api";
}

export default function DonationDetailPage() {
  const params = useParams<{ id: string }>();
  const donationId = params.id;
  const apiBase = useMemo(() => getApiBase(), []);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [donation, setDonation] = useState<Donation | null>(null);
  const [documents, setDocuments] = useState<DonationDocument[]>([]);

  const load = useCallback(async () => {
    const [donationRes, docsRes] = await Promise.all([
      fetch(`${apiBase}/donations/${donationId}`, { cache: "no-store" }),
      fetch(`${apiBase}/donations/${donationId}/documents`, { cache: "no-store" }),
    ]);
    if (!donationRes.ok) throw new Error(await getErrorMessage(donationRes, "Falha ao carregar doação."));
    if (!docsRes.ok) throw new Error(await getErrorMessage(docsRes, "Falha ao carregar documentos."));
    setDonation((await donationRes.json()) as Donation);
    setDocuments((await docsRes.json()) as DonationDocument[]);
  }, [apiBase, donationId]);

  useEffect(() => {
    void load().catch((err) =>
      setError(err instanceof Error ? err.message : "Erro ao carregar detalhes."),
    );
  }, [load]);

  async function updateStatus(status: DonationStatus) {
    setError(null);
    setMessage(null);
    const response = await fetch(`${apiBase}/donations/${donationId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      setError(await getErrorMessage(response, "Falha ao atualizar status."));
      return;
    }
    setMessage("Status atualizado.");
    await load();
  }

  async function openDocument(documentId: string) {
    const response = await fetch(`${apiBase}/donations/documents/${documentId}/access-url`, {
      cache: "no-store",
    });
    if (!response.ok) {
      setError(await getErrorMessage(response, "Falha ao gerar link do documento."));
      return;
    }
    const payload = (await response.json()) as { url: string };
    window.open(payload.url, "_blank", "noopener,noreferrer");
  }

  return (
    <AppShell title="Detalhes da doação" subtitle="Análise completa da proposta e anexos enviados pelo proponente.">
      {error ? <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
      {message ? <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p> : null}

      {!donation ? (
        <p className="text-sm text-slate-300">Carregando...</p>
      ) : (
        <>
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-white">{donation.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{donation.description}</p>
            <div className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
              <p><strong className="text-slate-100">Eixo:</strong> {donation.targetAxis}</p>
              <p><strong className="text-slate-100">Status:</strong> {donationStatusLabels[donation.status] ?? donation.status}</p>
              <p><strong className="text-slate-100">Doador:</strong> {donation.donor.name}</p>
              <p><strong className="text-slate-100">Documento:</strong> {donation.donor.document}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <h3 className="text-base font-semibold text-white">Ações da comissão</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => void updateStatus("UNDER_REVIEW")} className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200">
                Marcar em análise
              </button>
              <button onClick={() => void updateStatus("APPROVED")} className="rounded-lg border border-emerald-600/50 bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
                Aprovar
              </button>
              <button onClick={() => void updateStatus("REJECTED")} className="rounded-lg border border-red-600/50 bg-red-500/10 px-3 py-1.5 text-sm text-red-300">
                Rejeitar
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
            <h3 className="text-base font-semibold text-white">Documentos anexados</h3>
            <div className="mt-3 grid gap-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-800 bg-slate-800/50 px-3 py-2">
                  <div>
                    <p className="text-sm text-slate-200">{doc.fileName}</p>
                    <p className="text-xs text-slate-400">{Math.ceil(doc.sizeBytes / 1024)} KB</p>
                  </div>
                  <button onClick={() => void openDocument(doc.id)} className="rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white">
                    Abrir
                  </button>
                </div>
              ))}
              {documents.length === 0 ? (
                <p className="text-sm text-slate-400">Nenhum documento anexado.</p>
              ) : null}
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
