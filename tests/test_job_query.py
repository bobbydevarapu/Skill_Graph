import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database import driver


query = """
MATCH (c:Candidate {id: $candidate_id})-[:HAS_SKILL]->(skill:Skill)
MATCH (job:Job)-[:REQUIRES]->(required:Skill)

WITH c, job,
     collect(DISTINCT skill.id) AS candidate_skills,
     collect(DISTINCT required.id) AS required_skills

WITH c,
     job,
     candidate_skills,
     required_skills,
     [skill_id IN required_skills
      WHERE skill_id IN candidate_skills] AS matched_skills

RETURN
    job.id AS job_id,
    job.title AS title,
    job.category AS category,
    size(matched_skills) AS matched_skills,
    size(required_skills) AS required_skills
ORDER BY matched_skills DESC
"""


try:
    with driver.session() as session:
        result = session.run(
            query,
            candidate_id="candidate-001",
        )

        for record in result:
            print(record.data())

except Exception as error:
    print("QUERY ERROR:")
    print(error)

finally:
    driver.close()