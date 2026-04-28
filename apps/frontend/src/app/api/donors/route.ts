import { NextRequest } from "next/server";
import { getBackendApiBase, proxyJson } from "../_lib/backend";

export async function GET() {
  const backend = getBackendApiBase();
  return proxyJson(`${backend}/donors`);
}

export async function POST(request: NextRequest) {
  const backend = getBackendApiBase();
  const body = await request.json();
  return proxyJson(`${backend}/donors`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
