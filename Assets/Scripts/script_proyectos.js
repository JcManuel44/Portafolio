let lastFocusedProjectElement = null;
let projectsCache = [];

document.addEventListener("DOMContentLoaded", () => {
    bindProjectModalEscape();
});

async function getProjects() {
    if (projectsCache.length > 0) {
        return projectsCache;
    }

    const response = await fetch("Json/Tecnologias.json");

    if (!response.ok) {
        throw new Error("No se pudo cargar el archivo de proyectos.");
    }

    const projects = await response.json();
    projectsCache = projects;

    return projects;
}

function createProjectModalContent(project) {
    return `
        <p><strong>Rol:</strong> ${project.rol}</p>
        <p><strong>Contexto:</strong> ${project.contexto}</p>
        <p><strong>Tecnologías:</strong> ${project.tecnologias.join(" · ")}</p>
        <p><strong>Aportes:</strong> ${project.aportes.join(" · ")}</p>
    `;
}

async function openModal(projectId, triggerElement = null) {
    try {
        const projects = await getProjects();
        const selectedProject = projects.find((project) => project.id === projectId);

        if (!selectedProject) {
            throw new Error("Proyecto no encontrado.");
        }

        lastFocusedProjectElement = triggerElement || document.activeElement;

        const modal = document.getElementById("Modal-Project");
        const titleElement = document.getElementById("modal-title");
        const descriptionElement = document.getElementById("modal-description");
        const technologiesElement = document.getElementById("modal-technologies");

        titleElement.textContent = selectedProject.titulo;
        descriptionElement.textContent = selectedProject.descripcion;
        technologiesElement.innerHTML = createProjectModalContent(selectedProject);

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        const closeButton = modal.querySelector(".close-modal");
        closeButton?.focus();
    } catch (error) {
        console.error("Error abriendo proyecto:", error);
        alert("No se pudo abrir el detalle del proyecto.");
    }
}

function closeModal() {
    const modal = document.getElementById("Modal-Project");
    if (!modal) return;

    const closeButton = modal.querySelector(".close-modal");
    closeButton?.blur();

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    lastFocusedProjectElement?.focus();
}

function bindProjectModalEscape() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
}