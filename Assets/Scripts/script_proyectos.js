document.getElementById('boton-descargar-cv').addEventListener('click', function() {
    var pdf_ruta = '../../Pdf/Curriculum_Vitae.pdf';
    
    var pdf_titulo = 'Curriculum Vitae';
    window.open(pdf_ruta, '_blank');

    pdfWindow.document.title = pdf_titulo;
});


function openModal(projectId) {
    fetch('../../Json/Tecnologias.json')
        .then(response => response.json())
        .then(data => {
            const project = data.find(p => p.Id === projectId);
            if (project) {
                document.getElementById("modal-title").textContent = project.titulo;
                document.getElementById("modal-description").textContent = project.descripcion;

                const technologiesContent = `
            <i class="fas fa-check"></i> Frontend: ${project.tecnologias.frontend.join("/ ")}<br>
            <i class="fas fa-check"></i> Backend: ${project.tecnologias.backend.join("/ ")}<br>
            <i class="fas fa-check"></i> Base de Datos: ${project.tecnologias.base_de_datos.join("/ ")}`;
                document.getElementById("modal-technologies").innerHTML = technologiesContent;

                const modal = document.getElementById("Modal-Project");
                modal.style.display = "block";
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

function closeModal() {
    const modal = document.getElementById("Modal-Project");
    modal.style.display = "none";
}



function abrirPDF(elementoBoton) {
    var documentoID = elementoBoton.getAttribute('data-documento-id');
    var jsonPath = '../../Json/projectos_pdf.json';

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var archivosJSON = JSON.parse(xhr.responseText);
                
                var documento = archivosJSON.documentos.find(function(doc) {
                    return doc.id === documentoID;
                });
                
                if (documento) {
                    var pdfPath = documento.ruta;
                    window.open(pdfPath, '_blank');
                } else {
                    console.error("No se encontró ningún documento con el ID especificado en el archivo JSON.");
                }
            } else {
                console.error("Error al cargar el archivo JSON: " + xhr.status);
            }
        }
    };
    xhr.open('GET', jsonPath, true);
    xhr.send();
}
