import cytoscape from "cytoscape";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Activity,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Cloud,
  Code2,
  Database,
  GitBranch,
  Layers3,
  Network,
  Server,
  Sparkles,
  Terminal,
  UserRound,
  XCircle,
  Zap,
} from "lucide-react";

import "./index.css";


const API = "https://skill-graph-yn72.onrender.com";
const CANDIDATE_ID = "candidate-001";


function App() {
  const [candidate, setCandidate] = useState(null);
  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [graph, setGraph] = useState(null);

  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);

        const [
          candidateResponse,
          skillsResponse,
          jobsResponse,
          projectsResponse,
          graphResponse,
        ] = await Promise.all([
          fetch(`${API}/api/candidates/${CANDIDATE_ID}`),
          fetch(`${API}/api/candidates/${CANDIDATE_ID}/skills`),
          fetch(`${API}/api/jobs/match/${CANDIDATE_ID}`),
          fetch(`${API}/api/candidates/${CANDIDATE_ID}/projects`),
          fetch(`${API}/api/graph/${CANDIDATE_ID}`),
        ]);

        if (!candidateResponse.ok) {
          throw new Error("Candidate API failed");
        }

        if (!skillsResponse.ok) {
          throw new Error("Skills API failed");
        }

        if (!jobsResponse.ok) {
          throw new Error("Jobs API failed");
        }

        if (!projectsResponse.ok) {
          throw new Error("Projects API failed");
        }

        if (!graphResponse.ok) {
          throw new Error("Graph API failed");
        }

        const [
          candidateData,
          skillsData,
          jobsData,
          projectsData,
          graphData,
        ] = await Promise.all([
          candidateResponse.json(),
          skillsResponse.json(),
          jobsResponse.json(),
          projectsResponse.json(),
          graphResponse.json(),
        ]);

        setCandidate(candidateData);
        setSkills(skillsData.skills || []);
        setJobs(jobsData.jobs || []);
        setProjects(projectsData.projects || []);
        setGraph(graphData);
      } catch (error) {
        console.error("Dashboard loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const perfectMatches = jobs.filter(
    (job) => Number(job.match_percentage) === 100
  ).length;

  const averageMatch =
    jobs.length > 0
      ? Math.round(
        jobs.reduce(
          (total, job) => total + Number(job.match_percentage || 0),
          0
        ) / jobs.length
      )
      : 0;

  const categories = useMemo(() => {
    return ["All", ...new Set(jobs.map((job) => job.category).filter(Boolean))];
  }, [jobs]);

  const filteredJobs =
    activeFilter === "All"
      ? jobs
      : jobs.filter((job) => job.category === activeFilter);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-shell">

      {/* ================= HEADER ================= */}

      <header className="topbar">
        <div className="topbar-inner">

          <div className="brand">
            <div className="brand-mark">
              <Network size={22} />
            </div>

            <div>
              <div className="brand-name">SkillGraph</div>
              <div className="brand-subtitle">
                Developer Intelligence Platform
              </div>
            </div>
          </div>

          <div className="system-status">
            <span className="status-dot"></span>
            System Online
          </div>

        </div>
      </header>


      <main className="page-container">

        {/* ================= HERO ================= */}

        <section className="hero-section">

          <div>
            <div className="eyebrow">
              <Sparkles size={14} />
              DEVELOPER INTELLIGENCE
            </div>

            <h1>
              Understand your skills.
              <span> Discover your opportunities.</span>
            </h1>

            <p>
              SkillGraph connects your technical skills, projects and
              experience to relevant engineering opportunities.
            </p>
          </div>

          <div className="hero-actions">
            <div className="live-pill">
              <Activity size={15} />
              Live analysis
            </div>
          </div>

        </section>


        {/* ================= METRICS ================= */}

        <section className="metrics-grid">

          <MetricCard
            icon={<UserRound />}
            label="Candidate"
            value={candidate?.name || "Bobby Devarapu"}
            meta={candidate?.experience || "Entry Level"}
            type="purple"
          />

          <MetricCard
            icon={<Code2 />}
            label="Technical Skills"
            value={skills.length}
            meta="Skills identified"
            type="green"
          />

          <MetricCard
            icon={<BriefcaseBusiness />}
            label="Job Matches"
            value={jobs.length}
            meta="Relevant opportunities"
            type="blue"
          />

          <MetricCard
            icon={<Award />}
            label="Perfect Matches"
            value={perfectMatches}
            meta="100% skill match"
            type="orange"
          />

        </section>


        {/* ================= PROFILE ================= */}

        <section className="section-card profile-section">

          <SectionHeading
            eyebrow="PROFILE"
            title="Candidate Profile"
            description="Your developer identity and professional experience."
          />

          <div className="profile-panel">

            <div className="profile-avatar">
              {getInitials(candidate?.name || "Bobby Devarapu")}
            </div>

            <div className="profile-info">
              <h3>{candidate?.name || "Bobby Devarapu"}</h3>

              <div className="profile-email">
                {candidate?.email || "bobby@example.com"}
              </div>

              <div className="profile-meta">
                <span className="experience-badge">
                  {candidate?.experience || "Entry Level"}
                </span>
              </div>
            </div>

            <div className="profile-side">
              <div className="profile-side-label">PROFILE STATUS</div>
              <div className="profile-side-value">
                <CheckCircle2 size={17} />
                Active
              </div>
            </div>

          </div>

        </section>


        {/* ================= SKILLS ================= */}

        <section className="section-card">

          <SectionHeading
            eyebrow="EXPERTISE"
            title="Technical Skills"
            description="Skills identified from the candidate profile."
          />

          <div className="skills-grid">

            {skills.map((skill, index) => (
              <SkillCard
                key={skill.id || index}
                skill={skill}
              />
            ))}

          </div>

        </section>


        {/* ================= JOB MATCHES ================= */}

        <section className="section-card">

          <div className="section-heading-row">

            <SectionHeading
              eyebrow="INTELLIGENCE"
              title="Job Matches"
              description="Opportunities ranked according to your current skill profile."
            />

            <div className="match-summary">
              <span>{jobs.length} Jobs</span>
              <span>{perfectMatches} Perfect</span>
              <span>{averageMatch}% Avg. Match</span>
            </div>

          </div>


          <div className="filter-row">

            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeFilter === category
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            ))}

          </div>


          <div className="jobs-grid">

            {filteredJobs.map((job, index) => (
              <JobCard
                key={`${job.job_id}-${job.company_id || index}`}
                job={job}
                onClick={() => setSelectedJob(job)}
              />
            ))}

          </div>

        </section>


        {/* ================= PROJECTS ================= */}

        <section className="section-card">

          <SectionHeading
            eyebrow="PORTFOLIO"
            title="Projects & Technologies"
            description="Projects connected to technologies and technical skills."
          />

          <div className="projects-grid">

            {projects.map((project, index) => (
              <ProjectCard
                key={project.project_id || index}
                project={project}
              />
            ))}

          </div>

        </section>


        {/* ================= GRAPH ================= */}

        <GraphSection graph={graph} />

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div>
          <strong>SkillGraph</strong>
          <span>Developer Intelligence Platform</span>
        </div>

        <div>
          Powered by <strong>CognoDB</strong>
        </div>

      </footer>


      {/* ================= JOB MODAL ================= */}

      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

    </div>
  );
}


