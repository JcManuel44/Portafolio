function enviarMensaje() {
   emailjs.init('vYFSLmk58NrjMza_t');

   var txt_nombre = document.getElementById('id_txt_nombre').value;
   var txt_empresa = document.getElementById('id_txt_empresa').value;
   var txt_correo = document.getElementById('id_txt_correo').value;
   var txt_mensaje = document.getElementById('id_txt_mensaje').value;

   if (txt_nombre === '' || txt_empresa === '' || txt_correo === '' || txt_mensaje === '') {
      alert('Por favor, complete todos los campos.');
      return false;
   } else {

      var maxCaracteres_Nombre = 60;
      var maxCaracteres_Empresa = 70;
      var maxCaracteres_Correo = 70;
      var maxCaracteres_Mensaje = 300;

      if (txt_nombre.length > maxCaracteres_Nombre || txt_empresa.length > maxCaracteres_Empresa || txt_correo.length > maxCaracteres_Correo || txt_mensaje.length > maxCaracteres_Mensaje) {
         alert('Los campos exceden el límite de caracteres.');
         return false;
      } else {
         emailjs.send("service_se3xvqg", "template_fi2thvf", {
            txt_nombre: txt_nombre,
            txt_empresa: txt_empresa,
            txt_correo: txt_correo,
            txt_mensaje: txt_mensaje
         }).then(function (response) {
            alert('Mensaje enviado correctamente');

            // Limpiar los campos después de enviar el mensaje
            document.getElementById('id_txt_nombre').value = '';
            document.getElementById('id_txt_empresa').value = '';
            document.getElementById('id_txt_correo').value = '';
            document.getElementById('id_txt_mensaje').value = '';
         })
         .catch(function (error) {
            console.error('Error al enviar el mensaje', error);
            alert('Error al enviar el mensaje');
         });
      }
   }
}
