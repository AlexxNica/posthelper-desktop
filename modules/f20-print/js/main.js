const documents = {
  indexList: []
};

const elements = {
  indexInput: null,
  indexTable: null
};

function addIndex() {
  const index = elements.indexInput.val();
  documents.indexList.push(index);
  elements.indexTable.append('<tr><td>' + index + '</td></tr>');
}

function sendToPrint() {
  const toPush = '';
  if (documents.indexList.length % 6 !== 0) {
    while (documents.indexList.length % 6 !== 0) {
      documents.indexList.push(toPush);
    }
  }
  nw.Window.open('modules/f20-print/html/print.html', {}, (win) => {
    win.maximize();
    // data is the list
    win.window.data = documents.indexList;
  });
}

function initF20() {
  elements.indexInput = $('#indexInput');
  elements.indexTable = $('#indexTable');
  $('#addIndexButton').button().click((event) => {
    addIndex();
  });
  $('#printIndexesButton').button().click((event) => {
    sendToPrint();
  });
}