/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({ icon, label, value, meta, type }) {
  return (
    <div className="metric-card">

      <div className={`metric-icon ${type}`}>
        {icon}
      </div>

      <div className="metric-content">
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
        <div className="metric-meta">{meta}</div>
      </div>

    </div>
  );
}


/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="section-heading">

      <div className="eyebrow">{eyebrow}</div>

      <h2>{title}</h2>

      <p>{description}</p>

    </div>
  );
}


/* =========================================================
   SKILL CARD
========================================================= */

function SkillCard({ skill }) {
  const icon = getSkillIcon(skill.name);

  return (
    <div className="skill-card">

      <div className="skill-icon">
        {icon}
      </div>

      <div className="skill-main">

        <div className="skill-name">
          {skill.name}
        </div>

        <div className="skill-category">
          {skill.category}
        </div>

      </div>

      <div
        className={`skill-level ${String(skill.level || "")
          .toLowerCase()
          .replace(" ", "-")}`}
      >
        {skill.level}
      </div>

    </div>
  );
}


/* =========================================================
   JOB CARD
========================================================= */

function JobCard({ job, onClick }) {
  const percentage = Number(job.match_percentage || 0);

  const isPerfect = percentage === 100;

  return (
    <article
      className={`job-card ${isPerfect ? "perfect" : ""}`}
      onClick={onClick}
    >

      <div className="job-top">

        <div>
          <div className="job-title">
            {job.title}
          </div>

          <div className="job-company">
            {job.company || "Technology Company"}
          </div>
        </div>

        <div className={`match-score ${getMatchClass(percentage)}`}>
          {percentage}%
        </div>

      </div>


      <div className="job-category">
        {job.category}
      </div>


      <div className="match-row">

        <span>Skill compatibility</span>

        <strong>
          {job.matched_count} / {job.required_count}
        </strong>

      </div>


      <div className="progress-track">

        <div
          className={`progress-fill ${getMatchClass(percentage)}`}
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>


      <div className="skills-block">

        <div className="skills-block-title">
          Matched Skills
        </div>

        <div className="tag-list">

          {(job.matched_skills || []).map((skill) => (
            <span
              className="skill-tag matched"
              key={skill}
            >
              {formatSkillName(skill)}
            </span>
          ))}

        </div>

      </div>


      {job.missing_skills?.length > 0 && (

        <div className="missing-block">

          <div className="skills-block-title">
            <XCircle size={14} />
            Missing Skills
          </div>

          <div className="tag-list">

            {job.missing_skills.map((skill) => (
              <span
                className="skill-tag missing"
                key={skill}
              >
                {skill}
              </span>
            ))}

          </div>

        </div>

      )}


      <div className="job-footer">
        View opportunity
        <ChevronRight size={16} />
      </div>

    </article>
  );
}


