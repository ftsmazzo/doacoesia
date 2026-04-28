import { NextRequest } from "next/server";
import { getBackendApiBase, proxyJson } from "../../../_lib/backend";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, context: Params) {
  const { id } = await context.params;
  const backend = getBackendApiBase();
  const body = await request.json();
  return proxyJson(`${backend}/donations/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}
