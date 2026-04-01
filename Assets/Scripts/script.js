document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const menuToggleButton = document.getElementById("menu-toggle");
    const navigationButtons = document.querySelectorAll(".nav-btn");
    const pageSections = document.querySelectorAll("main .section");
    const downloadCvButton = document.getElementById("boton-descargar-cv");

    const MOBILE_BREAKPOINT = 770;
    const CV_FILE_PATH = "cv/Curriculum_Vitae.docx";

    function isMobileViewport() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    function closeSidebarOnMobile() {
        if (isMobileViewport()) {
            sidebar.classList.remove("active");
        }
    }

    function syncSidebarWithViewport() {
        if (isMobileViewport()) {
            sidebar.classList.remove("active");
        } else {
            sidebar.classList.add("active");
        }
    }

    function setActiveNavButton(targetId) {
        navigationButtons.forEach((button) => {
            const isActive = button.getAttribute("href") === `#${targetId}`;
            button.classList.toggle("active", isActive);
        });
    }

    function bindMenuToggle() {
        menuToggleButton?.addEventListener("click", () => {
            sidebar.classList.toggle("active");
        });
    }

    function bindNavigationButtons() {
        navigationButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const targetId = button.getAttribute("href")?.replace("#", "");
                if (targetId) {
                    setActiveNavButton(targetId);
                }
                closeSidebarOnMobile();
            });
        });
    }

    function bindResizeEvent() {
        window.addEventListener("resize", syncSidebarWithViewport);
    }

    function bindSectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const sectionId = entry.target.getAttribute("id");
                    if (sectionId) {
                        setActiveNavButton(sectionId);
                    }
                });
            },
            {
                threshold: 0.45
            }
        );

        pageSections.forEach((section) => observer.observe(section));
    }

    function bindCvDownload() {
        downloadCvButton?.addEventListener("click", () => {
            window.open(CV_FILE_PATH, "_blank", "noopener,noreferrer");
        });
    }

    bindMenuToggle();
    bindNavigationButtons();
    bindResizeEvent();
    bindSectionObserver();
    bindCvDownload();
    syncSidebarWithViewport();
});