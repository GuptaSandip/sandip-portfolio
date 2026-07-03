from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from app.core.auth_core import get_current_admin
from app.core.supabase import get_supabase
from app.core.config import settings
from app.models.bio import BioUpdate
from app.models.project import ProjectCreate, ProjectUpdate
from app.models.tech import TechCreate, TechUpdate
from app.models.accomplishments import AccomplishmentCreate, AccomplishmentUpdate
from app.models.course import CourseCreate, CourseUpdate, CourseToggle, EnrollmentStatusUpdate
from app.models.experience import ExperienceCreate, ExperienceUpdate
from app.models.resume_overview import ResumeOverviewCreate, ResumeOverviewUpdate
from app.models.knowledge import KnowledgeCreate, KnowledgeUpdate
from app.models.pinned_repo import PinnedRepoCreate, PinnedRepoUpdate
import io, csv

router = APIRouter(dependencies=[Depends(get_current_admin)])


# ── helpers ───────────────────────────────────────────────────
def db():
    return get_supabase()


def upload_file_to_storage(content: bytes, path: str, mime: str) -> str:
    """Upload bytes to Supabase Storage and return public URL."""
    sb = db()
    try:
        # upsert=true replaces existing file
        sb.storage.from_("portfolio").upload(
            path, content,
            file_options={"content-type": mime, "upsert": "true"},
        )
    except Exception as e:
        # If upload fails, try remove first then re-upload
        try:
            sb.storage.from_("portfolio").remove([path])
            sb.storage.from_("portfolio").upload(
                path, content,
                file_options={"content-type": mime, "upsert": "true"},
            )
        except Exception as e2:
            raise HTTPException(500, f"Storage upload failed: {str(e2)}")

    url = sb.storage.from_("portfolio").get_public_url(path)
    return url


# ── Bio ────────────────────────────────────────────────────────
@router.get("/bio")
async def admin_get_bio():
    result = db().table("bio").select("*").eq("id", 1).single().execute()
    if not result.data:
        raise HTTPException(404, "Bio not found — did you run schema.sql?")
    return result.data


