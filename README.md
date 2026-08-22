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

Graph Model

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

Never commit the .env file to GitHub.

Database Setup

The project uses Cypher scripts to create the graph schema and seed the initial data.

Run:

python scripts/seed_database.py

Verify the database:

python scripts/check_database.py

The seeded graph contains candidate, skill, project, technology, job, and company entities together with their relationships.

Run the Backend

From the project root:

uvicorn app.main:app --reload

The API will be available at:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs

Health check:

GET /api/health
API Endpoints
Candidate
GET /api/candidates/{candidate_id}

Returns candidate profile information.

Candidate Skills
GET /api/candidates/{candidate_id}/skills

Returns the candidate's skills, proficiency levels, and experience.

Candidate Projects
GET /api/candidates/{candidate_id}/projects

Returns projects and their associated technologies and skills.

Job Matching
GET /api/jobs/match/{candidate_id}

Matches candidate skills against job requirements.

The response includes:

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

The frontend is built with React and Vite.

Navigate to the frontend:

cd frontend

Install dependencies:

npm install

Run the development server:

npm run dev

Build for production:

npm run build

Preview the production build:

npm run preview
Knowledge Graph Visualization

The application uses Cytoscape.js to visualize relationships between:

Candidate
Skills
Projects
Technologies
Jobs
Companies

The graph supports interactive exploration of the connected data.

Current Demo Data

The project includes a seeded candidate dataset for demonstration and assessment purposes.

The demo candidate is connected to:

Programming skills
Cloud skills
DevOps skills
Backend skills
AI/ML skills
Multiple projects
Multiple technologies
Multiple job opportunities
Multiple companies

This seed data is used to demonstrate the graph queries and matching functionality.

Validation

The application has been tested locally for:

Database connectivity
Database seeding
Candidate retrieval
Skill retrieval
Project retrieval
Job matching
Graph retrieval
FastAPI startup
React production build
Interactive graph rendering

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

Security

Sensitive configuration is stored using environment variables.

The following files and directories should not be committed:

.env
.venv/
node_modules/
frontend/dist/
__pycache__/
Purpose

SkillGraph demonstrates how graph databases can be used to build developer intelligence systems by connecting skills, projects, technologies, jobs, and companies into a queryable knowledge graph.

The project focuses on:

Graph data modeling
Cypher queries
REST API development
Job-skill matching
Knowledge graph visualization
Full-stack application development
Author

Bobby Devarapu

B.Tech Computer Science & Engineering

GitHub:
https://github.com/bobbydevarapu