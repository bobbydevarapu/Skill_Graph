// ============================================================
// 1. CANDIDATE
// ============================================================

MERGE (bobby:Candidate {id: "candidate-001"})
SET bobby.name = "Bobby Devarapu",
    bobby.email = "bobby@example.com",
    bobby.experience = "Entry Level";


// ============================================================
// 2. SKILLS
// ============================================================

UNWIND [
    ["skill-python", "Python", "Programming"],
    ["skill-java", "Java", "Programming"],
    ["skill-cpp", "C++", "Programming"],
    ["skill-aws", "AWS", "Cloud"],
    ["skill-docker", "Docker", "DevOps"],
    ["skill-linux", "Linux", "Systems"],
    ["skill-mysql", "MySQL", "Database"],
    ["skill-fastapi", "FastAPI", "Backend"],
    ["skill-git", "Git", "Development"],
    ["skill-rest", "REST APIs", "Backend"],
    ["skill-kubernetes", "Kubernetes", "DevOps"],
    ["skill-spring", "Spring Boot", "Backend"],
    ["skill-ml", "Machine Learning", "AI"]
] AS row

MERGE (s:Skill {id: row[0]})
SET s.name = row[1],
    s.category = row[2];


// ============================================================
// 3. TECHNOLOGIES
// ============================================================

UNWIND [
    ["tech-aws", "AWS"],
    ["tech-fastapi", "FastAPI"],
    ["tech-docker", "Docker"],
    ["tech-mysql", "MySQL"],
    ["tech-lambda", "AWS Lambda"],
    ["tech-kinesis", "Amazon Kinesis"],
    ["tech-python", "Python"],
    ["tech-java", "Java"],
    ["tech-kubernetes", "Kubernetes"],
    ["tech-spring", "Spring Boot"]
] AS row

MERGE (t:Technology {id: row[0]})
SET t.name = row[1];


// ============================================================
// 4. PROJECTS
// ============================================================

UNWIND [
    ["project-cloud-vault", "Cloud Vault", "Secure document storage system"],
    ["project-receipt", "AWS Receipt Processing System", "Automated receipt processing"],
    ["project-stock", "Real-Time Stock Analytics Pipeline", "Real-time AWS analytics pipeline"],
    ["project-ai-doc", "Multi-Modal AI Document System", "Document and speech intelligence system"]
] AS row

MERGE (p:Project {id: row[0]})
SET p.name = row[1],
    p.description = row[2];


// ============================================================
// 5. COMPANIES
// ============================================================

UNWIND [
    ["company-amazon", "Amazon"],
    ["company-microsoft", "Microsoft"],
    ["company-accenture", "Accenture"],
    ["company-tcs", "TCS"],
    ["company-wexa", "Wexa AI"]
] AS row

MERGE (c:Company {id: row[0]})
SET c.name = row[1];


// ============================================================
// 6. JOBS
// ============================================================

UNWIND [
    ["job-aws", "AWS Cloud Engineer", "Cloud"],
    ["job-backend", "Backend Developer", "Software Development"],
    ["job-devops", "DevOps Engineer", "DevOps"],
    ["job-python", "Python Developer", "Software Development"],
    ["job-ai", "AI/ML Engineer", "Artificial Intelligence"],
    ["job-software", "Software Engineer", "Software Development"]
] AS row

MERGE (j:Job {id: row[0]})
SET j.title = row[1],
    j.category = row[2];


// ============================================================
// 7. CANDIDATE → SKILLS
// ============================================================

MATCH (c:Candidate {id: "candidate-001"})

MATCH (python:Skill {id: "skill-python"})
MATCH (java:Skill {id: "skill-java"})
MATCH (cpp:Skill {id: "skill-cpp"})
MATCH (aws:Skill {id: "skill-aws"})
MATCH (docker:Skill {id: "skill-docker"})
MATCH (linux:Skill {id: "skill-linux"})
MATCH (mysql:Skill {id: "skill-mysql"})
MATCH (fastapi:Skill {id: "skill-fastapi"})
MATCH (git:Skill {id: "skill-git"})
MATCH (rest:Skill {id: "skill-rest"})
MATCH (ml:Skill {id: "skill-ml"})

