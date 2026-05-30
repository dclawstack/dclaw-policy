import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const versions = [
    {
      id: `v-${crypto.randomUUID().slice(0, 8)}`,
      policy_id: params.id,
      version: "3.1",
      content: "Latest version with updated retention schedules aligned to GDPR Article 5(1)(e).",
      author: "Sarah Chen",
      change_summary: "Updated retention periods for customer data from 5 to 3 years per legal review",
      created_at: "2024-03-10T14:22:00Z",
    },
    {
      id: `v-${crypto.randomUUID().slice(0, 8)}`,
      policy_id: params.id,
      version: "3.0",
      content: "Major revision incorporating GDPR requirements and adding cloud storage provisions.",
      author: "James Park",
      change_summary: "Added cloud storage section, updated GDPR references",
      created_at: "2024-01-20T10:00:00Z",
    },
    {
      id: `v-${crypto.randomUUID().slice(0, 8)}`,
      policy_id: params.id,
      version: "2.5",
      content: "Minor updates to disposal procedures section.",
      author: "Maria Lopez",
      change_summary: "Clarified secure disposal procedures for physical media",
      created_at: "2023-09-15T09:30:00Z",
    },
    {
      id: `v-${crypto.randomUUID().slice(0, 8)}`,
      policy_id: params.id,
      version: "2.0",
      content: "Complete rewrite to align with ISO 27001 requirements.",
      author: "David Kim",
      change_summary: "Full rewrite aligned to ISO 27001 Annex A.8.3",
      created_at: "2023-03-01T11:00:00Z",
    },
    {
      id: `v-${crypto.randomUUID().slice(0, 8)}`,
      policy_id: params.id,
      version: "1.0",
      content: "Initial policy draft.",
      author: "Alex Turner",
      change_summary: "Initial draft",
      created_at: "2022-06-01T09:00:00Z",
    },
  ];
  return NextResponse.json(versions);
}
