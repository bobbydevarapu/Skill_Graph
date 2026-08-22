from fastapi import APIRouter, HTTPException

from app.database import driver

router = APIRouter(prefix="/api/candidates", tags=["Candidates"])


@router.get("/{candidate_id}")
def get_candidate(candidate_id: str):
    query = """
        MATCH (c:Candidate {id: $candidate_id})
        RETURN c {
            .id,
            .name,
            .email,
            .experience
        } AS candidate
    """

    try:
        with driver.session() as session:
            result = session.run(
                query,
                candidate_id=candidate_id,
            )
            record = result.single()

        if record is None:
            raise HTTPException(
                status_code=404,
                detail="Candidate not found",
            )

        return record["candidate"]

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        )
@router.get("/{candidate_id}/skills")
def get_candidate_skills(candidate_id: str):
    query = """
        MATCH (c:Candidate {id: $candidate_id})
              -[r:HAS_SKILL]->(s:Skill)
        RETURN s {
            .id,
            .name,
            .category,
            level: r.level,
            years: r.years
        } AS skill
        ORDER BY s.name
    """

    try:
        with driver.session() as session:
            result = session.run(
                query,
                candidate_id=candidate_id,
            )

            skills = [record["skill"] for record in result]

        if not skills:
            raise HTTPException(
                status_code=404,
                detail="Candidate not found or has no skills",
            )

        return {
            "candidate_id": candidate_id,
            "skills": skills,
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        )
@router.get("/{candidate_id}/projects")
def get_candidate_projects(candidate_id: str):
    query = """
        MATCH (c:Candidate {id: $candidate_id})
              -[:BUILT]->(p:Project)
              -[:USES]->(t:Technology)
              -[:RELATED_TO]->(s:Skill)

        RETURN
            p.id AS project_id,
            p.name AS project,
            p.description AS description,
            collect(DISTINCT t.name) AS technologies,
            collect(DISTINCT s.name) AS skills

        ORDER BY p.name
    """

    try:
        with driver.session() as session:
            result = session.run(
                query,
                candidate_id=candidate_id,
            )

            projects = [record.data() for record in result]

        if not projects:
            raise HTTPException(
                status_code=404,
                detail="No projects found",
            )

        return {
            "candidate_id": candidate_id,
            "projects": projects,
        }

    except HTTPException:
        raise

    except Exception as error:
        print(f"Project query error: {error}")

        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        )