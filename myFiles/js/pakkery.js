/*Inizializza l'editor relativo alla creazione di un nuovo Template
 * tale editor ha tutte le funzionalità dell'editor per la creazione dei doc
 * ma in aggiunga ha la possibilità di "promuovere" una parte del template a varibile
 * tale meccanismo per la promozione prevede di "avvolgere" (wrap) il testo selezionato
 * in base alla forma stabilita <span data-tempate-variable='nome-variabile'> [testo selezionato] </span>
 * la variabile appena creata avrà uno stile che la identificherà dal resto del testo del template.
 * Si può modificare tale stile attraverso la modifica del css: newTemplate.css
 * 
 * il meccanismo per la creazione della variabile è implementato attraverso il modal 'aggiungi variabile'
 */
tinymce.init({
  selector: 'div.tiny_newTemplate',
  fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt 42pt 50pt 64pt 72pt",
  height: heightTiny,
  plugins: [
    'autolink charmap lists link image  print preview anchor',
    'searchreplace visualblocks code wordcount',
    'insertdatetime advlist table contextmenu paste code'
  ],
  contextmenu: 'removeVariable',
  toolbar1: 'insertfile undo redo | styleselect |sizeselect | fontselect |  fontsizeselect | bold underline italic | bullist numlist outdent indent | link image',
  toolbar2: 'saveTemp variable removeVar',
  setup: function(ed) {
   

    ed.addMenuItem('removeVariable', {
      text: 'Remove Variable',
      onclick: function() {
        removeVar(ed);
      }
    });

    /*Al click  del bottone "salva" viene salvato il contenuto dell'editor
     *e il titolo. In seguito viene formattato secondo la forma
     *<div data-template="http://localhost/Tesi/MasterProject/template/nomeTemplate"
     *      data-template-name="nomeTemplate"
     *      data-tempate-version="1">
     *      ---------------content-----------
     *</div>
     *
     *Dopo aver creato questa struttura attraverso la chiamata ajax viene mandata
     *al modulo php saveTemplate.php che ha il compito di salvare il template nella cartella
     *template. Se tutto è andato bene l'esito avrà un valore >0 e verrà aggiunta la  riga
     *nella lista de "i miei template"
     */
    ed.addButton('saveTemp', {
      tooltip: 'Save Template',
      icon: 'mce-ico mce-i-save',
      onclick: function() {
        var content = tinymce.activeEditor.getContent();
        var titoloTemplate = titleTemplate;
        var init = "<div data-template='" + urlTemplate +
          titoloTemplate + "' " +
          "data-template-info='" + descrTemplate + "' " +
          "data-template-name='" + titoloTemplate +
          "' data-template-version='1'>";
        var end = "</div>";
        content = init + content + end;
        var tmp = {
          title: titoloTemplate,
          body: content
        };

        $.ajax({
          type: "POST",
          url: "myFiles/php/saveTemplate.php",
          data: JSON.stringify(tmp),
          async: false,
          success: function(data) {
            if(parseInt(data) > 0) {
              openNotify("save_success_template",
                2500);
              var item =
                "<li><a class='openTemplate' url='" +
                tmp.title + ".html' href='#'>" +
                tmp.title + "</a></li>";
                $("a.openTemplate[url='"+tmp.title+"']").remove();   //rimuovo l'eventuale riga precedente
                $(".myTempList").append(item);
            }
          },
          error: function() {
            alert("Error during save doc");
          }
        });
      }
    });
    ed.addButton('variable', {
      tooltip: 'Add variable',
      icon: 'mce-ico mce-i-plus',
      onclick: function() {
        $("#createVar").modal('show');
      }
    });

    ed.addButton('removeVar', {
      tooltip: 'Remove Variable',
      icon: 'mce-ico mce-i-tabledelete',
      onclick: function() {
        removeVar(ed);
      }
    });
  },
  content_css: [
    '//www.tinymce.com/css/codepen.min.css',
    'myFiles/css/newTemplate.css',
    'myFiles/css/tiny.css'
  ]
});

