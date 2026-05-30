const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!response.ok) {
    const error = await response.text();
    throw new ApiError(`API error ${response.status}: ${error}`, response.status);
  }
  return response.json();
}

export const api = fetchJson;
export { ApiError };

export const getHealth = () => fetchJson<{ status: string }>("/health");
export const getPolicies = () => fetchJson<PolicyDoc[]>("/policies");
export const createPolicy = (p: { title: string; content: string }) =>
  fetchJson<PolicyDoc>("/policies", { method: "POST", body: JSON.stringify(p) });
export const getPolicyById = (id: string) => fetchJson<PolicyDoc>(`/policies/${id}`);
export const updatePolicy = (id: string, p: Partial<PolicyDoc>) =>
  fetchJson<PolicyDoc>(`/policies/${id}`, { method: "PUT", body: JSON.stringify(p) });
export const deletePolicy = (id: string) =>
  fetchJson<{ ok: boolean }>(`/policies/${id}`, { method: "DELETE" });
export const getPolicyVersions = (id: string) =>
  fetchJson<PolicyVersion[]>(`/policies/${id}/versions`);
export const policyCopilotChat = (messages: ChatMessage[]) =>
  fetchJson<ChatResponse>("/ai/chat", { method: "POST", body: JSON.stringify({ messages }) });
export const runGapAnalysis = (policyId: string) =>
  fetchJson<GapAnalysisResult>("/ai/gap-analysis", { method: "POST", body: JSON.stringify({ policy_id: policyId }) });
export const searchPolicies = (query: string, filters?: Record<string, string>) => {
  const params = new URLSearchParams({ q: query, ...(filters ?? {}) });
  return fetchJson<SearchResult>(`/search?${params}`);
};
export const getAttestation = () => fetchJson<AttestationData>("/attestation");
export const submitAttestation = (policyId: string) =>
  fetchJson<{ ok: boolean }>("/attestation", { method: "POST", body: JSON.stringify({ policy_id: policyId }) });
export const getDistribution = () => fetchJson<DistributionData>("/distribution");
export const createDistribution = (p: { policy_id: string; groups: string[] }) =>
  fetchJson<DistributionCampaign>("/distribution", { method: "POST", body: JSON.stringify(p) });
export const getIncidents = () => fetchJson<Incident[]>("/incidents");
export const createIncident = (p: { title: string; severity: string; linked_policies: string[] }) =>
  fetchJson<Incident>("/incidents", { method: "POST", body: JSON.stringify(p) });

// ── Types ──────────────────────────────────────────────────────────────────────
export interface PolicyDoc {
  id: string;
  title: string;
  content: string;
  status: "draft" | "in_review" | "approved" | "published" | "retired";
  coverage_gaps: string[];
  conflict_flags: string[];
  approval_status: string;
  created_at: string;
  updated_at?: string;
  version?: string;
  owner?: string;
  department?: string;
  tags?: string[];
}

export interface PolicyVersion {
  id: string;
  policy_id: string;
  version: string;
  content: string;
  author: string;
  change_summary: string;
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  message: string;
  draft?: string;
  suggestions?: string[];
}

export interface GapItem {
  framework: string;
  requirement: string;
  status: "missing" | "partial" | "covered";
  suggestion: string;
}

export interface GapAnalysisResult {
  policy_id: string;
  gaps: GapItem[];
  coverage_score: number;
  recommendations: string[];
}

export interface SearchResult {
  results: PolicyDoc[];
  total: number;
  query: string;
}

export interface AttestationPolicy {
  id: string;
  title: string;
  due_date: string;
  attested: boolean;
  attested_at?: string;
  compliance_rate: number;
  employees_total: number;
  employees_attested: number;
  department: string;
}

export interface AttestationData {
  policies: AttestationPolicy[];
  overall_compliance: number;
  pending_count: number;
}

export interface DistributionCampaign {
  id: string;
  policy_title: string;
  sent_to: number;
  opened: number;
  read: number;
  acknowledged: number;
  status: "active" | "completed" | "scheduled";
  sent_at: string;
  groups: string[];
}

export interface DistributionData {
  campaigns: DistributionCampaign[];
}

export interface Incident {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  linked_policies: string[];
  status: "open" | "under_review" | "resolved";
  created_at: string;
  review_triggered: boolean;
  description: string;
}
