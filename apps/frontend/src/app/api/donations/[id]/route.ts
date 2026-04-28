import { NextRequest } from "next/server";
import { getBackendApiBase, proxyJson } from "../../_lib/backend";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Params) {
  const { id } = await context.params;
  const backend = getBackendApiBase();
  return proxyJson(`${backend}/donations/${id}`);
}
