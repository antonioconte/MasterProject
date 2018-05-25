/* Doc è l'uri del documento da visualizzare
 * Questa funzione ha il compito di mostrare eventuali modifiche tra le istanze del documento
 * e i templati a cui queste istanze fanno riferimento
 * Ritorna un array con i campi:
 *  - mod -> true/false per indicare se ci sono state modifiche
 *  - bodyOriginal -> il corpo del documento senza modifiche
 *  - bodyModified -> il corpo del documento con modifiche
 *  - template -> array con i nomi dei template che sono stati modificati
 *  */
 
 /* Verifica se nel doc passato come parametro (uri del documento) ci sono state modifiche,
	ossia se qualche template a cui le istanze nel documento fanno riferimento sono cambiate
 */
function viewChanges(doc) {
  var docHtml = $.parseHTML(get(doc));
  var ret = {
    mod: false,									//booleano che serve per identificare se il documento necessita di aggiornamenti
    bodyOriginal: $(docHtml).html(),			//body originale del documento..per mantenere intatta la versione originale del documento
    bodyModified: "",							//inizializzata al body del documento senza modifiche verrà modificata con tutte le eventuali modifiche delle istanze
    domOriginal: $(docHtml),						//dom del documento originale
    domMod: "",									//dom del documento modificato
    instance: [],								//nomi delle istanze  prensenti nel documento
    template: []								//nomi delle istanze che hanno subito delle modifiche (se non ci sono state modifiche sarà vuoto)
  };

  var instance = $(docHtml).find("[data-template-instance]"); //oggetto html delle istanze
  var numInstance = instance.length;

  for(var i = 0; i < numInstance; i++) { //per ogni istanza prelevo il template da cui origina
    var uriTemplate = $(instance[i]).attr("data-template-instance");
    var nameTemplate = $(instance[i]).attr("data-template-name"); //nome del template la cui istanza fa riferimento
    (ret.instance).push(nameTemplate);
    var currentVersion = $(instance[i]).attr(
      "data-template-instance-version"); //versione del template su cui è basata l'istanza
    var templateHtml = $.parseHTML(get(uriTemplate)); //oggetto template 
    var versionTemplate = $(templateHtml).attr(
      "data-template-version"); //versione template

    if(versionTemplate != currentVersion) { //se il template e l'istanza hanno versione differente allora il template è stato aggiornato
      //si prendono tutte le variabili della istanza con relativo valore e si
      ret.mod = true;
      (ret.template).push(nameTemplate);
      $(instance[i]).addClass("updated");       //"marco" l'istanza come updated ossia per evidenzariare l'aggiornamento
      var instanceVariable = $(instance[i]).find(     //prende l'oggetto variabile dell'istanza
        "span[data-template-variable]");
      var numInstanceVariable = instanceVariable.length;
      var arrayInstanceVariable = []; //array che contiene le variabili (nome e contenuto) dell'istanza
      for(j = 0; j < numInstanceVariable; j++) {      //creo array con i campi che identificano il nome della variabile e il suo relativo valore
        var variableName = $(instanceVariable[j]).attr(
          "data-template-variable");
        var variableContent = $(instanceVariable[j]).text();
        arrayInstanceVariable[j] = {
          nameVar: variableName,
          contentVar: variableContent
        };
      }

      // prese le variabili con i contenuti dell'istanza passo a sostiutire le variabili alla nuova versione
      for(var j = 0; j < numInstanceVariable; j++) {
        var templateVariables = $(templateHtml).find("span[data-template-variable='"+arrayInstanceVariable[j].nameVar + "']");
        $(templateVariables).text(arrayInstanceVariable[j].contentVar);
      }
      var newInstance = $(templateHtml).html(); //ora qui è presente l'istanza aggiornata alla versione del template
      $(instance[i]).html(newInstance); //aggiornato il corpo dell'istanza
      $(instance[i]).attr("data-template-instance-version",
        versionTemplate); //aggiornata la versione dell'istanza
      var oldInstance = $(docHtml).find("div[data-template-name='" + nameTemplate +"']");
      $(oldInstance).attr("data-template-instance-version",versionTemplate);
      $(oldInstance).html(newInstance);
      $(oldInstance).prepend("<div class='info-changes'><b>Template:</b> "+nameTemplate+"<button style='float:right' title='Apply change' template='"+nameTemplate+"' class='applyTemplate btn btn-info'>Apply Change</button></div>");
      arrayInstanceVariable = null;
     
    }
  }
  ret.bodyModified = $(docHtml).html();
  ret.domMod = $(docHtml);
  return ret;
}


//chiamata asincrona di ajax per caricare l'html del template o documento passato come parametro (uri)
function get(data) {
  var ret;
  $.ajax({
    type: "GET",
    url: data + ".html",
    async: false,
    success: function(res) {
      ret = res;
    },
    error: function() {}
  });
  return ret;
}

/* doc è l'oggetto del documento senza modifiche
   docMod è l'oggetto del documento tutte le eventuali modifiche nelle istanze
   template è il nome del template la cui istanza si è scelti di aggiornare
   
  ritorna l'html del documento aggiornato all'ultima modifica del template
 */
