document.addEventListener("DOMContentLoaded", function() {
    console.log("El DOM ha sido cargado correctamente.");

    // Agregar un event listener para el evento de scroll
    window.addEventListener("scroll", function() {
        console.log("La página se ha desplazado.");
    });

    // Inicializar AOS
    AOS.init();
});

