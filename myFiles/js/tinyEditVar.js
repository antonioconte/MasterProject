/*  incluso ed utilizzato per inizializzare l'editor per la modifica delle variabile
 *   situato all'interno del modale (newDoc e viewDoc)
*/

tinymce.init({
  selector: 'div.tiny_editVar',
  inline: true,
  height: 100,
  menubar: false,
  statusbar: false,
  content_css: [
    'myFiles/css/tiny.css'
    ]
});
