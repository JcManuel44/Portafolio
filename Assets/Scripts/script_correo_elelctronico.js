document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    const submitButton = document.getElementById("submit-contact-btn");

    if (!contactForm || !formStatus || !submitButton) return;

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = getContactFormData();
        resetFormStatus(formStatus);

        const validationError = validateContactForm(formData);
        if (validationError) {
            showFormStatus(formStatus, validationError, "error");
            return;
        }

        setSubmitButtonState(submitButton, true);

        try {
            await emailjs.send(
                "service_se3xvqg",
                "template_fi2thvf",
                formData,
                {
                    publicKey: "vYFSLmk58NrjMza_t"
                }
            );

            contactForm.reset();
            showFormStatus(formStatus, "Mensaje enviado correctamente.", "success");
        } catch (error) {
            console.error("Error al enviar el mensaje:", error);
            showFormStatus(formStatus, "Ocurrió un error al enviar el mensaje.", "error");
        } finally {
            setSubmitButtonState(submitButton, false);
        }
    });
});

function getContactFormData() {
    return {
        txt_nombre: document.getElementById("id_txt_nombre")?.value.trim() || "",
        txt_empresa: document.getElementById("id_txt_empresa")?.value.trim() || "",
        txt_correo: document.getElementById("id_txt_correo")?.value.trim() || "",
        txt_mensaje: document.getElementById("id_txt_mensaje")?.value.trim() || ""
    };
}

function validateContactForm({ txt_nombre, txt_empresa, txt_correo, txt_mensaje }) {
    if (!txt_nombre || !txt_empresa || !txt_correo || !txt_mensaje) {
        return "Por favor, completa todos los campos.";
    }

    const exceedsMaxLength =
        txt_nombre.length > 60 ||
        txt_empresa.length > 70 ||
        txt_correo.length > 70 ||
        txt_mensaje.length > 500;

    if (exceedsMaxLength) {
        return "Uno o más campos exceden el límite permitido.";
    }

    return null;
}

function resetFormStatus(statusElement) {
    statusElement.textContent = "";
    statusElement.className = "form-status";
}

function showFormStatus(statusElement, message, type) {
    statusElement.textContent = message;
    statusElement.classList.add(type);
}

function setSubmitButtonState(buttonElement, isLoading) {
    buttonElement.disabled = isLoading;
    buttonElement.textContent = isLoading ? "Enviando..." : "Enviar mensaje";
}