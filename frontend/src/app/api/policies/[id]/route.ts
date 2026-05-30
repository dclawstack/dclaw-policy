import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({
    id: params.id,
    title: "Data Retention Policy v3.1",
    content: "This policy defines data retention schedules and disposal procedures.",
    status: "approved",
    coverage_gaps: [],
    conflict_flags: [],
    approval_status: "approved",
    created_at: "2024-01-15T10:00:00Z",
    version: "3.1",
    owner: "Legal Team",
    department: "Legal",
    tags: ["data", "gdpr"],
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  return NextResponse.json({ id: params.id, ...body, updated_at: new Date().toISOString() });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ ok: true, id: params.id });
}
