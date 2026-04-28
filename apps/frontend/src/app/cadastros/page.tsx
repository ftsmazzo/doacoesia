/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { axisOptions } from "@/lib/constants";
import { getErrorMessage } from "@/lib/http";
import type { DonationDocument, Donor, DonationStatus } from "@/lib/types";

function getApiBase() {
  return "/api";
}

export default function CadastrosPage() {
  const apiBase = useMemo(() => getApiBase(), []);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [createdDonationId, setCreatedDonationId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<DonationDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [donorForm, setDonorForm] = useState({
    donorType: "PJ",
    name: "",
    document: "",
    email: "",
    phone: "",
  });
  const [donationForm, setDonationForm] = useState<{
    donorId: string;
    title: string;
    description: string;
    targetAxis: string;
    proposedQuantity: string;
    status: DonationStatus;
  }>({
    donorId: "",
    title: "",
    description: "",
    targetAxis: axisOptions[0] ?? "",
    proposedQuantity: "",
    status: "SUBMITTED",
  });

  const fetchDonors = useCallback(async () => {
    const response = await fetch(`${apiBase}/donors`, { cache: "no-store" });
    if (!response.ok) throw new Error(await getErrorMessage(response, "Falha ao carregar doadores."));
    const payload = (await response.json()) as Donor[];
    setDonors(payload);
    if (!donationForm.donorId && payload[0]) {
      setDonationForm((prev) => ({ ...prev, donorId: payload[0].id }));
    }
  }, [apiBase, donationForm.donorId]);

  const fetchDocuments = useCallback(
    async (donationId: string) => {
      const response = await fetch(`${apiBase}/donations/${donationId}/documents`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(await getErrorMessage(response, "Falha ao carregar documentos."));
      }
      setDocuments((await response.json()) as DonationDocument[]);
    },
    [apiBase],
  );

  useEffect(() => {
    void fetchDonors().catch((err) =>
      setError(err instanceof Error ? err.message : "Erro ao carregar dados."),
    );
  }, [fetchDonors]);

  async function onDonorSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(`${apiBase}/donors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...donorForm,
          phone: donorForm.phone || undefined,
        }),
      });
      if (!response.ok) throw new Error(await getErrorMessage(response, "Não foi possível cadastrar doador."));
      setDonorForm({ donorType: "PJ", name: "", document: "", email: "", phone: "" });
      await fetchDonors();
      setMessage("Doador cadastrado com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar doador.");
    }
  }

  async function onDonationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
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
      if (!response.ok) throw new Error(await getErrorMessage(response, "Não foi possível cadastrar doação."));
      const payload = (await response.json()) as { id: string };
      setCreatedDonationId(payload.id);
      setDocuments([]);
      setDonationForm((prev) => ({
        ...prev,
        title: "",
        description: "",
        proposedQuantity: "",
      }));
      setMessage("Doação criada. Agora envie os anexos da proposta.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar doação.");
    }
  }

  async function onUploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!createdDonationId) return;
    const fileInput = event.currentTarget.querySelector<HTMLInputElement>("input[type=file]");
    const file = fileInput?.files?.[0];
    if (!file) {
      setError("Selecione um arquivo para upload.");
      return;
    }

    setUploading(true);
    setError(null);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(`${apiBase}/donations/${createdDonationId}/documents`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(await getErrorMessage(response, "Falha no upload do documento."));
      if (fileInput) fileInput.value = "";
      await fetchDocuments(createdDonationId);
      setMessage("Documento enviado com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no upload.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <AppShell
      title="Cadastros"
      subtitle="Cadastre doador, registre doação e anexe os documentos exigidos pelo edital."
    >
      {error ? <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">{error}</p> : null}
      {message ? <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p> : null}

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <h2 className="text-base font-semibold text-white">Cadastro de doador</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onDonorSubmit}>
          <label className="grid gap-1 text-sm text-slate-300">
            Tipo
            <select value={donorForm.donorType} onChange={(e) => setDonorForm((p) => ({ ...p, donorType: e.target.value as "PF" | "PJ" }))} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100">
              <option value="PF">Pessoa Física</option>
              <option value="PJ">Pessoa Jurídica</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm text-slate-300">
            Nome / Razão Social
            <input required value={donorForm.name} onChange={(e) => setDonorForm((p) => ({ ...p, name: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100" />
          </label>
          <label className="grid gap-1 text-sm text-slate-300">
            CPF/CNPJ
            <input required value={donorForm.document} onChange={(e) => setDonorForm((p) => ({ ...p, document: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100" />
          </label>
          <label className="grid gap-1 text-sm text-slate-300">
            E-mail
            <input required type="email" value={donorForm.email} onChange={(e) => setDonorForm((p) => ({ ...p, email: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100" />
          </label>
          <label className="grid gap-1 text-sm text-slate-300">
            Telefone
            <input value={donorForm.phone} onChange={(e) => setDonorForm((p) => ({ ...p, phone: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100" />
          </label>
          <button type="submit" className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white md:col-span-2 md:w-fit">
            Salvar doador
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <h2 className="text-base font-semibold text-white">Cadastro de doação</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onDonationSubmit}>
          <label className="grid gap-1 text-sm text-slate-300">
            Doador
            <select required value={donationForm.donorId} onChange={(e) => setDonationForm((p) => ({ ...p, donorId: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100">
              <option value="">Selecione</option>
              {donors.map((donor) => (
                <option key={donor.id} value={donor.id}>
                  {donor.name} - {donor.document}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm text-slate-300">
            Eixo
            <select required value={donationForm.targetAxis} onChange={(e) => setDonationForm((p) => ({ ...p, targetAxis: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100">
              {axisOptions.map((axis) => <option key={axis} value={axis}>{axis}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm text-slate-300 md:col-span-2">
            Título
            <input required value={donationForm.title} onChange={(e) => setDonationForm((p) => ({ ...p, title: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100" />
          </label>
          <label className="grid gap-1 text-sm text-slate-300 md:col-span-2">
            Descrição
            <textarea required rows={3} value={donationForm.description} onChange={(e) => setDonationForm((p) => ({ ...p, description: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100" />
          </label>
          <label className="grid gap-1 text-sm text-slate-300">
            Quantidade
            <input type="number" min={1} value={donationForm.proposedQuantity} onChange={(e) => setDonationForm((p) => ({ ...p, proposedQuantity: e.target.value }))} className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100" />
          </label>
          <button type="submit" className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white md:w-fit">
            Criar doação
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-5">
        <h2 className="text-base font-semibold text-white">Anexos da proposta (edital)</h2>
        <p className="mt-2 text-sm text-slate-300">
          Envie Ficha de inscrição, RG/CPF ou CNPJ, CND/CPEN e proposta detalhada.
        </p>
        <form className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center" onSubmit={onUploadFile}>
          <input type="file" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 sm:max-w-md" />
          <button disabled={!createdDonationId || uploading} type="submit" className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
            {uploading ? "Enviando..." : "Enviar documento"}
          </button>
        </form>
        {!createdDonationId ? (
          <p className="mt-3 text-xs text-slate-400">Crie uma doação antes de anexar documentos.</p>
        ) : null}
        <div className="mt-4 grid gap-2">
          {documents.map((doc) => (
            <div key={doc.id} className="rounded-lg border border-slate-800 bg-slate-800/50 px-3 py-2 text-sm text-slate-200">
              {doc.fileName} ({Math.ceil(doc.sizeBytes / 1024)} KB)
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
