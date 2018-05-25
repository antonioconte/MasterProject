var user;
var title; //titolo per la creazione del documento
var titleTemplate; //titolo per la creazione del template
var docUpdate; //versione eventualmente aggiornata del doc
var currentDoc; //Titolo del documento visualizzato
var currentTemplate;
var docObject;
var descrTemplate;
var heightTiny = 490;
var numChanges;
var idCurrentEditor;
var urlAss = 'http://localhost/Tesi/MasterProject/';
var urlDoc = urlAss+'myFiles/documents/';
var urlTemplate = urlAss+'template/';

var multiNotify = {
    delete_success: '<div class="alert alert-success"><h4><i class="icon fa fa-trash fa-2x"></i> Document Deleted</h4></div>',
    save_success: '<div class="alert alert-success"><h4><i class="fa fa-floppy-o fa-2x" aria-hidden="true"></i> Document Saved</h4></div>',
    save_success_template: '<div class="alert alert-success"><h4><i class="fa fa-floppy-o fa-2x" aria-hidden="true"></i></i> Template Saved</h4></div>',
    update_success: '<div class="alert alert-success"><h4><i class="fa fa-upload fa-2x" aria-hidden="true"></i> Document Updated</h4></div>',
    update_instance_success: '<div class="alert alert-success"><h4><i class="fa fa-upload fa-2x" aria-hidden="true"></i> Istance Updates</h4></div>',
    update_success_template: '<div class="alert alert-success"><h4><i class="fa fa-upload fa-2x" aria-hidden="true"></i> Template Updated</h4></div>'
};
var multiAlert = {
    view_mod_alert: '<div class="alert alert-warning"><h4><i class="icon fa fa-warning fa-2x"></i>There are changes in some templates'+
    '&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" title="View Changes" id="viewMod" class="btn btn-danger"><i class="fa fa-file-text" aria-hidden="true"></i></button></h4></div>'
};