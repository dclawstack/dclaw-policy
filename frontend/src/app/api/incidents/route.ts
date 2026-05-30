import { NextRequest, NextResponse } from "next/server";

const INCIDENTS = [
  {
    id: "inc-001", title: "Unauthorized access to customer database",
    severity: "critical", description: "An employee accessed customer PII records outside their authorized scope. Potential GDPR Article 33 notification required.",
    linked_policies: ["pol-002", "pol-004"],
    status: "under_review", created_at: "2024-05-15T14:32:00Z", review_triggered: true,
  },
  {
    id: "inc-002", title: "Lost laptop with unencrypted data",
    severity: "high", description: "A field sales employee reported a lost laptop. Device was not encrypted in violation of the Access Control Framework.",
    linked_policies: ["pol-002", "pol-007"],
    status: "open", created_at: "2024-05-22T09:15:00Z", review_triggered: true,
  },
  {
    id: "inc-003", title: "Vendor data breach notification received",
    severity: "medium", description: "Third-party CRM vendor notified of a security breach affecting customer contact data.",
    linked_policies: ["pol-006", "pol-001"],
    status: "under_review", created_at: "2024-05-10T16:45:00Z", review_triggered: false,
  },
  {
    id: "inc-004", title: "Phishing email campaign targeting staff",
    severity: "medium", description: "12 employees clicked a phishing link. No credentials were captured. Security awareness training required.",
    linked_policies: ["pol-003", "pol-007"],
    status: "resolved", created_at: "2024-04-28T11:00:00Z", review_triggered: false,
  },
  {
    id: "inc-005", title: "Outdated software running on production server",
    severity: "low", description: "Routine scan discovered Apache version with known CVEs. Patch applied within SLA but policy review needed.",
    linked_policies: ["pol-002"],
    status: "resolved", created_at: "2024-04-10T08:30:00Z", review_triggered: false,
  },
];

const POLICY_NAMES: Record<string, string> = {
  "pol-001": "Data Retention Policy",
  "pol-002": "Access Control Framework",
  "pol-003": "Incident Response Policy",
  "pol-004": "GDPR Compliance Guide",
  "pol-006": "Vendor Management Policy",
  "pol-007": "Acceptable Use Policy",
};

export async function GET() {
  const incidents = INCIDENTS.map(i => ({
    ...i,
    linked_policy_names: i.linked_policies.map(id => POLICY_NAMES[id] ?? id),
  }));
  return NextResponse.json(incidents);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const incident = {
    id: `inc-${crypto.randomUUID().slice(0, 8)}`,
    title: body.title,
    severity: body.severity ?? "medium",
    description: body.description ?? "",
    linked_policies: body.linked_policies ?? [],
    linked_policy_names: (body.linked_policies ?? []).map((id: string) => POLICY_NAMES[id] ?? id),
    status: "open",
    created_at: new Date().toISOString(),
    review_triggered: (body.severity === "critical" || body.severity === "high"),
  };
  return NextResponse.json(incident);
}