MERGE (c)-[:HAS_SKILL {level: "Advanced", years: 2}]->(python)
MERGE (c)-[:HAS_SKILL {level: "Intermediate", years: 2}]->(java)
MERGE (c)-[:HAS_SKILL {level: "Intermediate", years: 2}]->(cpp)
MERGE (c)-[:HAS_SKILL {level: "Advanced", years: 2}]->(aws)
MERGE (c)-[:HAS_SKILL {level: "Intermediate", years: 1}]->(docker)
MERGE (c)-[:HAS_SKILL {level: "Intermediate", years: 2}]->(linux)
MERGE (c)-[:HAS_SKILL {level: "Intermediate", years: 2}]->(mysql)
MERGE (c)-[:HAS_SKILL {level: "Advanced", years: 1}]->(fastapi)
MERGE (c)-[:HAS_SKILL {level: "Advanced", years: 2}]->(git)
MERGE (c)-[:HAS_SKILL {level: "Intermediate", years: 1}]->(rest)
MERGE (c)-[:HAS_SKILL {level: "Intermediate", years: 1}]->(ml);


// ============================================================
// 8. CANDIDATE → PROJECTS
// ============================================================

MATCH (c:Candidate {id: "candidate-001"})

MATCH (p1:Project {id: "project-cloud-vault"})
MATCH (p2:Project {id: "project-receipt"})
MATCH (p3:Project {id: "project-stock"})
MATCH (p4:Project {id: "project-ai-doc"})

MERGE (c)-[:BUILT {role: "Developer"}]->(p1)
MERGE (c)-[:BUILT {role: "Developer"}]->(p2)
MERGE (c)-[:BUILT {role: "Developer"}]->(p3)
MERGE (c)-[:BUILT {role: "AI Developer"}]->(p4);


// ============================================================
// 9. PROJECT → TECHNOLOGIES
// ============================================================

MATCH (p1:Project {id: "project-cloud-vault"})
MATCH (p2:Project {id: "project-receipt"})
MATCH (p3:Project {id: "project-stock"})
MATCH (p4:Project {id: "project-ai-doc"})

MATCH (aws:Technology {id: "tech-aws"})
MATCH (fastapi:Technology {id: "tech-fastapi"})
MATCH (docker:Technology {id: "tech-docker"})
MATCH (mysql:Technology {id: "tech-mysql"})
MATCH (lambda:Technology {id: "tech-lambda"})
MATCH (kinesis:Technology {id: "tech-kinesis"})
MATCH (python:Technology {id: "tech-python"})

MERGE (p1)-[:USES]->(aws)
MERGE (p1)-[:USES]->(fastapi)
MERGE (p1)-[:USES]->(docker)

MERGE (p2)-[:USES]->(aws)
MERGE (p2)-[:USES]->(lambda)
MERGE (p2)-[:USES]->(python)

MERGE (p3)-[:USES]->(aws)
MERGE (p3)-[:USES]->(kinesis)
MERGE (p3)-[:USES]->(python)

MERGE (p4)-[:USES]->(python)
MERGE (p4)-[:USES]->(fastapi)
MERGE (p4)-[:USES]->(mysql);


// ============================================================
// 10. TECHNOLOGY → SKILLS
// ============================================================

MATCH (aws:Technology {id: "tech-aws"})
MATCH (fastapi:Technology {id: "tech-fastapi"})
MATCH (docker:Technology {id: "tech-docker"})
MATCH (mysql:Technology {id: "tech-mysql"})
MATCH (lambda:Technology {id: "tech-lambda"})
MATCH (kinesis:Technology {id: "tech-kinesis"})
MATCH (python:Technology {id: "tech-python"})

MATCH (awsSkill:Skill {id: "skill-aws"})
MATCH (fastapiSkill:Skill {id: "skill-fastapi"})
MATCH (dockerSkill:Skill {id: "skill-docker"})
MATCH (mysqlSkill:Skill {id: "skill-mysql"})
MATCH (pythonSkill:Skill {id: "skill-python"})

