import { NextRequest, NextResponse } from "next/server";

const DISTRIBUTION_DATA = {
  campaigns: [
    {
      id: "dist-001", policy_title: "Data Retention Policy v3.1",
      sent_to: 120, opened: 98, read: 89, acknowledged: 87,
      status: "completed", sent_at: "2024-05-01T09:00:00Z",
      groups: ["All Staff"],
    },
    {
      id: "dist-002", policy_title: "Access Control Framework",
      sent_to: 85, opened: 62, read: 45, acknowledged: 35,
      status: "active", sent_at: "2024-05-20T10:00:00Z",
      groups: ["IT", "Engineering", "Security"],
    },
    {
      id: "dist-003", policy_title: "GDPR Compliance Guide",
      sent_to: 45, opened: 40, read: 38, acknowledged: 38,
      status: "completed", sent_at: "2024-04-15T09:00:00Z",
      groups: ["Legal", "Data Protection", "Marketing"],
    },
    {
      id: "dist-004", policy_title: "Vendor Management Policy",
      sent_to: 30, opened: 0, read: 0, acknowledged: 0,
      status: "scheduled", sent_at: "2024-06-01T09:00:00Z",
      groups: ["Procurement", "Legal", "Finance"],
    },
    {
      id: "dist-005", policy_title: "Remote Work Policy",
      sent_to: 98, opened: 98, read: 98, acknowledged: 98,
      status: "completed", sent_at: "2024-03-01T10:00:00Z",
      groups: ["All Remote Staff"],
    },
  ],
};

export async function GET() {
  return NextResponse.json(DISTRIBUTION_DATA);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const campaign = {
    id: `dist-${crypto.randomUUID().slice(0, 8)}`,
    policy_title: body.policy_title ?? "New Policy",
    sent_to: 0, opened: 0, read: 0, acknowledged: 0,
    status: "scheduled",
    sent_at: body.send_at ?? new Date(Date.now() + 86400000).toISOString(),
    groups: body.groups ?? [],
  };
  return NextResponse.json(campaign);
}
