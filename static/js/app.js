/* =========================================================
   SKILLGRAPH
   Frontend Application
========================================================= */


const CANDIDATE_ID = "candidate-001";


/* =========================================================
   API HELPER
========================================================= */

async function fetchJSON(url) {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
}


/* =========================================================
   CANDIDATE
========================================================= */

async function loadCandidate() {

  const container =
    document.getElementById("candidate");

  try {

    const data = await fetchJSON(
      `/api/candidates/${CANDIDATE_ID}`
    );

    const initials =
      data.name
        ? data.name
          .split(" ")
          .map(word => word[0])
          .join("")
          .substring(0, 2)
          .toUpperCase()
        : "C";

    container.innerHTML = `
            <div class="candidate-profile">

                <div class="avatar">
                    ${initials}
                </div>

                <div class="candidate-info">

                    <h3>
                        ${escapeHTML(data.name || "Unknown Candidate")}
                    </h3>

                    <p>
                        ${escapeHTML(data.email || "No email available")}
                    </p>

                    <span class="experience-badge">
                        ${escapeHTML(data.experience || "Experience not specified")}
                    </span>

                </div>

            </div>
        `;

  } catch (error) {

    console.error("Candidate loading error:", error);

    container.innerHTML = `
            <div class="error-message">
                Unable to load candidate profile.
            </div>
        `;
  }
}


/* =========================================================
   SKILLS
========================================================= */

async function loadSkills() {

  const container =
    document.getElementById("skills");

  try {

    const data = await fetchJSON(
      `/api/candidates/${CANDIDATE_ID}/skills`
    );

    const skills =
      Array.isArray(data)
        ? data
        : data.skills || [];

    if (!skills.length) {

      container.innerHTML = `
                <div class="error-message">
                    No skills found.
                </div>
            `;

      return;
    }


    container.innerHTML = `
            <div class="skills-container">

                ${skills.map(skill => `

                    <div class="skill-pill">

                        <span>
                            ${escapeHTML(skill.name)}
                        </span>

                        <span class="skill-level">
                            ${escapeHTML(skill.level || "")}
                        </span>

                    </div>

                `).join("")}

            </div>
        `;

  } catch (error) {

    console.error("Skills loading error:", error);

    container.innerHTML = `
            <div class="error-message">
                Unable to load skills.
            </div>
        `;
  }
}


/* =========================================================
   JOB MATCHES
========================================================= */

async function loadJobs() {

  const container =
    document.getElementById("jobs");

  const summary =
    document.getElementById("job-summary");

  try {

    const data = await fetchJSON(
      `/api/jobs/match/${CANDIDATE_ID}`
    );

    const jobs =
      data.jobs || [];

    if (!jobs.length) {

      container.innerHTML = `
                <div class="error-message">
                    No job matches found.
                </div>
            `;

      return;
    }


    const perfectMatches =
      jobs.filter(
        job => Number(job.match_percentage) === 100
      ).length;


    summary.innerHTML = `
            <div class="job-summary">

                <span class="summary-badge">
                    ${jobs.length} Jobs
                </span>

                <span class="summary-badge">
                    ${perfectMatches} Perfect Matches
                </span>

            </div>
        `;


    container.innerHTML = `
            <div class="jobs-grid">

                ${jobs.map((job, index) => {

      const percentage =
        Number(job.match_percentage || 0);

      let scoreClass = "match-low";

      if (percentage >= 90) {
        scoreClass = "match-high";
      } else if (percentage >= 70) {
        scoreClass = "match-medium";
      }


      const matchedSkills =
        Array.isArray(job.matched_skills)
          ? job.matched_skills
          : [];


      const missingSkills =
        Array.isArray(job.missing_skills)
          ? job.missing_skills
          : [];


      return `
                        <article
                            class="job-card ${percentage === 100
          ? "top-match"
          : ""
        }"
                        >

                            <div class="job-top">

                                <div>

                                    <h3 class="job-title">
                                        ${escapeHTML(job.title)}
                                    </h3>

                                    ${job.company
          ? `
                                                <div class="company-name">
                                                    ${escapeHTML(job.company)}
                                                </div>
                                            `
          : ""
        }

                                </div>


                                <div
                                    class="match-score ${scoreClass}"
                                >
                                    ${percentage}%
                                </div>

                            </div>


                            <span class="category-badge">
                                ${escapeHTML(job.category || "General")}
                            </span>


                            <div class="skill-match-row">

                                <div class="skill-match-header">

                                    <span>
                                        Skill match
                                    </span>

                                    <span>
                                        ${job.matched_count || 0}
                                        /
                                        ${job.required_count || 0}
                                    </span>

                                </div>


                                <div class="progress-track">

                                    <div
                                        class="progress-bar"
                                        style="width: ${percentage}%"
                                    ></div>

                                </div>

                            </div>


                            ${matchedSkills.length
          ? `
                                        <div class="job-skills">

                                            <div class="skills-title">
                                                Matched skills
                                            </div>

                                            <div class="skill-tags">

                                                ${matchedSkills.map(skill =>
            `
                                                        <span class="skill-tag">
                                                            ${escapeHTML(
              formatSkillName(skill)
            )}
                                                        </span>
                                                    `
          ).join("")}

                                            </div>

                                        </div>
                                    `
          : ""
        }


                            ${missingSkills.length
          ? `
                                        <div class="job-skills">

                                            <div class="skills-title">
                                                Missing skills
                                            </div>

                                            <div class="skill-tags">

                                                ${missingSkills.map(skill =>
            `
                                                        <span class="skill-tag missing-tag">
                                                            ${escapeHTML(skill)}
                                                        </span>
                                                    `
          ).join("")}

                                            </div>

                                        </div>
                                    `
          : ""
        }

                        </article>
                    `;

    }).join("")}

            </div>
        `;

  } catch (error) {

    console.error("Job loading error:", error);

    container.innerHTML = `
            <div class="error-message">
                Unable to load job matches.
            </div>
        `;
  }
}


