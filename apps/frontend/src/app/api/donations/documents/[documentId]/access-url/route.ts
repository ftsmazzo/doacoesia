import { NextRequest } from "next/server";
import { getBackendApiBase, proxyJson } from "../../../../_lib/backend";

type Params = { params: Promise<{ documentId: string }> };

export async function GET(_request: NextRequest, context: Params) {
  const { documentId } = await context.params;
  const backend = getBackendApiBase();
  return proxyJson(`${backend}/donations/documents/${documentId}/access-url`);
}