function applyChanges(doc, docMod, template) {
  var newInstance = $(docMod).find("div[data-template-name='"+template + "']"); //prendo l'instanza aggiornata    
  var versione = $(newInstance).attr("data-template-instance-version");
  var oldInstance = $(doc).find("div[data-template-name='"+ template +"']");
  $(oldInstance).attr("data-template-instance-version", versione);
  $(oldInstance).html($(newInstance).html());
  $(newInstance).removeAttr("class");
  $(docMod).find(".info-changes").remove(); 
  return $(docMod).html();
}

/* Crea una notifica in base al paramentro passato */
function openNotify(type, time = 1000) {
  var notify = "";
  switch(type) {
    case 'delete_success':
      notify = multiNotify.delete_success;
      break;
    case 'save_success':
      notify = multiNotify.save_success;
      break;
    case 'view_mod_alert':
      notify = multiNotify.view_mod_alert;
      break;
    case 'save_success_template':
      notify = multiNotify.save_success_template;
      break;
    case 'update_success':
      notify = multiNotify.update_success;
      break;
    case 'update_success_template':
      notify = multiNotify.update_success_template;
      break;
    case 'update_instance_success':
      notify = multiNotify.update_instance_success;
      break;
    }
  $(".areaNotifiche").html(notify);
  $(".control-sidebar").addClass("control-sidebar-open");
  setTimeout(function() {
    $(".control-sidebar").removeClass("control-sidebar-open");
  }, time);
}

function openAlert(type) {
  $(".areaAlert").html("");
  var alert = "";
  switch(type) {
    case 'view_mod_alert':
      alert = multiAlert.view_mod_alert;
      break;

  }
  $(document).find(".areaAlert").html(alert);
}

//carica il documento, data è la pagina viewDocument in cui si vanno a sostituire le parole chiave come:
// $BODY_DOCUMENT_WITHOUT_TEMPLATE$ e $BODY_DOCUMENT_WITH_TEMPLATE$ con il body del documento
function loadDoc(data, title, body) {
  data = data.replace("$TITLE_DOCUMENT$", title);
  currentDoc = title;
  data = data.replace("$BODY_DOCUMENT_WITH_TEMPLATE$", body);
  data = data.replace("$BODY_DOCUMENT_WITHOUT_TEMPLATE$", body);
  $("#container").empty();
  $("#container").html(data);
}

//stesso discorso di loadDoc ma con il template, data è la pagina viewTemplate
function loadTemplateView(data, title, body) {
  data = data.replace("$TITLE_DOCUMENT$", title);
  currentTemplate = title;
  data = data.replace("$BODY_DOCUMENT$", body);
  data = data.replace("$BODY_DOCUMENT_WITHOUT_VAR$", body);
  $("#container").empty();
  $("#container").html(data);
}

//carica  i templati che si possono aggiungere nel modale
function loadTemplate() {
  $(document).find(".listTemplate").empty();
  var tmp = '<tr><td>$num$</td><td>$name$</td><td>$desc$</td>' +
    '<td><button template="$bNameTemplate$" type="button" class="loadTempinDoc btn btn-default">' +
    '<i class="fa fa-plus"></i></button></td></tr>';
  $.get("myFiles/php/loadMyTemplate.php", function(data) {
    var desc = "";
    for(var i = 0; i < data.length; i++) {
      //ricavo la descrizione del template
      $.ajax({
        type: "GET",
        async: false,
        url: "template/" + data[i],
        success: function(t) {
          desc = $($.parseHTML(t)).attr(
            "data-template-info");
        },
        error: function() {
          console.log("error des");
        }
      });
      var templateName = data[i].split(".html");
      var inTmp = tmp.replace("$num$", (i + 1));
      inTmp = inTmp.replace("$name$", templateName[0]);
      inTmp = inTmp.replace("$desc$", desc);
      inTmp = inTmp.replace("$bNameTemplate$", templateName[0]);
      $(".listTemplate").append(inTmp);
    }
  });
}

