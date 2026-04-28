import { NextRequest } from "next/server";
import { getBackendApiBase } from "../../../../../_lib/backend";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Params) {
  const { id } = await context.params;
  const backend = getBackendApiBase();
  const response = await fetch(`${backend}/donors/${id}/documents/checklist`, {
    cache: "no-store",
  });
  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
