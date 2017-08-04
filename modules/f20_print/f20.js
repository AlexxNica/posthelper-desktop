var indexList = [];

var indexInput;
var indexTableDocument;

function addIndex() {
  var index = indexInput.val();
  indexList.push(index);
  indexTableDocument.append('<tr><td>' + index + '</td></tr>');
}

function initF20() {
  indexInput = $('#indexInput');
  indexTableDocument = $('#indexTable');
  $('#addIndexButton').button().click( function (event) {
    addIndex();
  });
}