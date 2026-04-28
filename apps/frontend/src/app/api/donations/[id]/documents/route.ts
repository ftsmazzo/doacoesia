import { NextRequest } from "next/server";
import { getBackendApiBase } from "../../../_lib/backend";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Params) {
  const { id } = await context.params;
  const backend = getBackendApiBase();
  const response = await fetch(`${backend}/donations/${id}/documents`, {
    cache: "no-store",
  });
  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest, context: Params) {
  const { id } = await context.params;
  const backend = getBackendApiBase();
  const form = await request.formData();
  const response = await fetch(`${backend}/donations/${id}/documents`, {
    method: "POST",
    body: form,
    cache: "no-store",
  });
  const body = await response.text();
  return new Response(body, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