@router.put("/bio")
async def admin_update_bio(data: BioUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    if not payload:
        raise HTTPException(400, "Nothing to update")
    result = db().table("bio").update(payload).eq("id", 1).execute()
    if not result.data:
        raise HTTPException(500, "Update failed — check Supabase service key")
    return result.data[0]


# ── Avatar upload (Fix 8) ──────────────────────────────────────
@router.post("/bio/avatar")
async def admin_upload_avatar(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Only image files allowed")
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(400, "Image too large — max 5MB")
    ext = file.filename.split(".")[-1].lower()
    path = f"avatars/sandip_avatar.{ext}"
    url = upload_file_to_storage(content, path, file.content_type)
    db().table("bio").update({"avatar_url": url}).eq("id", 1).execute()
    return {"avatar_url": url}


# ── Projects ───────────────────────────────────────────────────
@router.get("/projects")
async def admin_get_projects():
    return db().table("projects").select("*").order("display_order").execute().data


@router.post("/projects")
async def admin_create_project(data: ProjectCreate):
    result = db().table("projects").insert(data.model_dump()).execute()
    if not result.data:
        raise HTTPException(500, "Create failed")
    return result.data[0]


@router.put("/projects/{pid}")
async def admin_update_project(pid: str, data: ProjectUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    result = db().table("projects").update(payload).eq("id", pid).execute()
    if not result.data:
        raise HTTPException(404, "Project not found")
    return result.data[0]


@router.delete("/projects/{pid}")
async def admin_delete_project(pid: str):
    db().table("projects").delete().eq("id", pid).execute()
    return {"deleted": True}


# ── Tech stack ─────────────────────────────────────────────────
@router.get("/tech-stack")
async def admin_get_tech():
    return db().table("tech_stack").select("*").order("display_order").execute().data


@router.post("/tech-stack")
async def admin_create_tech(data: TechCreate):
    result = db().table("tech_stack").insert(data.model_dump()).execute()
    if not result.data:
        raise HTTPException(500, "Create failed")
    return result.data[0]


@router.put("/tech-stack/{tid}")
async def admin_update_tech(tid: str, data: TechUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    result = db().table("tech_stack").update(payload).eq("id", tid).execute()
    if not result.data:
        raise HTTPException(404, "Tech item not found")
    return result.data[0]


@router.delete("/tech-stack/{tid}")
async def admin_delete_tech(tid: str):
    db().table("tech_stack").delete().eq("id", tid).execute()
    return {"deleted": True}


# ── Accomplishments ────────────────────────────────────────────
@router.get("/accomplishments")
async def admin_get_accomplishments():
    return db().table("accomplishments").select("*").order("display_order").execute().data


@router.post("/accomplishments")
async def admin_create_accomplishment(data: AccomplishmentCreate):
    payload = data.model_dump()
    if payload.get("issued_date"):
        payload["issued_date"] = str(payload["issued_date"])
    result = db().table("accomplishments").insert(payload).execute()
    if not result.data:
        raise HTTPException(500, "Create failed")
    return result.data[0]


@router.put("/accomplishments/{aid}")
async def admin_update_accomplishment(aid: str, data: AccomplishmentUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    if payload.get("issued_date"):
        payload["issued_date"] = str(payload["issued_date"])
    result = db().table("accomplishments").update(payload).eq("id", aid).execute()
    if not result.data:
        raise HTTPException(404, "Not found")
    return result.data[0]


@router.delete("/accomplishments/{aid}")
async def admin_delete_accomplishment(aid: str):
    db().table("accomplishments").delete().eq("id", aid).execute()
    return {"deleted": True}


# ── Courses ────────────────────────────────────────────────────
@router.get("/courses")
async def admin_get_courses():
    return db().table("courses").select("*").order("created_at", desc=True).execute().data


@router.post("/courses")
async def admin_create_course(data: CourseCreate):
    result = db().table("courses").insert(data.model_dump()).execute()
    if not result.data:
        raise HTTPException(500, "Create failed")
    return result.data[0]


@router.put("/courses/{cid}")
async def admin_update_course(cid: str, data: CourseUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    result = db().table("courses").update(payload).eq("id", cid).execute()
    if not result.data:
        raise HTTPException(404, "Course not found")
    return result.data[0]


@router.patch("/courses/{cid}/toggle")
async def admin_toggle_course(cid: str, data: CourseToggle):
    result = db().table("courses").update({"is_visible": data.is_visible}).eq("id", cid).execute()
    if not result.data:
        raise HTTPException(404, "Course not found")
    return result.data[0]


@router.delete("/courses/{cid}")
async def admin_delete_course(cid: str):
    db().table("courses").delete().eq("id", cid).execute()
    return {"deleted": True}

@router.post("/courses/{cid}/brochure")
async def admin_upload_brochure(cid: str, file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files allowed")
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large — max 10MB")
    url = upload_file_to_storage(content, f"brochures/{cid}.pdf", "application/pdf")
    db().table("courses").update({"brochure_url": url}).eq("id", cid).execute()
    return {"brochure_url": url}
    
# Fix 4 — Course thumbnail upload
@router.post("/courses/{cid}/thumbnail")
async def admin_upload_course_thumbnail(cid: str, file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "Only image files allowed")
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(400, "Image too large — max 5MB")
    ext = file.filename.split(".")[-1].lower()
    path = f"course-thumbnails/{cid}.{ext}"
    url = upload_file_to_storage(content, path, file.content_type)
    db().table("courses").update({"thumbnail_url": url}).eq("id", cid).execute()
    return {"thumbnail_url": url}


# ── Enrollments ────────────────────────────────────────────────
@router.get("/enrollments")
async def admin_get_enrollments(course_id: str | None = None):
    query = db().table("enrollments").select("*,courses(title)").order("enrolled_at", desc=True)
    if course_id:
        query = query.eq("course_id", course_id)
    return query.execute().data


# Fix 7 — enrollment status update
@router.patch("/enrollments/{eid}")
async def admin_update_enrollment(eid: str, data: EnrollmentStatusUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    result = db().table("enrollments").update(payload).eq("id", eid).execute()
    if not result.data:
        raise HTTPException(404, "Enrollment not found")
    return result.data[0]


# Fix 4 — Export enrollments as CSV
@router.get("/enrollments/export/csv")
async def admin_export_enrollments_csv(course_id: str | None = None):
    query = db().table("enrollments").select("*,courses(title)").order("enrolled_at", desc=True)
    if course_id:
        query = query.eq("course_id", course_id)
    rows = query.execute().data or []

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=[
        "name", "email", "phone", "goal", "status",
        "course_title", "enrolled_at",
    ])
    writer.writeheader()
    for row in rows:
        writer.writerow({
            "name":         row.get("name", ""),
            "email":        row.get("email", ""),
            "phone":        row.get("phone", ""),
            "goal":         row.get("goal", ""),
            "status":       row.get("status", ""),
            "course_title": row.get("courses", {}).get("title", "") if row.get("courses") else "",
            "enrolled_at":  row.get("enrolled_at", ""),
        })

    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=enrollments.csv"},
    )


# ── Chat Leads & Unknowns ──────────────────────────────────────
@router.get("/leads")
async def admin_get_leads():
    result = db().table("chatbot_leads").select("*").order("created_at", desc=True).execute()
    # Mark as read
    db().table("chatbot_leads").update({"is_read": True}).eq("is_read", False).execute()
    return result.data


@router.get("/unknowns")
async def admin_get_unknowns():
    result = db().table("chatbot_unknowns").select("*").order("created_at", desc=True).execute()
    db().table("chatbot_unknowns").update({"is_read": True}).eq("is_read", False).execute()
    return result.data


# ── Resume upload (Fix 5) ──────────────────────────────────────
@router.post("/resume")
async def admin_upload_resume(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files allowed")
    content = await file.read()
    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large — max 10MB")

    path = "resumes/sandip_gupta_resume.pdf"
    url = upload_file_to_storage(content, path, "application/pdf")

    # Update bio table with new URL
    db().table("bio").update({"resume_url": url}).eq("id", 1).execute()
    return {"resume_url": url}

@router.delete("/resume")
async def admin_delete_resume():
    db_client = db()
    try:
        # Remove file from Supabase Storage
        db_client.storage.from_("portfolio").remove(["resumes/sandip_gupta_resume.pdf"])
    except Exception:
        pass  # File may not exist, that's okay
 
    # Clear resume_url in bio table
    db_client.table("bio").update({"resume_url": None}).eq("id", 1).execute()
    return {"deleted": True}


# ── Experience ─────────────────────────────────────────────────
@router.get("/experience")
async def admin_get_experience():
    return db().table("experience").select("*").order("display_order").execute().data


@router.post("/experience")
async def admin_create_experience(data: ExperienceCreate):
    payload = data.model_dump()
    # Convert empty string end_date to None so Postgres accepts it
    if not payload.get("end_date"):
        payload["end_date"] = None
    result = db().table("experience").insert(payload).execute()
    if not result.data:
        raise HTTPException(500, "Create failed")
    return result.data[0]


@router.put("/experience/{eid}")
async def admin_update_experience(eid: str, data: ExperienceUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    # Allow explicitly clearing end_date when switching to is_current
    if "end_date" in data.model_dump() and data.model_dump()["end_date"] == "":
        payload["end_date"] = None
    if not payload:
        raise HTTPException(400, "Nothing to update")
    result = db().table("experience").update(payload).eq("id", eid).execute()
    if not result.data:
        raise HTTPException(404, "Experience not found")
    return result.data[0]


@router.delete("/experience/{eid}")
async def admin_delete_experience(eid: str):
    db().table("experience").delete().eq("id", eid).execute()
    return {"deleted": True}


# ── Resume Overview ───────────────────────────────────────────
@router.get("/resume-overview")
async def admin_get_resume_overview():
    return db().table("resume_overview").select("*").order("display_order").execute().data


@router.post("/resume-overview")
async def admin_create_resume_overview(data: ResumeOverviewCreate):
    result = db().table("resume_overview").insert(data.model_dump()).execute()
    if not result.data:
        raise HTTPException(500, "Create failed")
    return result.data[0]


@router.put("/resume-overview/{oid}")
async def admin_update_resume_overview(oid: str, data: ResumeOverviewUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    result = db().table("resume_overview").update(payload).eq("id", oid).execute()
    if not result.data:
        raise HTTPException(404, "Not found")
    return result.data[0]


@router.delete("/resume-overview/{oid}")
async def admin_delete_resume_overview(oid: str):
    db().table("resume_overview").delete().eq("id", oid).execute()
    return {"deleted": True}


# ── Chatbot Knowledge ─────────────────────────────────────────
@router.get("/knowledge")
async def admin_get_knowledge():
    return db().table("chatbot_knowledge").select("*").order("created_at", desc=True).execute().data or []


@router.post("/knowledge")
async def admin_create_knowledge(data: KnowledgeCreate):
    result = db().table("chatbot_knowledge").insert(data.model_dump()).execute()
    if not result.data:
        raise HTTPException(500, "Create failed")
    return result.data[0]


@router.put("/knowledge/{kid}")
async def admin_update_knowledge(kid: str, data: KnowledgeUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    result = db().table("chatbot_knowledge").update(payload).eq("id", kid).execute()
    if not result.data:
        raise HTTPException(404, "Not found")
    return result.data[0]


@router.delete("/knowledge/{kid}")
async def admin_delete_knowledge(kid: str):
    db().table("chatbot_knowledge").delete().eq("id", kid).execute()
    return {"deleted": True}


# ── Contact Messages ──────────────────────────────────────────
@router.get("/contacts")
async def admin_get_contacts():
    result = db().table("contact_messages").select("*").order("created_at", desc=True).execute()
    # Mark as read
    db().table("contact_messages").update({"is_read": True}).eq("is_read", False).execute()
    return result.data or []


@router.delete("/contacts/{cid}")
async def admin_delete_contact(cid: str):
    db().table("contact_messages").delete().eq("id", cid).execute()
    return {"deleted": True}


# ── Pinned GitHub Repos ───────────────────────────────────────
@router.get("/pinned-repos")
async def admin_get_pinned_repos():
    return db().table("pinned_repos").select("*").order("display_order").execute().data or []


@router.post("/pinned-repos")
async def admin_create_pinned_repo(data: PinnedRepoCreate):
    result = db().table("pinned_repos").insert(data.model_dump()).execute()
    if not result.data:
        raise HTTPException(500, "Create failed")
    return result.data[0]


@router.put("/pinned-repos/{rid}")
async def admin_update_pinned_repo(rid: str, data: PinnedRepoUpdate):
    payload = {k: v for k, v in data.model_dump().items() if v is not None}
    result = db().table("pinned_repos").update(payload).eq("id", rid).execute()
    if not result.data:
        raise HTTPException(404, "Pinned repo not found")
    return result.data[0]


@router.delete("/pinned-repos/{rid}")
async def admin_delete_pinned_repo(rid: str):
    db().table("pinned_repos").delete().eq("id", rid).execute()
    return {"deleted": True}