MERGE (aws)-[:RELATED_TO]->(awsSkill)
MERGE (fastapi)-[:RELATED_TO]->(fastapiSkill)
MERGE (docker)-[:RELATED_TO]->(dockerSkill)
MERGE (mysql)-[:RELATED_TO]->(mysqlSkill)
MERGE (lambda)-[:RELATED_TO]->(awsSkill)
MERGE (kinesis)-[:RELATED_TO]->(awsSkill)
MERGE (python)-[:RELATED_TO]->(pythonSkill);


// ============================================================
// 11. JOB → REQUIRED SKILLS
// ============================================================

MATCH (awsJob:Job {id: "job-aws"})
MATCH (backendJob:Job {id: "job-backend"})
MATCH (devopsJob:Job {id: "job-devops"})
MATCH (pythonJob:Job {id: "job-python"})
MATCH (aiJob:Job {id: "job-ai"})
MATCH (softwareJob:Job {id: "job-software"})

MATCH (aws:Skill {id: "skill-aws"})
MATCH (python:Skill {id: "skill-python"})
MATCH (docker:Skill {id: "skill-docker"})
MATCH (linux:Skill {id: "skill-linux"})
MATCH (fastapi:Skill {id: "skill-fastapi"})
MATCH (mysql:Skill {id: "skill-mysql"})
MATCH (git:Skill {id: "skill-git"})
MATCH (kubernetes:Skill {id: "skill-kubernetes"})
MATCH (ml:Skill {id: "skill-ml"})
MATCH (java:Skill {id: "skill-java"})

MERGE (awsJob)-[:REQUIRES]->(aws)
MERGE (awsJob)-[:REQUIRES]->(linux)
MERGE (awsJob)-[:REQUIRES]->(docker)
MERGE (awsJob)-[:REQUIRES]->(kubernetes)

MERGE (backendJob)-[:REQUIRES]->(python)
MERGE (backendJob)-[:REQUIRES]->(fastapi)
MERGE (backendJob)-[:REQUIRES]->(mysql)
MERGE (backendJob)-[:REQUIRES]->(git)

MERGE (devopsJob)-[:REQUIRES]->(aws)
MERGE (devopsJob)-[:REQUIRES]->(docker)
MERGE (devopsJob)-[:REQUIRES]->(linux)
MERGE (devopsJob)-[:REQUIRES]->(kubernetes)

MERGE (pythonJob)-[:REQUIRES]->(python)
MERGE (pythonJob)-[:REQUIRES]->(git)
MERGE (pythonJob)-[:REQUIRES]->(fastapi)

MERGE (aiJob)-[:REQUIRES]->(python)
MERGE (aiJob)-[:REQUIRES]->(ml)
MERGE (aiJob)-[:REQUIRES]->(fastapi)

MERGE (softwareJob)-[:REQUIRES]->(java)
MERGE (softwareJob)-[:REQUIRES]->(git)
MERGE (softwareJob)-[:REQUIRES]->(mysql);


// ============================================================
// 12. COMPANY → JOB
// ============================================================

MATCH (amazon:Company {id: "company-amazon"})
MATCH (microsoft:Company {id: "company-microsoft"})
MATCH (accenture:Company {id: "company-accenture"})
MATCH (tcs:Company {id: "company-tcs"})
MATCH (wexa:Company {id: "company-wexa"})

MATCH (awsJob:Job {id: "job-aws"})
MATCH (backendJob:Job {id: "job-backend"})
MATCH (devopsJob:Job {id: "job-devops"})
MATCH (pythonJob:Job {id: "job-python"})
MATCH (aiJob:Job {id: "job-ai"})
MATCH (softwareJob:Job {id: "job-software"})

MERGE (amazon)-[:OFFERS]->(awsJob)
MERGE (amazon)-[:OFFERS]->(devopsJob)

MERGE (microsoft)-[:OFFERS]->(backendJob)
MERGE (microsoft)-[:OFFERS]->(aiJob)

MERGE (accenture)-[:OFFERS]->(softwareJob)
MERGE (accenture)-[:OFFERS]->(backendJob)

MERGE (tcs)-[:OFFERS]->(softwareJob)
MERGE (tcs)-[:OFFERS]->(pythonJob)

MERGE (wexa)-[:OFFERS]->(aiJob)
MERGE (wexa)-[:OFFERS]->(backendJob);