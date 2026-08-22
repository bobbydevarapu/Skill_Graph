// 1. Count all nodes
MATCH (n)
RETURN labels(n) AS node_type, count(n) AS total
ORDER BY node_type;


// 2. Count all relationships
MATCH ()-[r]->()
RETURN type(r) AS relationship_type, count(r) AS total
ORDER BY relationship_type;


// 3. View Bobby's skills
MATCH (c:Candidate {id: "candidate-001"})-[r:HAS_SKILL]->(s:Skill)
RETURN c.name AS candidate,
       s.name AS skill,
       r.level AS level,
       r.years AS years
ORDER BY s.name;


// 4. Multi-hop traversal:
// Candidate → Project → Technology → Skill
MATCH (c:Candidate {id: "candidate-001"})
      -[:BUILT]->(p:Project)
      -[:USES]->(t:Technology)
      -[:RELATED_TO]->(s:Skill)
RETURN c.name AS candidate,
       p.name AS project,
       t.name AS technology,
       s.name AS skill
ORDER BY p.name, t.name;