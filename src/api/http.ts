import { env } from "@/lib/env";

const defaultBaseUrl = env.apiBaseUrl || "";

async function parseJson<T>(response: Response) {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? "Request failed");
  }

  return (await response.json()) as T;
}

export async function httpGet<T>(path: string, bearerToken?: string | null) {
  const response = await fetch(`${defaultBaseUrl}${path}`, {
    headers: bearerToken
      ? {
          Authorization: `Bearer ${bearerToken}`
        }
      : undefined
  });

  return parseJson<T>(response);
}

export async function httpPost<TBody, TResponse>(
  path: string,
  body: TBody,
  bearerToken?: string | null
) {
  const response = await fetch(`${defaultBaseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(bearerToken
        ? {
            Authorization: `Bearer ${bearerToken}`
          }
        : {})
    },
    body: JSON.stringify(body)
  });

  return parseJson<TResponse>(response);
}

export async function httpPatch<TBody, TResponse>(
  path: string,
  body: TBody,
  bearerToken?: string | null
) {
  const response = await fetch(`${defaultBaseUrl}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(bearerToken
        ? {
            Authorization: `Bearer ${bearerToken}`
          }
        : {})
    },
    body: JSON.stringify(body)
  });

  return parseJson<TResponse>(response);
}

export async function httpDelete<TResponse>(
  path: string,
  bearerToken?: string | null
) {
  const response = await fetch(`${defaultBaseUrl}${path}`, {
    method: "DELETE",
    headers: bearerToken
      ? {
          Authorization: `Bearer ${bearerToken}`
        }
      : undefined
  });

  return parseJson<TResponse>(response);
}
