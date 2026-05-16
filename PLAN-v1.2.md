# DClaw Policy — v1.2 Feature Roadmap

> 📘 **REVISED PRD v2.3 available:** See `REVISED-PRD.md` for complete gap analysis, current state, and full feature roadmap.


> Based on: Y Combinator vertical SaaS principles, trending GitHub repos (documentcloud), AI product research (PolicyStat, PowerDMS, ConvergePoint, PolicyTech)

## Pre-Flight Checklist

- [ ] `frontend/package-lock.json` committed after any `npm install` / dependency change
- [ ] `frontend/next-env.d.ts` exists and is committed
- [ ] `docker-compose.yml` healthchecks correct
- [ ] `frontend/Dockerfile` declares `ARG NEXT_PUBLIC_API_URL` before `RUN npm run build`

## v1.0 Feature Inventory (Current)

- [ ] Policy CRUD with versioning
- [ ] Approval workflow
- [ ] Distribution tracking
- [ ] Basic attestation
- [ ] Real backend CRUD (no mocks)
- [ ] Docker + Helm deployment
- [ ] Alembic migrations
- [ ] Backend tests

---

## v1.2 Roadmap

### P0 — Must Have (Ship in v1.0, demo-ready)

#### 1. AI Policy Copilot (Policy Drafter)
**Description:** AI assistant that drafts policies, suggests updates based on regulation changes, and answers policy questions. "Draft a remote work policy for our company."
- **AI Angle:** Policy template generation. Regulatory change monitoring. Q&A over policy library.
- **Backend:** `/api/v1/ai/policy-chat` endpoint. Policy generation pipeline.
- **Frontend:** Chat with policy drafting. Policy Q&A widget.
- **Files:** `backend/app/services/policy_ai.py`, `frontend/src/components/policy-copilot.tsx`

#### 2. Policy Lifecycle Management
**Description:** Full lifecycle: draft → review → approve → publish → distribute → retire.
- **Backend:** Workflow engine with approval chains.
- **Frontend:** Policy status pipeline. Approval queue.
- **Files:** `backend/app/services/policy_workflow.py`

#### 3. Employee Attestation & Tracking
**Description:** Track who has read and acknowledged policies. Automated reminders. Compliance reporting.
- **Backend:** Attestation tracking with reminder scheduling.
- **Frontend:** Attestation dashboard with compliance rates.
- **Files:** `backend/app/services/attestation.py`

#### 4. Policy Search & Discovery
**Description:** Full-text search with filters. AI-powered semantic search for policy Q&A.
- **Backend:** Search index with semantic embeddings.
- **Frontend:** Search bar with instant results.
- **Files:** `backend/app/services/policy_search.py`

### P1 — Should Have (v1.1–1.2)

#### 5. AI Policy Gap Analysis
**Description:** AI compares existing policies against regulatory requirements and suggests updates.
- **AI Angle:** Regulatory mapping + gap identification + update suggestions.
- **Backend:** Gap analysis engine.
- **Frontend:** Gap report with edit suggestions.

#### 6. Version Control & Comparison
**Description:** Full version history with diff view. Track changes by author and date.
- **Backend:** Version storage with diff algorithm.
- **Frontend:** Side-by-side comparison. Change history.

#### 7. Policy Distribution Automation
**Description:** Auto-distribute to relevant employee groups. Track delivery and open rates.
- **Backend:** Distribution engine with targeting rules.
- **Frontend:** Distribution report with engagement metrics.

#### 8. Incident-Linked Policy Review
**Description:** Link incidents to policies for mandatory review triggers.
- **Backend:** Incident-policy linkage with review triggers.
- **Frontend:** Incident review queue.

### P2 — Could Have (v1.3+)

#### 9. Multi-Language Policy Translation
**Description:** Auto-translate policies with regulatory accuracy checks.

#### 10. AI-Generated Training from Policies
**Description:** Convert policies into interactive training modules with quizzes.

#### 11. Policy Effectiveness Metrics
**Description:** Measure policy impact on incident reduction and compliance scores.

#### 12. External Stakeholder Policy Portal
**Description:** Share relevant policies with vendors, partners, and regulators.

---

## Implementation Priority

1. **Week 1–2:** AI Policy Copilot (P0.1) + Policy Lifecycle (P0.2)
2. **Week 3–4:** Attestation Tracking (P0.3) + Policy Search (P0.4)
3. **Week 5–6:** Gap Analysis (P1.5) + Version Control (P1.6)
4. **Week 7–8:** Distribution (P1.7) + Incident Linking (P1.8)
