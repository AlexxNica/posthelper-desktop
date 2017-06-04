var evalInput;
var editDialog;

function statsInit() {
  $("#newButton").button().click(function(event){
    editDialog.dialog("open");
  });
  editDialog = $("#editDialog").dialog({
    autoOpen: false,
    height: 320,
    width: 470,
    modal: true,
    buttons: {
      Cancel: function() {
        editDialog.dialog("close");
      }
    }
  });
  evalInput = $("#evalInput");
  $("#evaluateButton").button({
    icon: "ui-icon-calculator",
    showLabel: false
  }).click(function(event){
    //var toEval = evalInput.val();
    var toEval = evalInput.val();
    //alert(toEval);
    evalInput.val(math.eval(toEval));
  });
  $("#button2").button({
    icon: "ui-icon-calculator",
    showLabel: false
  });
}