/* =========================================================
   PROJECT CARD
========================================================= */

function ProjectCard({ project }) {
  return (
    <article className="project-card">

      <div className="project-header">

        <div className="project-icon">
          <Layers3 size={19} />
        </div>

        <div>
          <h3>{project.project}</h3>

          <p>{project.description}</p>
        </div>

      </div>


      <div className="project-section">

        <div className="project-label">
          TECHNOLOGIES
        </div>

        <div className="tag-list">

          {(project.technologies || []).map((technology) => (
            <span
              className="technology-tag"
              key={technology}
            >
              {technology}
            </span>
          ))}

        </div>

      </div>


      <div className="project-section">

        <div className="project-label">
          SKILLS
        </div>

        <div className="tag-list">

          {(project.skills || []).map((skill) => (
            <span
              className="project-skill-tag"
              key={skill}
            >
              {skill}
            </span>
          ))}

        </div>

      </div>

    </article>
  );
}


/* =========================================================
   GRAPH
========================================================= */

function GraphSection({ graph }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  const [graphFilter, setGraphFilter] = useState("All");

  useEffect(() => {
    if (!graph || !containerRef.current) return;

    const rawNodes = graph.nodes || [];
    const rawRelationships = graph.relationships || [];

    /*
     * -------------------------------------------------------
     * NORMALIZE NODE IDS
     * -------------------------------------------------------
     *
     * Backend can return:
     *
     * node.id
     * node.properties.id
     *
     * Relationships can reference either one.
     *
     * We create a mapping so Cytoscape always gets
     * valid source/target IDs.
     */

    const nodeIdMap = new Map();

    rawNodes.forEach((node) => {
      const databaseId = String(node.id);

      const propertyId = node.properties?.id
        ? String(node.properties.id)
        : null;

      const cytoscapeId = propertyId || databaseId;

      nodeIdMap.set(databaseId, cytoscapeId);

      if (propertyId) {
        nodeIdMap.set(propertyId, cytoscapeId);
      }
    });


    /*
     * -------------------------------------------------------
     * CREATE CYTOSCAPE NODES
     * -------------------------------------------------------
     */

    const nodes = rawNodes.map((node) => {
      const databaseId = String(node.id);

      const cytoscapeId =
        node.properties?.id
          ? String(node.properties.id)
          : databaseId;

      const label =
        node.properties?.name ||
        node.properties?.title ||
        node.properties?.label ||
        node.properties?.id ||
        node.label ||
        cytoscapeId;

      return {
        data: {
          id: cytoscapeId,

          label: String(label),

          type: node.label || "Unknown",

          originalId: databaseId,

          ...node.properties,
        },
      };
    });


    /*
     * -------------------------------------------------------
     * CREATE VALID EDGES
     * -------------------------------------------------------
     */

    const edges = [];

    rawRelationships.forEach((relationship, index) => {
      const rawSource = String(relationship.source);
      const rawTarget = String(relationship.target);

      const source = nodeIdMap.get(rawSource);
      const target = nodeIdMap.get(rawTarget);

      /*
       * Ignore broken relationships instead of crashing
       * the entire React application.
       */

      if (!source || !target) {
        console.warn(
          "Skipping invalid graph relationship:",
          relationship
        );

        return;
      }

      edges.push({
        data: {
          id:
            relationship.id
              ? String(relationship.id)
              : `edge-${index}`,

          source,

          target,

          label: relationship.type || "RELATED_TO",
        },
      });
    });


    console.log("SkillGraph nodes:", nodes);
    console.log("SkillGraph edges:", edges);


    /*
     * -------------------------------------------------------
     * CREATE CYTOSCAPE INSTANCE
     * -------------------------------------------------------
     */

    const cy = cytoscape({
      container: containerRef.current,

      elements: {
        nodes,
        edges,
      },

      minZoom: 0.3,
      maxZoom: 3,

      style: [

        /* ================= NODE ================= */

        {
          selector: "node",

          style: {
            "background-color": "#6366f1",

            label: "data(label)",

            color: "#172033",

            "font-size": "11px",

            "font-weight": "bold",

            "text-wrap": "wrap",

            "text-max-width": "90px",

            "text-valign": "center",

            "text-halign": "center",

            width: 52,

            height: 52,

            "border-width": 3,

            "border-color": "#ffffff",

            "overlay-opacity": 0,

            "text-outline-width": 0,
          },
        },


        /* ================= CANDIDATE ================= */

        {
          selector: 'node[type = "Candidate"]',

          style: {
            "background-color": "#4f46e5",

            color: "#ffffff",

            width: 90,

            height: 90,

            "font-size": "14px",

            "font-weight": "bold",

            "border-width": 5,

            "border-color": "#c7d2fe",

            "text-max-width": "100px",
          },
        },


        /* ================= SKILL ================= */

        {
          selector: 'node[type = "Skill"]',

          style: {
            "background-color": "#10b981",

            width: 58,

            height: 58,
          },
        },


        /* ================= PROJECT ================= */

        {
          selector: 'node[type = "Project"]',

          style: {
            "background-color": "#f59e0b",

            width: 68,

            height: 68,

            "font-size": "10px",
          },
        },


        /* ================= TECHNOLOGY ================= */

        {
          selector: 'node[type = "Technology"]',

          style: {
            "background-color": "#06b6d4",

            width: 58,

            height: 58,
          },
        },


        /* ================= JOB ================= */

        {
          selector: 'node[type = "Job"]',

          style: {
            "background-color": "#8b5cf6",

            color: "#ffffff",

            width: 64,

            height: 64,

            "font-size": "10px",
          },
        },


        /* ================= COMPANY ================= */

        {
          selector: 'node[type = "Company"]',

          style: {
            "background-color": "#ef4444",

            color: "#ffffff",

            width: 64,

            height: 64,

            "font-size": "10px",
          },
        },


        /* ================= EDGES ================= */

        {
          selector: "edge",

          style: {
            width: 1.5,

            "line-color": "#cbd5e1",

            "target-arrow-color": "#94a3b8",

            "target-arrow-shape": "triangle",

            "curve-style": "bezier",

            "arrow-scale": 0.75,

            opacity: 0.7,

            "font-size": "8px",

            color: "#98a2b3",

            "text-background-color": "#ffffff",

            "text-background-opacity": 0.8,

            "text-background-padding": "2px",

            label: "data(label)",
          },
        },


        /* ================= HIDDEN ================= */

        {
          selector: ".hidden-node",

          style: {
            display: "none",
          },
        },

        {
          selector: ".hidden-edge",

          style: {
            display: "none",
          },
        },


        /* ================= SELECTED ================= */

        {
          selector: ".highlighted",

          style: {
            "border-color": "#111827",

            "border-width": 5,

            "z-index": 999,
          },
        },

      ],


      /*
       * -------------------------------------------------------
       * GRAPH LAYOUT
       * -------------------------------------------------------
       */

      layout: {
        name: "cose",

        animate: true,

        animationDuration: 900,

        fit: true,

        padding: 80,

        idealEdgeLength: 145,

        edgeElasticity: 100,

        nodeRepulsion: 11000,

        nodeOverlap: 30,

        gravity: 0.35,

        numIter: 1500,

        randomize: true,

        componentSpacing: 120,

        nestingFactor: 0.8,
      },
    });


    cyRef.current = cy;


    /*
     * -------------------------------------------------------
     * NODE CLICK
     * -------------------------------------------------------
     */

    cy.on("tap", "node", (event) => {
      const node = event.target;

      cy.elements().removeClass("highlighted");

      node.addClass("highlighted");

      node.neighborhood().addClass("highlighted");
    });


    /*
     * -------------------------------------------------------
     * BACKGROUND CLICK
     * -------------------------------------------------------
     */

    cy.on("tap", (event) => {
      if (event.target === cy) {
        cy.elements().removeClass("highlighted");
      }
    });


    /*
     * -------------------------------------------------------
     * CLEANUP
     * -------------------------------------------------------
     */

    return () => {
      cy.destroy();

      cyRef.current = null;
    };

  }, [graph]);


  /*
   * =========================================================
   * GRAPH FILTER
   * =========================================================
   */

  function applyFilter(filter) {
    setGraphFilter(filter);

    if (!cyRef.current) return;

    const cy = cyRef.current;

    cy.nodes().removeClass("hidden-node");

    cy.edges().removeClass("hidden-edge");


    if (filter !== "All") {

      cy.nodes().forEach((node) => {

        if (node.data("type") !== filter) {
          node.addClass("hidden-node");
        }

      });


      cy.edges().forEach((edge) => {

        if (
          edge.source().hasClass("hidden-node") ||
          edge.target().hasClass("hidden-node")
        ) {
          edge.addClass("hidden-edge");
        }

      });

    }


    const visibleElements =
      cy.elements(":visible");


    if (visibleElements.length > 0) {

      cy.layout({
        name: "cose",

        animate: true,

        animationDuration: 600,

        fit: true,

        padding: 70,

        idealEdgeLength: 140,

        nodeRepulsion: 10000,

        gravity: 0.4,

        numIter: 900,

        randomize: true,
      }).run();

    }
  }


  /*
   * =========================================================
   * FIT GRAPH
   * =========================================================
   */

  function fitGraph() {

    if (!cyRef.current) return;

    const visible =
      cyRef.current.elements(":visible");

    if (visible.length > 0) {

      cyRef.current.fit(
        visible,
        70
      );

    }
  }


  /*
   * =========================================================
   * RESET
   * =========================================================
   */

  function resetGraph() {

    setGraphFilter("All");

    if (!cyRef.current) return;

    const cy = cyRef.current;

    cy.nodes().removeClass(
      "hidden-node highlighted"
    );

    cy.edges().removeClass(
      "hidden-edge"
    );


    cy.layout({
      name: "cose",

      animate: true,

      animationDuration: 700,

      fit: true,

      padding: 70,

      idealEdgeLength: 145,

      nodeRepulsion: 11000,

      gravity: 0.35,

      numIter: 1200,

      randomize: true,
    }).run();
  }


  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <section className="section-card graph-section">

      <div className="graph-header">

        <div>

          <div className="eyebrow">
            KNOWLEDGE GRAPH
          </div>

          <h2>
            Skill Intelligence Map
          </h2>

          <p>
            Explore relationships between your
            skills, projects, technologies,
            jobs and companies.
          </p>

        </div>


        <div className="graph-controls">

          <button
            className="secondary-button"
            onClick={fitGraph}
          >
            Fit Graph
          </button>

          <button
            className="secondary-button"
            onClick={resetGraph}
          >
            Reset
          </button>

        </div>

      </div>


      <div className="graph-filter-row">

        {[
          "All",
          "Candidate",
          "Skill",
          "Project",
          "Technology",
          "Job",
          "Company",
        ].map((type) => (

          <button
            key={type}
            className={
              graphFilter === type
                ? "graph-filter active"
                : "graph-filter"
            }
            onClick={() => applyFilter(type)}
          >

            <span
              className={
                `legend-dot ${type.toLowerCase()}`
              }
            />

            {type}

          </button>

        ))}

      </div>


      <div className="graph-container">

        {!graph?.nodes?.length ? (

          <div className="empty-state">

            <Network size={40} />

            <h3>
              No graph data
            </h3>

            <p>
              The graph API did not return any nodes.
            </p>

          </div>

        ) : (

          <div
            ref={containerRef}
            className="cytoscape-container"
          />

        )}

      </div>

    </section>
  );
}


