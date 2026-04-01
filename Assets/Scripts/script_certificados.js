let lastFocusedCertificateElement = null;
let certificatesCache = [];

document.addEventListener("DOMContentLoaded", () => {
    loadCertificates();
    bindCertificateModalEscape();
});

async function getCertificates() {
    if (certificatesCache.length > 0) {
        return certificatesCache;
    }

    const response = await fetch("Json/certificados.json");

    if (!response.ok) {
        throw new Error("No se pudo cargar el archivo de certificados.");
    }

    const certificates = await response.json();
    certificatesCache = certificates;

    return certificates;
}

function buildCertificatePreviewUrl(pdfPath) {
    return `${pdfPath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
}

function createCertificateCardTemplate(certificate) {
    return `
        <article class="card-certificate">
            <div class="card-certificate-preview">
                <iframe
                    class="certificate-card-frame"
                    src="${buildCertificatePreviewUrl(certificate.pdf)}"
                    title="Vista previa de ${certificate.titulo}"
                    loading="lazy"
                    tabindex="-1">
                </iframe>
            </div>

            <div class="card-certificate-content">
                <h3>${certificate.titulo}</h3>
                <p>${certificate.descripcion}</p>
            </div>

            <div class="card-certificate-buttons">
                <button
                    class="button-project-medium"
                    type="button"
                    onclick="openCertificateModal(${certificate.id}, this)">
                    Ver certificado
                </button>
            </div>
        </article>
    `;
}

function createCertificateErrorTemplate() {
    return `
        <article class="card-certificate">
            <div class="card-certificate-content">
                <h3>No fue posible cargar los certificados</h3>
                <p>Revisa que el archivo JSON y las rutas de los PDF existan correctamente.</p>
            </div>
        </article>
    `;
}

async function loadCertificates() {
    const certificatesContainer = document.getElementById("certificates-container");
    if (!certificatesContainer) return;

    try {
        const certificates = await getCertificates();
        certificatesContainer.innerHTML = certificates
            .map(createCertificateCardTemplate)
            .join("");
    } catch (error) {
        console.error("Error cargando certificados:", error);
        certificatesContainer.innerHTML = createCertificateErrorTemplate();
    }
}

async function openCertificateModal(certificateId, triggerElement = null) {
    try {
        const certificates = await getCertificates();
        const selectedCertificate = certificates.find(
            (certificate) => certificate.id === certificateId
        );

        if (!selectedCertificate) {
            throw new Error("Certificado no encontrado.");
        }

        lastFocusedCertificateElement = triggerElement || document.activeElement;

        const modal = document.getElementById("Modal-Certificate");
        const titleElement = document.getElementById("certificate-modal-title");
        const descriptionElement = document.getElementById("certificate-modal-description");
        const frameElement = document.getElementById("certificate-frame");
        const openLinkElement = document.getElementById("certificate-open-link");

        titleElement.textContent = selectedCertificate.titulo;
        descriptionElement.textContent = selectedCertificate.descripcion;
        frameElement.src = buildCertificatePreviewUrl(selectedCertificate.pdf);
        openLinkElement.href = selectedCertificate.pdf;

        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        const closeButton = modal.querySelector(".close-modal");
        closeButton?.focus();
    } catch (error) {
        console.error("Error abriendo certificado:", error);
        alert("No se pudo abrir el certificado.");
    }
}

function closeCertificateModal() {
    const modal = document.getElementById("Modal-Certificate");
    if (!modal) return;

    const frameElement = document.getElementById("certificate-frame");
    const closeButton = modal.querySelector(".close-modal");

    closeButton?.blur();

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (frameElement) {
        frameElement.src = "";
    }

    lastFocusedCertificateElement?.focus();
}

function bindCertificateModalEscape() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeCertificateModal();
        }
    });
}