//relative può essere un oggetto per il doc
//oppure la versione del template
function metaDati(type, titolo, relative, desc) {
  $(".info-doc").html("Info");
  $(".bodyMetaDati").empty();
  $(".nomeMetaDati").html(titolo);
  if(type === "doc") {
    //carico instanze
    $(".tipoMetaDati").html("Document");
    $(".bodyMetaDati").append("<dt>Used Templates:</dt>");
    var ins = "";
    for(i = 0; i < relative.length; i++) {
      ins = ins + "<li>" + relative[i] + "</li>";
    }
    $(".bodyMetaDati").append("<dd>" + ins + "</dd>");
  } else if(type === "temp") {
    $(".tipoMetaDati").html("Template");
    $(".bodyMetaDati").append("<dt>Description:</dt>");
    $(".bodyMetaDati").append("<dd>" + desc.replace(/#./g, "'") + "</dd>");
    $(".bodyMetaDati").append("<dt>Version:</dt>");
    $(".bodyMetaDati").append("<dd>" + relative + "</dd>");
  }

}

//selezionata la variabile si può scegliere di eliminarla attraverso questa funzione
// che prende in input l'editor e dopo aver individuato l'area selezionata risale il dom fino ad incontrare
// l'attributo "data-template-variable" che identifica la variabile
// trovato l'elemento si prosegue con il copiare il contenuto in text, eliminare il nodo x e sostituirolo con il testo 
// che prima identificava una variabile
function removeVar(ed) {
  var x = ed.selection.getSel().extentNode.parentElement;
  while(1) {
    if(x.attributes.length === 0) {
      console.log("0");
    } else if(x.attributes[1].nodeName == "data-template-variable")
      break;
    x = x.parentElement;
  }
  var text = x.innerHTML;
  ed.dom.remove(x);
  tinyMCE.activeEditor.insertContent(text);
}

function loadMyDocs() {
  $.get(urlAss + "myFiles/php/loadMyDocs.php", function(data) {
    var numDoc = data.length;
    for(i = 0; i < numDoc; i++) {
      var doc = data[i];
      var title = doc.split(".html");
      var item = '<li><a class="openDoc" url="' + title[0] +
        '" href="#">' + title[0] + '</a></li>';
      $(".myDocList").append(item);
    }
  });
}

function loadMyTemplate() {
  $.get(urlAss + "myFiles/php/loadMyTemplate.php", function(data) {
    var numTmp = data.length;
    for(i = 0; i < numTmp; i++) {
      var tmp = data[i];
      var title = tmp.split(".html");
      var item = '<li><a class="openTemplate" url="' + tmp +
        '" href="#">' + title[0] + '</a></li>';
      $(".myTempList").append(item);
    }
  });
}

/* costruisce il modale per la modifica delle variabili
 * si risale il dom fino alla ricerca dell'elemento che abbia come primo attributo 
 * data-template-instance che identifica un'istanza. Trovato il nodo si selezionano tutte le varibili 
 * e se ne estrae nome, contenuto e tipo (span o altro). 
 * Se la variabile non è "avvolta" da uno span si utilizza l'editor Tiny per la modifica,
 * infatti in tal modo si può permettere una modifica di una variabile strutturata.
 * un semplice input per lo span può bastare
*/
function editVars(ed){
  $("#contentEditVar").empty();
  var x = ed.selection.getSel().extentNode.parentElement;
  while(1) {
    if(x.attributes.length === 0) {
      console.log("0");
    } else if(x.attributes[0].nodeName == "data-template-instance")
      break;
    x = x.parentElement;
  }
  var nameInstance = $(x).attr("data-template-name");
  $("#applyEditVariable").attr("template",nameInstance);
  $("#nomeTemplate").html(nameInstance);
  var vars = $(x).find("[data-template-variable]");
  var numVars = vars.length;     
  //se è span allora semplice textarea
  //se è un div -> tiny
  for(var i = 0; i<numVars; i++){
    var nameVar = $(vars[i]).attr("data-template-variable");
    var contentVar = $(vars[i]).html();
    var tipo = $(vars[i]).prop("tagName");
    var content;
    if(tipo == "SPAN"){ //INPUT
      content = "<input name='"+nameVar+"' class='form-control inputVar' type='text' value='"+contentVar+"'>";
    }else{  //TINY
      content = "<div name='"+nameVar+"' class='tiny_editVar'>"+contentVar+"</div>";
    }
    $("#contentEditVar").append("<div class='row'><div class='col-md-1'><label>"+nameVar +"</label></div><div class='col-md-11'>"+content+"</div></div>");
  }
  $("#contentEditVar").append("<script src='myFiles/js/tinyEditVar.js'></script>");
  $("#modalVarEdit").modal('show');
}

//ritorna oggetto con variabili dell'istanza (nome e contenuto)
/* function varInstance(nameInstance) {
  var doc = "<div>" + tinymce.activeEditor.getContent() + "</div>";
  var docDom = $.parseHTML(doc);
  var instanceDom = $(docDom).find("[data-template-name='" +
    nameInstance + "']");
  var variable = $(instanceDom).find("[data-template-variable]");
  var arrayInstanceVariable = []; //array che contiene le variabili (nome e contenuto) dell'istanza

  for(var i = 0; i < variable.length; i++) {
    var variableName = $(variable[i]).attr("data-template-variable");
    var variableContent = $(variable[i]).html();
    arrayInstanceVariable[i] = {
      nameVar: variableName,
      contentVar: variableContent
    };
  }
  return arrayInstanceVariable;
} */


//per il salvataggio dal modale
function saveDocWithUpdate(idWithTemplate){
    var text = tinymce.get(idWithTemplate).getContent();
    var newBody = "<div data-document='" + urlDoc +
      currentDoc + "'>";
    newBody = newBody + text + "</div>";
    var doc = {
      title: currentDoc,
      body: newBody
    };

    $.ajax({
      type: "POST",
      url: "myFiles/php/updateDoc.php",
      data: JSON.stringify(doc),
      success: function(data) {
        if(parseInt(data) > 0) openNotify('update_instance_success');
      },
      error: function() {
        alert("Error during update doc");
      }
    });
}