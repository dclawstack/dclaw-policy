import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { policy_id } = await req.json();

  const gapSets: Record<string, unknown> = {
    "pol-001": {
      policy_id,
      coverage_score: 87,
      gaps: [
        { framework: "GDPR", requirement: "Data minimisation principle (Art. 5.1.c)", status: "covered", suggestion: "Well addressed in Section 3.2" },
        { framework: "GDPR", requirement: "Storage limitation (Art. 5.1.e)", status: "partial", suggestion: "Clarify retention triggers for inactive customers" },
        { framework: "ISO 27001", requirement: "A.8.3 Media handling", status: "covered", suggestion: "Disposal procedures adequately covered" },
        { framework: "SOC 2", requirement: "CC6.5 Disposal of assets", status: "partial", suggestion: "Add certified destruction evidence requirement" },
        { framework: "HIPAA", requirement: "164.530(j) Documentation retention", status: "missing", suggestion: "Add 6-year minimum for HIPAA-related records" },
      ],
      recommendations: [
        "Specify retention triggers for inactive customer accounts",
        "Add HIPAA documentation retention clause (6 years minimum)",
        "Require certified destruction certificates for physical media",
        "Include a data mapping requirement to track retention compliance",
      ],
    },
  };

  const defaultResult = {
    policy_id,
    coverage_score: 72,
    gaps: [
      { framework: "GDPR", requirement: "Lawful basis for processing (Art. 6)", status: "missing", suggestion: "Explicitly state lawful basis for each processing activity" },
      { framework: "GDPR", requirement: "Data subject rights (Art. 15–22)", status: "partial", suggestion: "Add procedures for handling DSARs within 30-day SLA" },
      { framework: "SOC 2", requirement: "CC1.1 Control environment", status: "covered", suggestion: "Ownership and accountability well defined" },
      { framework: "ISO 27001", requirement: "A.5.1 Policies for information security", status: "partial", suggestion: "Add review frequency and owner accountability" },
      { framework: "NIST CSF", requirement: "PR.IP-1 Baseline configuration", status: "missing", suggestion: "Add technical configuration standards reference" },
      { framework: "HIPAA", requirement: "164.306 Security standards", status: "missing", suggestion: "Add explicit HIPAA safeguard requirements if handling PHI" },
    ],
    recommendations: [
      "Add explicit GDPR lawful basis statements for all processing activities",
      "Define DSAR handling procedures with 30-day SLA",
      "Include policy review schedule (recommend annually)",
      "Add cross-references to related policies to avoid duplication",
      "Define escalation path for policy exceptions",
    ],
  };

  return NextResponse.json(gapSets[policy_id] ?? defaultResult);
}