/* =========================================================
   PROJECTS
========================================================= */

async function loadProjects() {

  const container =
    document.getElementById("projects");

  try {

    const data = await fetchJSON(
      `/api/candidates/${CANDIDATE_ID}/projects`
    );

    const projects =
      Array.isArray(data)
        ? data
        : data.projects || [];

    if (!projects.length) {

      container.innerHTML = `
                <div class="error-message">
                    No projects found.
                </div>
            `;

      return;
    }


    container.innerHTML = `
            <div class="projects-grid">

                ${projects.map(project => {

      const technologies =
        project.technologies || [];

      const skills =
        project.skills || [];


      return `
                        <article class="project-card">

                            <h3>
                                ${escapeHTML(
        project.project ||
        project.name ||
        "Unnamed Project"
      )}
                            </h3>


                            <p class="project-description">
                                ${escapeHTML(
        project.description ||
        "No description available."
      )}
                            </p>


                            ${technologies.length
          ? `
                                        <div class="project-group">

                                            <div class="project-group-title">
                                                Technologies
                                            </div>

                                            <div class="project-tags">

                                                ${technologies.map(tech =>
            `
                                                        <span class="project-tag">
                                                            ${escapeHTML(tech)}
                                                        </span>
                                                    `
          ).join("")}

                                            </div>

                                        </div>
                                    `
          : ""
        }


                            ${skills.length
          ? `
                                        <div class="project-group">

                                            <div class="project-group-title">
                                                Skills
                                            </div>

                                            <div class="project-tags">

                                                ${skills.map(skill =>
            `
                                                        <span class="project-tag">
                                                            ${escapeHTML(skill)}
                                                        </span>
                                                    `
          ).join("")}

                                            </div>

                                        </div>
                                    `
          : ""
        }

                        </article>
                    `;

    }).join("")}

            </div>
        `;

  } catch (error) {

    console.error("Project loading error:", error);

    container.innerHTML = `
            <div class="error-message">
                Unable to load projects.
            </div>
        `;
  }
}


/* =========================================================
   SKILL GRAPH
========================================================= */

let skillGraph = null;


