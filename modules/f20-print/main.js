var indexList = [];

var indexInput;
var indexTableDocument;

function addIndex() {
  var index = indexInput.val();
  indexList.push(index);
  indexTableDocument.append('<tr><td>' + index + '</td></tr>');
}

function sendToPrint() {
  var toPush = '';
  if (indexList.length % 6 !== 0) {
    while (indexList.length % 6 !== 0) {
      indexList.push(toPush);
    }
  }
  nw.Window.open('modules/f20-print/print.html', {}, function(win) {
    win.maximize();
    // data is the list
    win.window.data = indexList;
  });
}

function initF20() {
  indexInput = $('#indexInput');
  indexTableDocument = $('#indexTable');
  $('#addIndexButton').button().click( function (event) {
    addIndex();
  });
  $('#printIndexesButton').button().click( function (event) {
    sendToPrint();
  });
}