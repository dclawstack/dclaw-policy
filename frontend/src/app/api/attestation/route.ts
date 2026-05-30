import { NextRequest, NextResponse } from "next/server";

const ATTESTATION_DATA = {
  overall_compliance: 78,
  pending_count: 3,
  policies: [
    {
      id: "pol-001", title: "Data Retention Policy v3.1",
      due_date: "2024-06-30T23:59:59Z", attested: true, attested_at: "2024-05-15T10:22:00Z",
      compliance_rate: 96, employees_total: 120, employees_attested: 115, department: "All",
    },
    {
      id: "pol-002", title: "Access Control Framework",
      due_date: "2024-06-15T23:59:59Z", attested: false,
      compliance_rate: 62, employees_total: 85, employees_attested: 53, department: "IT",
    },
    {
      id: "pol-004", title: "GDPR Compliance Guide",
      due_date: "2024-05-31T23:59:59Z", attested: false,
      compliance_rate: 88, employees_total: 45, employees_attested: 40, department: "Legal",
    },
    {
      id: "pol-005", title: "Remote Work Policy",
      due_date: "2024-07-01T23:59:59Z", attested: true, attested_at: "2024-04-20T09:00:00Z",
      compliance_rate: 100, employees_total: 98, employees_attested: 98, department: "All",
    },
    {
      id: "pol-007", title: "Acceptable Use Policy",
      due_date: "2024-07-15T23:59:59Z", attested: false,
      compliance_rate: 55, employees_total: 200, employees_attested: 110, department: "All",
    },
  ],
};

export async function GET() {
  return NextResponse.json(ATTESTATION_DATA);
}

export async function POST(req: NextRequest) {
  const { policy_id } = await req.json();
  return NextResponse.json({
    ok: true,
    policy_id,
    attested_at: new Date().toISOString(),
    message: "Attestation recorded successfully",
  });
}
