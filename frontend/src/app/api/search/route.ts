import { NextRequest, NextResponse } from "next/server";

const ALL_POLICIES = [
  {
    id: "pol-001", title: "Data Retention Policy v3.1", content: "Defines data retention schedules and disposal procedures for all organizational data assets in compliance with GDPR Article 5.",
    status: "approved", coverage_gaps: [], conflict_flags: [], approval_status: "approved",
    created_at: "2024-01-15T10:00:00Z", version: "3.1", owner: "Legal Team", department: "Legal", tags: ["data", "gdpr", "compliance"],
  },
  {
    id: "pol-002", title: "Access Control Framework", content: "Defines role-based access control policies, authentication requirements, and authorization procedures for all systems.",
    status: "in_review", coverage_gaps: ["MFA requirements"], conflict_flags: [], approval_status: "in_review",
    created_at: "2024-02-20T09:00:00Z", version: "2.0", owner: "IT Security", department: "IT", tags: ["security", "iam", "soc2"],
  },
  {
    id: "pol-003", title: "Incident Response Policy", content: "Procedures for identifying, containing, eradicating, and recovering from security incidents.",
    status: "draft", coverage_gaps: ["Communication templates"], conflict_flags: [], approval_status: "draft",
    created_at: "2024-03-01T08:30:00Z", version: "1.0", owner: "CISO Office", department: "Security", tags: ["incident", "security", "soc2"],
  },
  {
    id: "pol-004", title: "GDPR Compliance Guide", content: "Comprehensive guide covering GDPR obligations, data subject rights, processor agreements, and breach notification procedures.",
    status: "published", coverage_gaps: [], conflict_flags: ["Overlaps with Data Retention Policy"], approval_status: "approved",
    created_at: "2023-05-25T12:00:00Z", version: "4.2", owner: "DPO", department: "Legal", tags: ["gdpr", "privacy", "eu"],
  },
  {
    id: "pol-005", title: "Remote Work Policy", content: "Guidelines for employees working remotely including security requirements, availability expectations, and data protection obligations.",
    status: "published", coverage_gaps: [], conflict_flags: [], approval_status: "approved",
    created_at: "2023-08-01T10:00:00Z", version: "2.3", owner: "HR", department: "Human Resources", tags: ["hr", "remote"],
  },
  {
    id: "pol-006", title: "Vendor Management Policy", content: "Framework for evaluating, onboarding, and monitoring third-party vendors and suppliers.",
    status: "in_review", coverage_gaps: ["GDPR DPA requirements"], conflict_flags: [], approval_status: "in_review",
    created_at: "2024-04-10T09:00:00Z", version: "1.1", owner: "Procurement", department: "Operations", tags: ["vendor", "risk"],
  },
  {
    id: "pol-007", title: "Acceptable Use Policy", content: "Defines acceptable use of organizational IT resources, internet access, and communication systems.",
    status: "approved", coverage_gaps: [], conflict_flags: [], approval_status: "approved",
    created_at: "2023-06-15T10:00:00Z", version: "2.1", owner: "IT", department: "IT", tags: ["it", "aup"],
  },
  {
    id: "pol-008", title: "Business Continuity Plan", content: "Plans and procedures to ensure critical business functions continue during and after a disaster or disruption.",
    status: "approved", coverage_gaps: [], conflict_flags: [], approval_status: "approved",
    created_at: "2023-11-01T10:00:00Z", version: "3.0", owner: "Operations", department: "Operations", tags: ["bcp", "continuity"],
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("q") ?? "").toLowerCase();
  const status = searchParams.get("status");
  const department = searchParams.get("department");

  let results = ALL_POLICIES.filter(p => {
    const matchesQuery = !query || p.title.toLowerCase().includes(query) ||
      p.content.toLowerCase().includes(query) ||
      p.tags.some(t => t.includes(query)) ||
      p.department.toLowerCase().includes(query) ||
      p.owner.toLowerCase().includes(query);
    const matchesStatus = !status || p.status === status;
    const matchesDept = !department || p.department === department;
    return matchesQuery && matchesStatus && matchesDept;
  });

  return NextResponse.json({ results, total: results.length, query });
}