tinymce.init({
  selector: 'div.tiny_editTemplate',
  fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt 42pt 50pt 64pt 72pt",
  height: heightTiny,
  plugins: [
    'autolink charmap lists link image  print preview anchor',
    'searchreplace visualblocks code wordcount',
    'insertdatetime advlist table contextmenu paste code'
  ],
  contextmenu: 'removeVariable',
  toolbar1: 'insertfile undo redo | styleselect |sizeselect | fontselect |  fontsizeselect | bold underline italic | bullist numlist outdent indent | link image',
  toolbar2: 'saveTemp variable removeVar',
  setup: function(ed) {
    
    ed.addMenuItem('removeVariable', {
      text: 'Remove Variable',
      onclick: function() {
        removeVar(ed);
      }
    });

    ed.addButton('variable', {
      tooltip: 'Add variable',
      icon: 'mce-ico mce-i-plus',
      onclick: function() {
        $("#createVar").modal('show');
      }
    });

    ed.addButton('removeVar', {
      tooltip: 'Remove Variable',
      icon: 'mce-ico mce-i-tabledelete',
      onclick: function() {
        removeVar(ed);
      }
    });

    ed.addButton('saveTemp', {
      tooltip: 'Save Template',
      icon: 'mce-ico mce-i-save',
      onclick: function() {
        var versionTemplate, descrTemplate;
        $.ajax({
          type: "GET",
          url: "template/" + currentTemplate +
            ".html",
          async: false,
          success: function(doc) {
            var dom = $.parseHTML(doc);
            versionTemplate = parseInt($(dom).attr(
              "data-template-version"));
            descrTemplate = $(dom).attr(
              "data-template-info");
          }
        });
        var res = tinyMCE.activeEditor.getContent();
        var resDOM = $.parseHTML(res);
        text = $(resDOM).html();
        text = "<div data-template='" + urlTemplate +
          currentTemplate +
          "' data-template-name='" + currentTemplate +
          "' data-template-info='" + descrTemplate +
          "' data-template-version='" + (versionTemplate +
            1) + "'>" + text + "</div>";
        var doc = {
          title: currentTemplate,
          body: text
        };
        $.ajax({
          type: "POST",
          url: "myFiles/php/updateTemplate.php",
          data: JSON.stringify(doc),
          async: false,
          success: function() {
            openNotify('update_success_template',
              2500);
          },
          error: function() {
            alert("Error during update doc");
          }
        });
      }
    });
  },
  content_css: [
    '//www.tinymce.com/css/codepen.min.css',
    'myFiles/css/newTemplate.css',
    'myFiles/css/tiny.css'
  ]
});

/* Inizializza l'editor per la visualizzazione dei template
 * Questa volta l'editor è in sola lettura (campo readonly: true)
 * e i campi "variabile" sono evidenziati attraverso un certo stile
 * modificabile nel file css: viewTemplate.css
 */
tinymce.init({
  selector: 'div.tiny_viewTemplate',
  height: heightTiny,
  toolbar: false,
  menubar: false,
  statusbar: false,
  readonly: true,
  content_css: [
    'myFiles/css/viewTemplate.css',
    'myFiles/css/tiny.css'
  ]
});

tinymce.init({
  selector: 'div.tiny_viewTemplateWithoutVar',
  height: heightTiny,
  toolbar: false,
  menubar: false,
  statusbar: false,
  readonly: true,
  content_css: 'myFiles/css/tiny.css'
});

/* Inizializza l'editor per la visualizzazione del documento
 * Questa volta l'editor è in sola lettura (campo readonly: true)
 * Le parti istanze di template e le variabili sono evidenziate
 * (attraverso un certo stile modificabile nel file css: viewDocument.css)
 * per essere notate da chi legge i doc
 */
tinymce.init({
  selector: 'div.tiny_viewDocWithTemplate',
  toolbar: false,
  height: heightTiny,
  menubar: false,
  statusbar: false,
  readonly: true,
  content_css: [
    'myFiles/css/tiny.css',
    //'//www.tinymce.com/css/codepen.min.css',
    'myFiles/css/viewDocumentWithTemplate.css'
  ]
});

tinymce.init({
  selector: 'div.tiny_viewDocWithoutTemplate',
  toolbar: false,
  height: heightTiny,
  menubar: false,
  statusbar: false,
  readonly: true,
  content_css: [
    '//www.tinymce.com/css/codepen.min.css',
    'myFiles/css/tiny.css'
  ]
});

