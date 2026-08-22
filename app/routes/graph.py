from fastapi import APIRouter, HTTPException

from app.database import driver


router = APIRouter(
    prefix="/api/graph",
    tags=["Graph"],
)


@router.get("/{candidate_id}")
def get_candidate_graph(candidate_id: str):
    query = """
        MATCH (c:Candidate {id: $candidate_id})

        MATCH path = (c)-[*1..3]-(connected)

        WITH collect(path) AS paths

        UNWIND paths AS path

        UNWIND nodes(path) AS node

        WITH collect(DISTINCT {
            id: elementId(node),
            label: labels(node)[0],
            properties: properties(node)
        }) AS nodes,
        paths

        UNWIND paths AS path

        UNWIND relationships(path) AS relationship

        WITH nodes,
             collect(DISTINCT {
                 id: elementId(relationship),
                 type: type(relationship),
                 source: elementId(startNode(relationship)),
                 target: elementId(endNode(relationship)),
                 properties: properties(relationship)
             }) AS relationships

        RETURN nodes, relationships
    """

    try:
        with driver.session() as session:
            result = session.run(
                query,
                candidate_id=candidate_id,
            )

            record = result.single()

        if not record:
            raise HTTPException(
                status_code=404,
                detail="Candidate graph not found",
            )

        return {
            "candidate_id": candidate_id,
            "nodes": record["nodes"],
            "relationships": record["relationships"],
        }

    except HTTPException:
        raise

    except Exception as error:
        print(f"Graph query error: {error}")

        raise HTTPException(
            status_code=503,
            detail="Database unavailable",
        )