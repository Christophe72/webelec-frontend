import { NextResponse } from "next/server";

type DiagnosticEntry = {
  id: number;
  symptome: string;
  response: { status: string; details: string };
  createdAt: string;
};

const diagnostics: DiagnosticEntry[] = [];
let nextId = 1;

export async function GET() {
  const sorted = [...diagnostics].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sorted);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { symptome, response } = body;

  if (!symptome || !response) {
    return NextResponse.json(
      { error: "symptome and response are required" },
      { status: 400 }
    );
  }

  const entry: DiagnosticEntry = {
    id: nextId++,
    symptome,
    response,
    createdAt: new Date().toISOString(),
  };

  diagnostics.push(entry);
  return NextResponse.json(entry, { status: 201 });
}
