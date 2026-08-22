# SkillGraph

> Graph-based Developer Skill & Job Intelligence Platform

SkillGraph is a full-stack application that connects candidates, skills, projects, technologies, jobs, and companies using a graph database.

It analyzes candidate skills, matches them with job requirements, identifies missing skills, and visualizes the relationships through an interactive knowledge graph.

## Features

- Candidate profile and skill analysis
- Skill proficiency and experience tracking
- Project and technology mapping
- Graph-based job matching
- Match percentage calculation
- Missing skill detection
- Company and job relationships
- Interactive knowledge graph
- FastAPI REST APIs
- React + Vite frontend
- CognoDB Cloud graph database
- Swagger/OpenAPI documentation

## Technology Stack

**Backend**
- Python
- FastAPI
- Uvicorn
- Neo4j Python Driver
- python-dotenv

**Frontend**
- React
- Vite
- JavaScript
- CSS
- Cytoscape.js

**Database**
- CognoDB Cloud
- Neo4j-compatible Cypher
- Bolt protocol

## Architecture

```text
React + Vite
     │
     │ REST API
     ▼
FastAPI Backend
     │
     │ Cypher / Bolt
     ▼
CognoDB Cloud
````

## Graph Model

```text
Candidate ──HAS_SKILL──► Skill
Candidate ──BUILT──────► Project
Project ────USES───────► Technology
Job ────────REQUIRES───► Skill
Company ────OFFERS─────► Job
```

## Project Structure

```text
Skill_Graph/
├── app/
│   ├── main.py
│   ├── database.py
│   └── routes/
│       ├── candidates.py
│       ├── jobs.py
│       └── graph.py
├── database/
├── scripts/
├── tests/
├── frontend/
├── static/
├── templates/
├── .env.example
├── .gitignore
├── requirements.txt
└── README.md
```

## Setup

### Backend

```bash
git clone https://github.com/bobbydevarapu/Skill_Graph.git
cd Skill_Graph

python -m venv .venv
.venv\Scripts\activate

pip install -r requirements.txt
```

### Environment Variables

Create `.env`:

```env
NEO4J_URI=bolt+s://your-database-endpoint
NEO4J_USERNAME=your-username
NEO4J_PASSWORD=your-password
```

Do not commit `.env`.

### Database

```bash
python scripts/seed_database.py
python scripts/check_database.py
```

### Run Backend

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## API

```text
GET /api/health
GET /api/candidates/{candidate_id}
GET /api/candidates/{candidate_id}/skills
GET /api/candidates/{candidate_id}/projects
GET /api/jobs/match/{candidate_id}
GET /api/graph/{candidate_id}
```

## Job Matching

The system compares candidate skills with required job skills and returns matched skills, missing skills, and match percentage.

Example:

```text
Backend Developer
Match: 100%

AWS Cloud Engineer
Match: 75%
Missing: Kubernetes
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview:

```bash
npm run preview
```

## Knowledge Graph

The interactive graph visualizes:

* Candidates
* Skills
* Projects
* Technologies
* Jobs
* Companies

## Validation

The project has been tested for:

* Database connectivity
* Database seeding
* Candidate APIs
* Skills APIs
* Project APIs
* Job matching
* Missing skill detection
* Graph API
* FastAPI startup
* React production build
* Interactive graph visualization

Example database:

```text
Nodes: 39
Relationships: 66
Candidates: 1
Skills: 13
Jobs: 6
```

## Security

Do not commit:

```text
.env
.venv/
node_modules/
frontend/dist/
__pycache__/
```

```
```
