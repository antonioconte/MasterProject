$(document).ready(function() {
    //Impedirà a tutte le future richieste AJAX di essere memorizzate nella cache
    $.ajaxSetup({
        cache: false
    });
    loadMyDocs(); //carico i documenti presenti nella cartella 'documents'
    loadMyTemplate(); //carico i template presenti nella cartella 'template'

    //ripulische il container e mostra il modale per la creazione di un nuovo doc
    $("#newDoc").click(function() {
        $("#container").empty();
        $(".inputTitleDoc").val("");
        $('#modal-titleDoc').modal('show');
    });

    //il bottone che permette di iniziare ad editare un  nuovo documento
    // -> il titolo non dev'essere vuoto
    $("#buttonModalTitleDoc").click(function() {
        title = $(".inputTitleDoc").val();
        if (title !== "") {
            currentDoc = title;
            $('#modal-titleDoc').modal('hide');
            //Reset eventuale di errori
            $("#inputTitleDoc").val("");
            $.get(urlAss + "myFiles/page/newDoc.html", function(
                data) {
                data = data.replace("$TITOLO$", title);
                $("#container").html(data);
                loadTemplate();

            });
        }
    });

    $("#newTemplate").click(function() {
        $(".inputTitleTemplate").val("");
        $(".descrTemplate").val("");
        $('#modal-titleTemplate').modal('show');
    });


    $("#buttonModalTitleTemplate").click(function() {
        titleTemplate = $(".inputTitleTemplate").val();
       
        descrTemplate = $(".descrTemplate").val();
        descrTemplate = descrTemplate.replace(/'/g, "#.");

        if (titleTemplate !== "") {
            $('#modal-titleTemplate').modal('hide');
            //Reset eventuale di errori
            $("#inputTitleTemplate").val("");
            $.get(urlAss + "myFiles/page/newTemplate.html",
                function(data) {
                    data = data.replace("Title",
                        titleTemplate);
                    $("#container").html(data);
                });
        }
    });

    //true se il nome è già in uso 
    function checkName(name){
        var body = tinymce.activeEditor.getContent();
        var variable = $(body).find("*[data-template-variable]");
        var nameVar = [];
        for(var i=0; i<variable.length; i++){
            nameVar.push($(variable[i]).attr("data-template-variable"));
        }
        if(nameVar.indexOf(name) >= 0) return true;
        else return false;
    }
    
    //function checkPos(){
    //    var start = tinymce.activeEditor.selection.getStart();
    //    var end = tinymce.activeEditor.selection.getEnd();
    //    console.log(tinymce.activeEditor.selection.getSel());
    //    if (start === end) {
    //        var x = tinymce.activeEditor.selection.getSel().anchorNode.parentElement;
    //        while(1) {
    //            if(x.attributes.length === 0) console.log("0");
    //            else if(x.attributes[1].nodeName == "data-template-variable") {
    //                return true;
    //            }
    //        x = x.parentElement;
    //        }
    //    }
    //    return false;
    //}
    //crea la variabile al click del button del modale
    $("#createVarModalButton").click(function() {
        var name = $("#nameVar").val();
        if (name === "") return;
        
        //controllo sul nome, non dev'essere in uso
        if(checkName(name)){
            $("label.alert_error").html("Name already used");
            $("#nameVar").val("");
            return;            
        }
        
        //controllo sulla posizione -> NO variabile dentro variabile    
        //if(checkPos()){
        //      $("label.alert_error").html("it's not allowed to create variable into variable");
        //      return;
        //}
    
        $("label.alert_error").html("");
        
        var start = tinymce.activeEditor.selection.getStart();
        var end = tinymce.activeEditor.selection.getEnd();
        if (start === end) { //nello stesso elemento
            var text = tinymce.activeEditor.selection.getContent();
            if (text && text.length > 0) {
                tinymce.activeEditor.selection.setContent(
                    " <span style='height: 1px'></span><span title='" +
                    name + "' data-template-variable='" +
                    name + "'> " + text +
                    " </span><span style='height: 1px'></span> "
                );
            }
        } else { //selezione in diversi elementi
            var x;
            var textVar;
            var elem = tinymce.activeEditor.selection.getSel().anchorNode
                .parentElement.nodeName;
            console.log(elem);
            if (elem == "P" || elem == "LI" || elem == "UL") {
                var sel = tinymce.activeEditor.selection.getSel();
                var anchor = sel.anchorNode.parentElement; //prendo l'ancora
                var text = anchor.outerHTML; //inizializzo il testo che sarò la variabile con il testo del punto iniziale               
                var focus = sel.focusNode.parentElement; //prendo il focus

                var sibling = sel.anchorNode.parentElement.nextSibling; //il fratello dell'ancora
                while (sibling.outerHTML !== focus.outerHTML) { //continuo a ciclare fino ad arrivare al focus
                    text = text + sibling.outerHTML; //concateno la stringa varibile con gli elementi "centrali" alla selezione   
                    prevSibling = sibling; //per la cancellazione punto l'elemento corrente
                    sibling = sibling.nextSibling; //avanzo di fratello    
                    tinyMCE.activeEditor.dom.remove(prevSibling); //cancello l'elemento precedente
                }

                text = text + focus.outerHTML;
                tinyMCE.activeEditor.dom.remove(anchor); //rimuovo inizio e fine delle selezione sostituendole con 
                tinyMCE.activeEditor.dom.remove(focus); //il div che identifica la variabile
                tinyMCE.activeEditor.insertContent(
                    "<p style='height: 1px'></p><div title='" +
                    name + "' data-template-variable='" +
                    name + "'> " + text +
                    " </div><p style='height: 1px'></p>");

            } else if (elem == "TD" || elem == "TR" || elem ==
                "TBODY" || elem == "TABLE") {
                x = tinyMCE.activeEditor.selection.getSel().anchorNode
                    .parentElement;
                while (1) {
                    if (x.nodeName === "TABLE") break;
                    x = x.parentElement;
                }
                textVar = x.outerHTML;
                tinyMCE.activeEditor.dom.remove(x);
                tinyMCE.activeEditor.insertContent(
                    "<p style='height: 1px'></p><div title='" +
                    name + "' data-template-variable='" +
                    name + "'> " + textVar +
                    " </div><p style='height: 1px'></p>");
            }
        }
        $("#nameVar").val("");
        $("#createVar").modal("hide");
        return;
    });

    $(document).on("click", ".openDoc", function() {
        numChanges = 0;
        Pace.restart();
        docObject = null;
        var title = $(this).text();
        var url = $(this).attr("url");

        docObject = viewChanges("myFiles/documents/" + url);
        if (docObject.mod) {
            numChanges = docObject.template.length; //Variabile globale per identificare il numero di modifiche da effettuare
            docUpdate = docObject.bodyModified;
        }

        $.get(urlAss + "myFiles/page/viewDocument.html",
            function(data) {
                metaDati("doc", title, docObject.instance);
                data = data.replace("$TITLE_DOCUMENT$",
                    title);
                currentDoc = title;
                data = data.replace(
                    "$BODY_DOCUMENT_WITH_TEMPLATE$",
                    docObject.bodyOriginal);
                data = data.replace(
                    "$BODY_DOCUMENT_WITHOUT_TEMPLATE$",
                    docObject.bodyOriginal);
                if (docObject.mod) {
                    $("#previewDoc").html(docObject.bodyModified);
                }
                $("#container").html(data);
                if (docObject.mod) {
                    openAlert("view_mod_alert");
                    $(document).find("#viewMod").removeClass(
                        "hide");
                }
            });

    });

    $(document).on('click', ".applyTemplate", function() {
        var template = $(this).attr("template");
        var res = applyChanges(docObject.domOriginal, docObject.domMod, template);
        $(this).parent().removeAttr("class");
        $(this).remove(); //rimuovo il bottone

        var idWithoutTemplate = $(".tiny_viewDocWithoutTemplate").attr("id");
        tinymce.get(idWithoutTemplate).setContent(res); //senza template    
        var idWithTemplate = $(".tiny_viewDocWithTemplate").attr("id");
        tinymce.get(idWithTemplate).setContent(res); //con template
        saveDocWithUpdate(idWithTemplate);
        numChanges--; //decremento il numero di modifiche da effettuare
        if (numChanges === 0) {
            //se le modifiche sono finite nascondo l'alert e chiudo il modale
            $("#viewModDoc").modal('hide');
            $(".areaAlert").hide();
        }
    });

    $("#applyAllUpdate").click(function() {
        var numUpdate = docObject.template.length;
        var docMod = docObject.domMod;
        var docOri = docObject.domOriginal;
        for (var i = 0; i < numUpdate; i++) {
            docOri = applyChanges(docOri, docMod, docObject.template[i]);
        }
        var idWithoutTemplate = $(".tiny_viewDocWithoutTemplate").attr("id");
        tinymce.get(idWithoutTemplate).setContent(docOri); //senza template    
        var idWithTemplate = $(".tiny_viewDocWithTemplate").attr("id");
        tinymce.get(idWithTemplate).setContent(docOri); //con template
        saveDocWithUpdate(idWithTemplate);
        $("#viewModDoc").modal('hide');
        $(".areaAlert").hide();

    });

    //importa il template nel documento
    $(document).on('click', '.loadTempinDoc', function() {
        var nameTemplate = $(this).attr("template");
        var template = get(urlTemplate + nameTemplate);
        var templateDom = $.parseHTML(template);
        var verTemplate = $(templateDom).attr(
            "data-template-version");
        var url = urlTemplate + nameTemplate;
        var x =
            "<p style='height: 1px'></p><div data-template-instance='" +
            url + "' data-template-name='" + nameTemplate +
            "' data-template-instance-version='" + verTemplate +
            "'>";
        x = x + $(templateDom).html() +
            "</div><p style='height: 1px'></p>";
        tinyMCE.activeEditor.insertContent(x);
        $('#viewListTemplate').modal('hide');
    });

    //visualizza il template dalla lista
    $(document).on("click", ".openTemplate", function() {
        var title = $(this).text();
        //var url = $(this).attr("url");
        currentTemplate = title;
        var tempHTML = $.parseHTML((get(urlTemplate +
            currentTemplate)));
        var version = $(tempHTML).attr("data-template-version");
        var desc = $(tempHTML).attr("data-template-info");
        metaDati("temp", currentTemplate, version, desc);
        $.get("myFiles/page/viewTemplate.html", function(data) {
            $.get("template/" + title + ".html",
                function(tmp) {
                    loadTemplateView(data, title,
                        tmp);
                });
        });

    });

    $("#applyEditVariable").click(function() {
        var x = tinymce.get(idCurrentEditor).selection.getSel()
            .extentNode.parentElement;
        while (1) {
            if (x.attributes.length !== 0 && x.attributes[0].nodeName ==
                "id") break; //caso: new doc -> risalvo fino al body dell'editor
            else if (x.attributes.length !== 0 && x.attributes[
                    0].nodeName == "data-document") break; //caso: editDoc ->risalgo fino al div che contiente il documento
            x = x.parentElement;
        }
        var doc = "<div>" + $(x).html() + "</div>";
        var data_doc = urlDoc + currentDoc;
        var docDom = $.parseHTML(doc);
        var nameInstance = $(this).attr("template");
        var itemSimple = $(".inputVar");
        var itemComplex = $(".tiny_editVar");
        var newVar = [];
        if (itemSimple.length > 0) {
            for (var i = 0; i < itemSimple.length; i++) {
                var name = $(itemSimple[i]).attr("name");
                var content = $(itemSimple[i]).val();
                var item = {
                    nameVar: name,
                    contentVar: content
                };
                newVar.push(item);
            }
        }
        if (itemComplex.length > 0) {
            for (var j = 0; j < itemComplex.length; j++) {
                var name = $(itemComplex[j]).attr("name");
                var idVarTiny = $(".tiny_editVar[name='" + name +
                    "']").attr("id");
                var content = tinymce.get(idVarTiny).getContent();
                var item = {
                    nameVar: name,
                    contentVar: content
                };
                newVar.push(item);
            }
        }
        var instance = $(docDom).find("[data-template-name='" +
            nameInstance + "']");
        for (var z = 0; z < newVar.length; z++) {
            $(instance).find("[data-template-variable='" +
                newVar[z].nameVar + "']").html(newVar[z].contentVar);
        }
        $(docDom).find("[data-template-name='" + nameInstance +
            "']").html($(instance).html());
        tinymce.get(idCurrentEditor).setContent(
            "<div data-document='" + data_doc + "'>" + $(
                docDom).html() + "</div>");
    });

});