/* =========================================================
   MODAL
========================================================= */

function JobModal({ job, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>

      <div
        className="job-modal"
        onClick={(event) => event.stopPropagation()}
      >

        <button
          className="modal-close"
          onClick={onClose}
        >
          ×
        </button>

        <div className="eyebrow">
          JOB OPPORTUNITY
        </div>

        <h2>{job.title}</h2>

        <p className="modal-company">
          {job.company || "Technology Company"}
        </p>

        <div className="modal-score">
          {job.match_percentage}% Match
        </div>

        <div className="modal-grid">

          <div>
            <span>Category</span>
            <strong>{job.category}</strong>
          </div>

          <div>
            <span>Matched Skills</span>
            <strong>
              {job.matched_count} / {job.required_count}
            </strong>
          </div>

        </div>

        <div className="modal-section">

          <h4>Matched Skills</h4>

          <div className="tag-list">

            {(job.matched_skills || []).map((skill) => (
              <span
                className="skill-tag matched"
                key={skill}
              >
                {formatSkillName(skill)}
              </span>
            ))}

          </div>

        </div>


        {job.missing_skills?.length > 0 && (
          <div className="modal-section">

            <h4>Skills to Improve</h4>

            <div className="tag-list">

              {job.missing_skills.map((skill) => (
                <span
                  className="skill-tag missing"
                  key={skill}
                >
                  {skill}
                </span>
              ))}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}


/* =========================================================
   LOADING
========================================================= */

function LoadingScreen() {
  return (
    <div className="loading-screen">

      <div className="loading-logo">
        <Network size={28} />
      </div>

      <h2>Loading SkillGraph</h2>

      <p>
        Building your developer intelligence dashboard...
      </p>

      <div className="loading-bar">
        <div />
      </div>

    </div>
  );
}


/* =========================================================
   HELPERS
========================================================= */

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}


function formatSkillName(skill) {
  return skill
    .replace("skill-", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}


function getMatchClass(percentage) {
  if (percentage >= 90) return "excellent";
  if (percentage >= 70) return "good";
  if (percentage >= 50) return "average";
  return "low";
}


function getSkillIcon(name = "") {
  const normalized = name.toLowerCase();

  if (normalized.includes("aws")) return <Cloud size={19} />;
  if (normalized.includes("docker")) return <Layers3 size={19} />;
  if (normalized.includes("linux")) return <Terminal size={19} />;
  if (normalized.includes("mysql")) return <Database size={19} />;
  if (normalized.includes("git")) return <GitBranch size={19} />;
  if (normalized.includes("java")) return <Code2 size={19} />;
  if (normalized.includes("python")) return <Code2 size={19} />;
  if (normalized.includes("fastapi")) return <Server size={19} />;
  if (normalized.includes("machine")) return <Sparkles size={19} />;

  return <Zap size={19} />;
}


export default App;