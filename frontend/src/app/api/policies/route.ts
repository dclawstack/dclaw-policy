import { NextRequest, NextResponse } from "next/server";

const MOCK_POLICIES = [
  {
    id: "pol-001",
    title: "Data Retention Policy v3.1",
    content: "This policy defines data retention schedules and disposal procedures for all organizational data assets.",
    status: "approved",
    coverage_gaps: [],
    conflict_flags: [],
    approval_status: "approved",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-03-10T14:22:00Z",
    version: "3.1",
    owner: "Legal Team",
    department: "Legal",
    tags: ["data", "gdpr", "compliance"],
  },
  {
    id: "pol-002",
    title: "Access Control Framework",
    content: "Defines role-based access control policies, authentication requirements, and authorization procedures.",
    status: "in_review",
    coverage_gaps: ["Multi-factor authentication requirements"],
    conflict_flags: [],
    approval_status: "in_review",
    created_at: "2024-02-20T09:00:00Z",
    updated_at: "2024-04-05T11:15:00Z",
    version: "2.0",
    owner: "IT Security",
    department: "IT",
    tags: ["security", "iam", "soc2"],
  },
  {
    id: "pol-003",
    title: "Incident Response Policy",
    content: "Procedures for identifying, containing, and recovering from security incidents.",
    status: "draft",
    coverage_gaps: ["Communication templates", "Post-incident review timeline"],
    conflict_flags: [],
    approval_status: "draft",
    created_at: "2024-03-01T08:30:00Z",
    updated_at: "2024-04-20T16:45:00Z",
    version: "1.0",
    owner: "CISO Office",
    department: "Security",
    tags: ["incident", "security", "soc2"],
  },
  {
    id: "pol-004",
    title: "GDPR Compliance Guide",
    content: "Comprehensive guide covering GDPR obligations, data subject rights, and compliance procedures.",
    status: "published",
    coverage_gaps: [],
    conflict_flags: ["Overlaps with Data Retention Policy Section 4.3"],
    approval_status: "approved",
    created_at: "2023-05-25T12:00:00Z",
    updated_at: "2024-01-18T09:00:00Z",
    version: "4.2",
    owner: "DPO",
    department: "Legal",
    tags: ["gdpr", "privacy", "eu"],
  },
  {
    id: "pol-005",
    title: "Remote Work Policy",
    content: "Guidelines for employees working remotely including security requirements and productivity expectations.",
    status: "published",
    coverage_gaps: [],
    conflict_flags: [],
    approval_status: "approved",
    created_at: "2023-08-01T10:00:00Z",
    updated_at: "2023-12-15T14:00:00Z",
    version: "2.3",
    owner: "HR",
    department: "Human Resources",
    tags: ["hr", "remote", "work-policy"],
  },
  {
    id: "pol-006",
    title: "Vendor Management Policy",
    content: "Framework for evaluating, onboarding, and monitoring third-party vendors and suppliers.",
    status: "in_review",
    coverage_gaps: ["GDPR data processing agreements"],
    conflict_flags: [],
    approval_status: "in_review",
    created_at: "2024-04-10T09:00:00Z",
    updated_at: "2024-05-01T10:30:00Z",
    version: "1.1",
    owner: "Procurement",
    department: "Operations",
    tags: ["vendor", "third-party", "risk"],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const dept = searchParams.get("department");
  let results = [...MOCK_POLICIES];
  if (status) results = results.filter(p => p.status === status);
  if (dept) results = results.filter(p => p.department === dept);
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const words = (body.content || "").toLowerCase().split(/\s+/);
  const hasGdpr = words.some((w: string) => ["gdpr", "privacy", "data", "personal"].includes(w));
  const hasSecurity = words.some((w: string) => ["security", "access", "authentication", "password"].includes(w));

  const coverage_gaps: string[] = [];
  const conflict_flags: string[] = [];

  if (words.length < 100) coverage_gaps.push("Policy content is too brief — expand to cover all scenarios");
  if (!hasGdpr && body.title?.toLowerCase().includes("data")) coverage_gaps.push("GDPR compliance requirements not addressed");
  if (hasSecurity && !words.includes("mfa")) coverage_gaps.push("Multi-factor authentication requirements missing");
  if (hasGdpr) conflict_flags.push("Potential overlap with existing GDPR Compliance Guide (pol-004)");

  const policy = {
    id: `pol-${crypto.randomUUID().slice(0, 8)}`,
    title: body.title,
    content: body.content,
    status: "draft",
    coverage_gaps,
    conflict_flags,
    approval_status: "pending_review",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: "1.0",
    owner: "You",
    department: "General",
    tags: [],
  };
  return NextResponse.json(policy);
}
