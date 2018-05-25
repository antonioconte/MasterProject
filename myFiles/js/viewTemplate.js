$(document).ready(function(){
    
    $(".editCurrentTemplate").click(function(){
       $.get("myFiles/page/editTemplate.html", function(data){
             data = data.replace("$TITLE_DOCUMENT$", currentTemplate);
             $.get("template/"+currentTemplate+".html", function(tmp){
                data = data.replace("$BODY_TEMPLATE$", tmp);
                $("#container").html(data);
             });
       });
    });
 
    $("#withoutVar").click(function(){
       $(".withoutVar").addClass('hide');
       $(".withVar").removeClass('hide');
       $("#withVar").removeClass('hide');
       $("#withoutVar").addClass('hide');
    });
    
    $("#withVar").click(function(){
       $(".withoutVar").removeClass('hide');
       $(".withVar").addClass('hide');
       $("#withVar").addClass('hide');
       $("#withoutVar").removeClass('hide');
    });
});