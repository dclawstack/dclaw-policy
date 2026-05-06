import uuid
from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class PolicyCreate(BaseModel):
    title: str
    content: str


class PolicyDoc(BaseModel):
    id: str
    title: str
    content: str
    coverage_gaps: List[str]
    conflict_flags: List[str]
    approval_status: str
    created_at: str


class PolicyVersion(BaseModel):
    id: str
    policy_id: str
    version: str
    content: str
    created_at: str


@router.post("/policies", response_model=PolicyDoc)
async def create_policy(payload: PolicyCreate):
    return PolicyDoc(
        id=str(uuid.uuid4()),
        title=payload.title,
        content=payload.content,
        coverage_gaps=["Remote work"],
        conflict_flags=["Overlaps with HR-004"],
        approval_status="pending_review",
        created_at=datetime.now(timezone.utc).isoformat(),
    )


@router.get("/policies/{id}/versions", response_model=List[PolicyVersion])
async def get_policy_versions(id: str):
    now = datetime.now(timezone.utc).isoformat()
    return [
        PolicyVersion(
            id=str(uuid.uuid4()),
            policy_id=id,
            version="1.0",
            content="Initial draft",
            created_at=now,
        ),
        PolicyVersion(
            id=str(uuid.uuid4()),
            policy_id=id,
            version="0.9",
            content="Preliminary review",
            created_at=now,
        ),
    ]
