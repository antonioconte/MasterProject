$(document).ready(function() {
  $(".editCurrentDoc").click(function() {
    $.get("myFiles/page/editDoc.html", function(data) {
      data = data.replace("$TITLE_DOCUMENT$", currentDoc);
      $("#container").html(data);
    });
  });

  $("#withoutTemplate").click(function() {
    $(".not-template-view").addClass('hide');
    $(".template-view").removeClass('hide');
    $("#withTemplate").removeClass('hide');
    $("#withoutTemplate").addClass('hide');
  });

  $("#withTemplate").click(function() {
    $(".not-template-view").removeClass('hide');
    $(".template-view").addClass('hide');
    $("#withTemplate").addClass('hide');
    $("#withoutTemplate").removeClass('hide');
  });

  $(document).on('click', '#viewMod', function() {
    $(document).find("#viewModDoc").modal("show");
  });

 
});