/*Inizializza l'editor relativo alla creazione di un nuovo Documento
*/
tinymce.init({
  selector: 'div.tiny_newDoc',
  fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt 42pt 50pt 64pt 72pt",
  height: heightTiny,
  plugins: [
    'autolink charmap lists link image  print preview anchor',
    'searchreplace visualblocks code wordcount',
    'insertdatetime advlist table contextmenu paste code'
  ],
  toolbar1: 'insertfile undo redo | styleselect |sizeselect | fontselect |  fontsizeselect | bold underline italic | bullist numlist outdent indent | link image',
  toolbar2: 'saveDoc addTemplate',
  contextmenu: 'editVars',
  setup: function(ed) {
    /* Si analizza il dom del documento da modificare per
     * individuare le istanze presenti nel documento
     * creando un menu a tendina per la modifica delle variabili
     */
     ed.addMenuItem('editVars', {
      text: 'Edit Variables',
      onclick: function() {
        editVars(ed);
      }
    });
      
    /*al click del bottone "salva"
    vengono salvati il titolo e il contenuto del documento da salvare
    e vengono mandati al modulo php che ha il compito di salvare su file system
    il file .html
    il body che viene mandato è formattato secondo lo standard dei documenti
    -- <div data-document="urlDoc/nome-doc"> ... </div>
    
    se il doc è stato salvato correttamente il modulo saveDoc.php ritorna un valore > 0
    se la scrittura è andata a buon fine e in seguito viene aggiunto in tempo reale la riga del doc creato
    nella lista "i miei Documenti"
    */
    ed.addButton('saveDoc', {
      tooltip: 'Save Document',
      icon: 'mce-ico mce-i-save',
      onclick: function() {
        var content = tinymce.activeEditor.getContent();
        if(title === "") return; //controllo sul titolo
        var init = "<div data-document='" + urlDoc +
          title + "'>";
        var end = "</div>";
        content = init + content + end;
        var doc = {
          title: title,
          body: content
        };
        $.ajax({
          type: "POST",
          url: "myFiles/php/saveDoc.php",
          data: JSON.stringify(doc),
          async: false,
          success: function(data) {
            //todo: funzione che accoda nella lista de 'i miei doc' il doc creato
            if(parseInt(data) > 0) {
              openNotify("save_success", 2500);
              var item =
                "<li><a class='openDoc' url='" +
                doc.title + "' href='#'>" + doc.title +
                "</a></li>";
                $("a.openDoc[url='"+doc.title+"']").remove();   //rimuovo l'eventuale riga precedente
              $(".myDocList").append(item);
            }
          },
          error: function() {
            alert("Error during save doc");
          }
        });
      }
    });
    ed.addButton('addTemplate', {
      tooltip: 'Add Template',
      icon: 'mce-ico mce-i-paste',
      onclick: function() {
        $("#viewListTemplate").modal('show');
      }

    });
  },
  content_css: [
    '//www.tinymce.com/css/codepen.min.css',
    'myFiles/css/tiny.css',
    'myFiles/css/viewDocumentWithTemplate.css'
  ]
});


tinymce.init({
  selector: 'div.tiny_editDoc',
  fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt 42pt 50pt 64pt 72pt",
  height: heightTiny,
  plugins: [
    'autolink charmap lists link image  print preview anchor',
    'searchreplace visualblocks code wordcount',
    'insertdatetime advlist table contextmenu paste code'
  ],
  toolbar1: 'insertfile undo redo | styleselect |sizeselect | fontselect |  fontsizeselect | bold underline italic | bullist numlist outdent indent | link image',
  toolbar2: 'saveDoc addTemplate editVar',
  contextmenu: 'editVars',
  setup: function(ed) {
    
     ed.addMenuItem('editVars', {
      text: 'Edit Variables',
      onclick: function() {
        editVars(ed);
      }
    });
    /* Si analizza il dom del documento da modificare per
     * individuare le istanze presenti nel documento
     * creando un menu a tendina per la modifica delle variabili
     */

    ed.addButton('saveDoc', {
      tooltip: 'Save Document',
      icon: 'mce-ico mce-i-save',
      onclick: function() {
        var text = tinymce.get(idCurrentEditor).getContent();
        var doc = {
          title: currentDoc,
          body: text
        };
        $.ajax({
          type: "POST",
          url: "myFiles/php/updateDoc.php",
          data: JSON.stringify(doc),
          async: false,
          success: function(data) {
            openNotify('update_success', 2500);
          },
          error: function() {
            alert("Error during update doc");
          }
        });

      }
    });
    ed.addButton('addTemplate', {
      tooltip: 'Add Template',
      icon: 'mce-ico mce-i-paste',
      onclick: function() {
        loadTemplate();
        $("#viewListTemplate").modal('show');
      }

    });
  },
  content_css: ['//www.tinymce.com/css/codepen.min.css',
    'myFiles/css/viewDocumentWithTemplate.css',
    'myFiles/css/tiny.css'
  ]
});