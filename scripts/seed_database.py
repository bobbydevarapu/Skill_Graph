import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database import driver


BASE_DIR = Path(__file__).resolve().parents[1]


def execute_cypher_file(file_path):
    cypher = file_path.read_text(encoding="utf-8")

    statements = [
        statement.strip()
        for statement in cypher.split(";")
        if statement.strip()
    ]

    with driver.session() as session:
        for statement in statements:
            session.run(statement)


def main():
    schema_file = BASE_DIR / "database" / "schema.cypher"
    seed_file = BASE_DIR / "database" / "seed.cypher"

    execute_cypher_file(schema_file)
    print("Schema created successfully.")

    execute_cypher_file(seed_file)
    print("Seed data loaded successfully.")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(f"Database setup failed: {error}")
    finally:
        driver.close()