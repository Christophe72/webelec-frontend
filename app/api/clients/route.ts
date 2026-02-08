import { NextResponse } from "next/server";

const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ?? "http://localhost:8080";

function buildUrl(path: string, searchParams: URLSearchParams) {
  const url = new URL(path, BACKEND_BASE_URL);
  const query = searchParams.toString();
  if (query) {
    url.search = query;
  }
  return url;
}

export async function GET(request: Request) {
  const url = buildUrl("/api/clients", new URL(request.url).searchParams);
  const response = await fetch(url, { method: "GET" });

  const body = await response.text();
  return new NextResponse(body, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
    },
  });
}

export async function POST(request: Request) {
  const url = new URL("/api/clients", BACKEND_BASE_URL);
  const body = await request.text();
  const contentType = request.headers.get("content-type") ?? "application/json";

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": contentType },
    body,
  });

  const responseBody = await response.text();
  return new NextResponse(responseBody, {
    status: response.status,
    headers: {
      "content-type": response.headers.get("content-type") ?? "application/json",
    },
  });
}
