export async function getErrorMessage(response: Response, fallback: string) {
  try {
    const payload = (await response.json()) as { message?: string | string[] };
    if (Array.isArray(payload.message)) {
      return payload.message.join(" | ");
    }
    if (typeof payload.message === "string") {
      return payload.message;
    }
  } catch {
    // noop
  }
  return `${fallback} (HTTP ${response.status})`;
}