async function loadSkillGraph() {

  const container =
    document.getElementById("skill-graph");

  if (!container) {
    return;
  }


  try {

    const data = await fetchJSON(
      `/api/graph/${CANDIDATE_ID}`
    );


    const elements = [];


    /* -----------------------------------------
       NODES
    ----------------------------------------- */

    (data.nodes || []).forEach(node => {

      const properties =
        node.properties || {};

      const label =
        properties.name ||
        properties.title ||
        properties.id ||
        node.label;


      elements.push({

        data: {

          id: String(node.id),

          label: label,

          type: node.label,

          entityId:
            properties.id || ""

        }

      });

    });


    /* -----------------------------------------
       RELATIONSHIPS
    ----------------------------------------- */

    (data.relationships || []).forEach((relationship, index) => {

      elements.push({

        data: {

          id:
            `edge-${index}-${relationship.id}`,

          source:
            String(relationship.source),

          target:
            String(relationship.target),

          label:
            relationship.type

        }

      });

    });


    container.innerHTML = "";


    /* -----------------------------------------
       CYTOSCAPE
    ----------------------------------------- */

    skillGraph = cytoscape({

      container: container,

      elements: elements,


      layout: {

        name: "cose",

        animate: true,

        animationDuration: 900,

        padding: 60,

        nodeRepulsion: 9000,

        idealEdgeLength: 150,

        edgeElasticity: 100,

        gravity: 0.35

      },


      style: [

        /* ---------------------------------
           BASE NODE
        --------------------------------- */

        {
          selector: "node",

          style: {

            "label": "data(label)",

            "text-valign": "center",

            "text-halign": "center",

            "font-size": "10px",

            "font-weight": "600",

            "color": "#172033",

            "background-color": "#6366f1",

            "width": 42,

            "height": 42,

            "border-width": 2,

            "border-color": "#ffffff",

            "text-wrap": "wrap",

            "text-max-width": "90px"

          }
        },


        /* ---------------------------------
           CANDIDATE
        --------------------------------- */

        {
          selector:
            'node[type="Candidate"]',

          style: {

            "background-color": "#4f46e5",

            "width": 70,

            "height": 70,

            "font-size": "13px",

            "font-weight": "800",

            "color": "#ffffff",

            "border-width": 3,

            "border-color": "#312e81"

          }
        },


        /* ---------------------------------
           SKILL
        --------------------------------- */

        {
          selector:
            'node[type="Skill"]',

          style: {

            "background-color": "#10b981",

            "width": 45,

            "height": 45

          }
        },


        /* ---------------------------------
           PROJECT
        --------------------------------- */

        {
          selector:
            'node[type="Project"]',

          style: {

            "background-color": "#f59e0b",

            "width": 50,

            "height": 50

          }
        },


        /* ---------------------------------
           TECHNOLOGY
        --------------------------------- */

        {
          selector:
            'node[type="Technology"]',

          style: {

            "background-color": "#06b6d4",

            "width": 45,

            "height": 45

          }
        },


        /* ---------------------------------
           JOB
        --------------------------------- */

        {
          selector:
            'node[type="Job"]',

          style: {

            "background-color": "#8b5cf6",

            "width": 50,

            "height": 50,

            "color": "#ffffff"

          }
        },


        /* ---------------------------------
           COMPANY
        --------------------------------- */

        {
          selector:
            'node[type="Company"]',

          style: {

            "background-color": "#ef4444",

            "width": 50,

            "height": 50,

            "color": "#ffffff"

          }
        },


        /* ---------------------------------
           EDGES
        --------------------------------- */

        {
          selector: "edge",

          style: {

            "width": 1.5,

            "line-color": "#cbd5e1",

            "target-arrow-color": "#94a3b8",

            "target-arrow-shape": "triangle",

            "curve-style": "bezier",

            "label": "data(label)",

            "font-size": "7px",

            "color": "#64748b",

            "text-background-color": "#ffffff",

            "text-background-opacity": 0.9,

            "text-background-padding": "2px"

          }
        },


        /* ---------------------------------
           SELECTED NODE
        --------------------------------- */

        {
          selector: "node:selected",

          style: {

            "border-width": 4,

            "border-color": "#111827",

            "overlay-opacity": 0.1

          }
        },


        /* ---------------------------------
           SELECTED EDGE
        --------------------------------- */

        {
          selector: "edge:selected",

          style: {

            "width": 3,

            "line-color": "#6366f1",

            "target-arrow-color": "#6366f1"

          }
        }

      ]

    });


    /* -----------------------------------------
       NODE CLICK
    ----------------------------------------- */

    skillGraph.on(
      "tap",
      "node",
      function (event) {

        const node =
          event.target;

        console.log(
          "Selected graph node:",
          {
            id: node.id(),
            label: node.data("label"),
            type: node.data("type"),
            entityId: node.data("entityId")
          }
        );

      }
    );


    /* -----------------------------------------
       GRAPH READY
    ----------------------------------------- */

    skillGraph.ready(() => {

      skillGraph.fit(
        undefined,
        50
      );

    });


  } catch (error) {

    console.error(
      "Skill graph error:",
      error
    );


    container.innerHTML = `
            <div class="graph-error">
                Unable to load SkillGraph.
            </div>
        `;
  }
}


/* =========================================================
   GRAPH BUTTONS
========================================================= */

function setupGraphButtons() {

  const fitButton =
    document.getElementById("graph-fit");

  const resetButton =
    document.getElementById("graph-reset");


  if (fitButton) {

    fitButton.addEventListener(
      "click",
      () => {

        if (!skillGraph) {
          return;
        }

        skillGraph.fit(
          undefined,
          50
        );

      }
    );

  }


  if (resetButton) {

    resetButton.addEventListener(
      "click",
      () => {

        if (!skillGraph) {
          return;
        }

        skillGraph.layout({

          name: "cose",

          animate: true,

          animationDuration: 800,

          padding: 60,

          nodeRepulsion: 9000,

          idealEdgeLength: 150,

          gravity: 0.35

        }).run();

      }
    );

  }

}


/* =========================================================
   UTILITY
========================================================= */

function formatSkillName(skillId) {

  if (!skillId) {
    return "";
  }


  const knownSkills = {

    "skill-python": "Python",

    "skill-java": "Java",

    "skill-cpp": "C++",

    "skill-aws": "AWS",

    "skill-docker": "Docker",

    "skill-linux": "Linux",

    "skill-mysql": "MySQL",

    "skill-fastapi": "FastAPI",

    "skill-git": "Git",

    "skill-rest": "REST APIs",

    "skill-ml": "Machine Learning",

    "skill-kubernetes": "Kubernetes"

  };


  return knownSkills[skillId] || skillId;
}


function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }


  return String(value)

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;")

    .replace(/'/g, "&#039;");
}


/* =========================================================
   APPLICATION START
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "SkillGraph frontend starting..."
    );


    loadCandidate();

    loadSkills();

    loadJobs();

    loadProjects();

    loadSkillGraph();

    setupGraphButtons();

  }
);