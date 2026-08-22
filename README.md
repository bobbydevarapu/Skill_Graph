# SkillGraph

> Graph-based Developer Skill & Job Intelligence Platform

SkillGraph is a full-stack application that uses a graph database to model relationships between candidates, skills, projects, technologies, jobs, and companies.

The platform analyzes a candidate's existing skills and projects, matches them against job requirements, identifies skill gaps, and visualizes the relationships through an interactive knowledge graph.

---

## Features

- Candidate profile management
- Skill and proficiency tracking
- Project and technology mapping
- Graph-based job matching
- Job match percentage calculation
- Missing-skill identification
- Company and job relationship analysis
- Interactive knowledge graph visualization
- REST APIs using FastAPI
- React + Vite frontend
- CognoDB / Neo4j-compatible graph database
- Swagger/OpenAPI API documentation

---

## Architecture

```text
                    ┌──────────────────────┐
                    │     React + Vite     │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │       Backend        │
                    └──────────┬───────────┘
                               │
                               │ Cypher
                               ▼
                    ┌──────────────────────┐
                    │   CognoDB / Neo4j    │
                    │    Graph Database    │
                    └──────────────────────┘
```

## Graph Model

SkillGraph represents developer intelligence using connected graph entities.

Candidate
   │
   ├── HAS_SKILL ──► Skill
   │
   ├── BUILT ──────► Project
   │                    │
   │                    └── USES ──► Technology
   │
   └── MATCHES ────► Job
                         │
                         └── OFFERED_BY ──► Company

The graph allows the application to perform relationship-based queries rather than treating candidate information as isolated records.

Technology Stack
Backend
Python
FastAPI
Uvicorn
Neo4j Python Driver
Jinja2
python-dotenv
Frontend
React
Vite
JavaScript
CSS
Cytoscape.js
Database
CognoDB Cloud
Neo4j-compatible Cypher
Bolt protocol
Project Structure
Skill_Graph/
│
├── app/
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   │
│   ├── routes/
│   │   ├── candidates.py
│   │   ├── jobs.py
│   │   └── graph.py
│   │
│   └── services/
│       ├── candidate_service.py
│       └── job_service.py
│
├── database/
│   ├── schema.cypher
│   ├── seed.cypher
│   └── queries.cypher
│
├── scripts/
│   ├── seed_database.py
│   └── check_database.py
│
├── tests/
│   ├── test_database.py
│   └── test_job_query.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── static/
├── templates/
│
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
Backend Setup
1. Clone the repository
git clone https://github.com/bobbydevarapu/Skill_Graph.git
cd Skill_Graph
2. Create a virtual environment

Windows:

python -m venv .venv

Activate it:

.venv\Scripts\activate
3. Install dependencies
pip install -r requirements.txt
Environment Variables

Create a .env file based on .env.example.

Example:

NEO4J_URI=bolt+s://your-database-endpoint
NEO4J_USERNAME=your-username
NEO4J_PASSWORD=your-password


### From the project root:

uvicorn app.main:app --reload

The API will be available at:

http://127.0.0.1:8000


### The response includes:

matched skills
required skills
missing skills
match percentage
Knowledge Graph
GET /api/graph/{candidate_id}

Returns graph nodes and relationships for visualization.

Job Matching

The matching engine compares:

Candidate Skills
        │
        ▼
Required Job Skills
        │
        ▼
Matched Skills
        │
        ▼
Match Percentage
        │
        ▼
Missing Skills

For example:

Backend Developer

Required Skills: 4
Matched Skills: 4
Match: 100%

Missing Skills: None

For a partially matched role:

AWS Cloud Engineer

Required Skills: 4
Matched Skills: 3
Match: 75%

Missing:
Kubernetes
Frontend


### Navigate to the frontend:

cd frontend

Install dependencies:

npm install

### Run the development server:

npm run dev


Example database validation:

Nodes: 39
Relationships: 66
Candidates: 1
Skills: 13
Jobs: 6
Production Architecture

For deployment, the recommended architecture is:

React + Vite
      │
      ▼
Frontend Hosting
      │
      │ HTTPS
      ▼
FastAPI Backend
      │
      ▼
CognoDB Cloud

Environment-specific configuration should be used for the production API URL and database credentials.

