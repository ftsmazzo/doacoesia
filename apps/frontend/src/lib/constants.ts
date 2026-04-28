export const axisOptions = [
  "Crianças e Adolescentes",
  "Pessoa Idosa",
  "Pessoas com Deficiência",
  "Pessoas em Situação de Rua",
  "Mulheres em Situação de Violência",
  "Jovens em processo de saída das ruas",
  "Calamidade Pública e Emergências",
] as const;

export const statusOptions = [
  "ALL",
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
] as const;

export const donationStatusLabels: Record<string, string> = {
  DRAFT: "Rascunho",
  SUBMITTED: "Enviada",
  UNDER_REVIEW: "Em análise",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
  COMPLETED: "Concluída",
};
