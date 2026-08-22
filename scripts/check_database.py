import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database import driver


queries = {
    "Nodes": """
        MATCH (n)
        RETURN count(n) AS total
    """,
    "Relationships": """
        MATCH ()-[r]->()
        RETURN count(r) AS total
    """,
    "Candidates": """
        MATCH (c:Candidate)
        RETURN c.name AS name
    """,
    "Skills": """
        MATCH (s:Skill)
        RETURN count(s) AS total
    """,
    "Jobs": """
        MATCH (j:Job)
        RETURN count(j) AS total
    """,
}


def main():
    with driver.session() as session:
        for name, query in queries.items():
            result = session.run(query)
            record = result.single()

            print(f"{name}: {record.data()}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"Database verification failed: {error}")
    finally:
        driver.close()