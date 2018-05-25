$(document).ready(function() {
    
    //carica nell'editor il documento che si è scelti di modificare
    $.get("myFiles/documents/" + currentDoc + ".html", function(doc) {
        tinyMCE.activeEditor.setContent(doc);
        idCurrentEditor = $(".tiny_editDoc").attr("id");

    });
   
});

