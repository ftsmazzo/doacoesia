import { NextRequest } from "next/server";
import { getBackendApiBase, proxyJson } from "../_lib/backend";

export async function GET(request: NextRequest) {
  const backend = getBackendApiBase();
  const params = request.nextUrl.searchParams.toString();
  const suffix = params ? `?${params}` : "";
  return proxyJson(`${backend}/donations${suffix}`);
}

export async function POST(request: NextRequest) {
  const backend = getBackendApiBase();
  const body = await request.json();
  return proxyJson(`${backend}/donations`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
