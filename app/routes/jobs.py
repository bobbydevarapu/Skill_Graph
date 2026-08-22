from fastapi import APIRouter, HTTPException

from app.database import driver


router = APIRouter(
    prefix="/api/jobs",
    tags=["Jobs"],
)


@router.get("/match/{candidate_id}")
def match_jobs(candidate_id: str):
    query = """
        MATCH (c:Candidate {id: $candidate_id})
              -[:HAS_SKILL]->(candidate_skill:Skill)

        MATCH (company:Company)
              -[:OFFERS]->(job:Job)
              -[:REQUIRES]->(required_skill:Skill)

        WITH company,
             job,
             collect(DISTINCT candidate_skill.id) AS candidate_skills,
             collect(DISTINCT required_skill.id) AS required_skills

        WITH company,
             job,
             candidate_skills,
             required_skills,
             [skill_id IN required_skills
              WHERE skill_id IN candidate_skills] AS matched_skills,
             [skill_id IN required_skills
              WHERE NOT skill_id IN candidate_skills] AS missing_skill_ids

        OPTIONAL MATCH (missing_skill:Skill)
        WHERE missing_skill.id IN missing_skill_ids

        WITH company,
             job,
             matched_skills,
             required_skills,
             collect(DISTINCT missing_skill.name) AS missing_skills

        RETURN
            company.id AS company_id,
            company.name AS company,
            job.id AS job_id,
            job.title AS title,
            job.category AS category,
            matched_skills,
            size(matched_skills) AS matched_count,
            size(required_skills) AS required_count,
            missing_skills,
            CASE
                WHEN size(required_skills) = 0 THEN 0.0
                ELSE round(
                    100.0 * size(matched_skills) / size(required_skills)
                )
            END AS match_percentage

        ORDER BY match_percentage DESC
    """

    try:
        with driver.session() as session:
            result = session.run(
                query,
                candidate_id=candidate_id,
            )

            jobs = [record.data() for record in result]

        if not jobs:
            raise HTTPException(
                status_code=404,
                detail="No jobs found",
            )

        return {
            "candidate_id": candidate_id,
            "jobs": jobs,
        }

    except HTTPException:
        raise

    except Exception as error:
        print(f"Job matching error: {error}")

        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        )