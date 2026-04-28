export function getBackendApiBase() {
  const rawBase =
    process.env.API_BASE_URL ??
    process.env.BACKEND_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:3001";

  return rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;
}

export async function proxyJson(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const bodyText = await response.text();
  return new Response(bodyText, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });
}
