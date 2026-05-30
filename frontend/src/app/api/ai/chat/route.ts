import { NextRequest, NextResponse } from "next/server";

const POLICY_TEMPLATES: Record<string, string> = {
  remote: `# Remote Work Policy

## 1. Purpose
This policy establishes guidelines for employees working remotely to ensure productivity, security, and compliance with organizational standards.

## 2. Scope
Applies to all full-time and part-time employees approved for remote work arrangements.

## 3. Eligibility
Employees may be eligible for remote work subject to:
- Role suitability assessment
- Manager approval
- Satisfactory performance record
- Completion of remote work training

## 4. Security Requirements
- Use company-approved VPN for all work activities
- Enable full-disk encryption on work devices
- Use strong passwords and enable MFA on all work accounts
- Secure home network with WPA3 encryption
- Lock screen when stepping away from device

## 5. Availability & Communication
- Maintain core hours: 10am–3pm local time
- Respond to messages within 2 hours during core hours
- Attend all scheduled meetings via video when possible

## 6. Data Protection
- No storage of confidential data on personal devices
- Use only company-approved cloud storage
- Report any data incidents within 1 hour

## 7. Compliance
This policy complies with GDPR Article 32 (security of processing) and ISO 27001 A.6.2.2.`,

  data: `# Data Governance Policy

## 1. Purpose
Establish clear ownership, quality standards, and lifecycle management for all organizational data assets.

## 2. Data Classification
- **Confidential**: PII, financial records, trade secrets
- **Internal**: Business processes, operational data
- **Public**: Marketing materials, published content

## 3. Data Ownership
Each data asset must have a designated Data Owner responsible for classification, access control, and quality.

## 4. Retention Schedule
| Data Type | Retention Period | Disposal Method |
|-----------|-----------------|-----------------|
| Customer PII | 3 years post-relationship | Secure erasure |
| Financial records | 7 years | Certified destruction |
| Employee records | Duration + 6 years | Secure erasure |
| System logs | 1 year | Automated purge |

## 5. GDPR Compliance
Data processing must comply with GDPR principles including lawfulness, purpose limitation, and data minimisation.`,

  security: `# Information Security Policy

## 1. Purpose
Protect the confidentiality, integrity, and availability of information assets.

## 2. Scope
All employees, contractors, and systems processing organizational information.

## 3. Access Control
- Implement principle of least privilege
- Review access rights quarterly
- Disable accounts within 24h of termination
- Require MFA for all privileged access

## 4. Incident Response
Security incidents must be reported to the CISO within 1 hour of discovery. Refer to the Incident Response Policy for detailed procedures.

## 5. Password Requirements
- Minimum 16 characters
- Complexity requirements enforced
- Password manager mandatory for all staff
- No password reuse for 12 cycles

## 6. Frameworks
This policy aligns with SOC 2 Type II, ISO 27001, and NIST CSF requirements.`,
};

function generateAIResponse(userMessage: string): { message: string; draft?: string; suggestions: string[] } {
  const msg = userMessage.toLowerCase();

  if (msg.includes("remote work") || msg.includes("work from home") || msg.includes("wfh")) {
    return {
      message: "I've drafted a comprehensive Remote Work Policy based on best practices and GDPR/ISO 27001 requirements. It covers eligibility criteria, security requirements, availability expectations, and data protection obligations. Review and customize the sections to match your organization's specific needs.",
      draft: POLICY_TEMPLATES.remote,
      suggestions: [
        "Add country-specific labor law provisions",
        "Include expense reimbursement terms",
        "Define equipment provision policy",
        "Add mental health and ergonomics section",
      ],
    };
  }

  if (msg.includes("data") && (msg.includes("retention") || msg.includes("governance") || msg.includes("protection"))) {
    return {
      message: "Here's a Data Governance Policy draft covering classification, ownership, retention schedules, and GDPR compliance. Adjust the retention periods and disposal methods based on your regulatory obligations and business requirements.",
      draft: POLICY_TEMPLATES.data,
      suggestions: [
        "Add CCPA provisions for California residents",
        "Include data breach notification procedures",
        "Define cross-border transfer restrictions",
        "Add data quality metrics and KPIs",
      ],
    };
  }

  if (msg.includes("security") || msg.includes("infosec") || msg.includes("information security")) {
    return {
      message: "I've drafted an Information Security Policy aligned to SOC 2 Type II, ISO 27001, and NIST CSF. This covers access control, incident response, and password requirements. Customize the thresholds and procedures to match your risk tolerance.",
      draft: POLICY_TEMPLATES.security,
      suggestions: [
        "Add physical security requirements",
        "Include third-party risk assessment",
        "Define acceptable use of AI tools",
        "Add cryptography standards section",
      ],
    };
  }

  if (msg.includes("gdpr") || msg.includes("privacy") || msg.includes("dpo")) {
    return {
      message: "For GDPR compliance policies, I recommend starting with a Privacy Notice and a Data Processing Register. Would you like me to draft: (1) a full Privacy Policy, (2) a Data Subject Rights procedure, or (3) a Data Processing Agreement template? Just specify and I'll generate a complete draft.",
      suggestions: [
        "Draft a Privacy Notice for customers",
        "Create Data Subject Rights procedure",
        "Generate DPA template for processors",
        "Audit existing policies for GDPR gaps",
      ],
    };
  }

  if (msg.includes("analyze") || msg.includes("analyse") || msg.includes("review") || msg.includes("gap")) {
    return {
      message: "To analyze your existing policies, please paste the policy content in this chat or create a new policy document in the Policies section. I can then: identify coverage gaps against GDPR, HIPAA, SOC 2, or ISO 27001; flag contradictions with other policies; suggest specific improvements; and score overall compliance coverage.",
      suggestions: [
        "Upload a policy for gap analysis",
        "Compare two policy versions",
        "Check HIPAA compliance coverage",
        "Identify conflicting clauses",
      ],
    };
  }

  return {
    message: `I can help you draft and improve organizational policies. Here's what I can do:\n\n**Draft new policies** — just say "draft a [policy type] policy"\n**Analyze existing policies** — paste your policy text for gap analysis\n**Answer questions** — ask about compliance requirements, best practices, or regulatory frameworks\n\nWhat type of policy are you working on today?`,
    suggestions: [
      "Draft a remote work policy",
      "Create a data retention policy",
      "Write an information security policy",
      "Build a GDPR compliance guide",
    ],
  };
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const lastUserMessage = [...messages].reverse().find((m: { role: string }) => m.role === "user");
  const userText = lastUserMessage?.content ?? "";
  const response = generateAIResponse(userText);
  return NextResponse.json(response);
}
