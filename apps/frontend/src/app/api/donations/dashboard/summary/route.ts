import { getBackendApiBase, proxyJson } from '../../../_lib/backend';

export async function GET() {
  const backend = getBackendApiBase();
  return proxyJson(`${backend}/donations/dashboard/summary`);
}
