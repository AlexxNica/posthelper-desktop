const elements = {
  dialogs: {
    addNote: null
  },
  tables: {
    notes: null
  },
  inputs: {
    receipt: null,
    delivery: null,
    return: null
  }
};
const databases = {
  remainders: null
};
const documents = {
  notesList: []
};

function rebuildTable() {
  elements.tables.notes.find('td').parent().remove();
  for (let item = 0; item < documents.notesList.length; ++item) {
    elements.tables.notes.append(
      `<tr>
        <td>${documents.notesList[item].date}</td>
        <td>${documents.notesList[item].startRemainder}</td>
        <td>${documents.notesList[item].receipt}</td>
        <td>${documents.notesList[item].delivery}</td>
        <td>${documents.notesList[item].return}</td>
        <td>${documents.notesList[item].endRemainder}</td>
      </tr>`
    );
  }
}

function updateList() {
  documents.notesList = [];
  databases.remainders.transaction((tx) => {
    tx.executeSql(
      'SELECT * from remainders DESC LIMIT 10',
      [],
      (tx, results) => {
        for (let index = 0; index < results.rows.length; ++index) {
          const item = results.rows.item(index);
          documents.notesList.push({
            date: item.date,
            startRemainder: item.startRemainder,
            receipt: item.receipt,
            delivery: item.delivery,
            return: item.return,
            endRemainder: item.endRemainder
          });
        }
        rebuildTable();
      }
    );
  });
}

function addNote(remainder, receipt, delivery, returned) {
  databases.remainders.transaction((tx) => {
    tx.executeSql(
      `INSERT INTO remainders 
        (date, startRemainder, receipt, delivery, return, endRemainder) 
      VALUES (?,?,?,?,?,?)`,
      [
        new Date().toDateString(),
        remainder,
        receipt,
        delivery,
        returned,
        remainder + receipt - delivery - returned
      ]
    );
  });
  updateList();
}

function moduleInit() {

  databases.remainders = openDatabase('storage-remainder', '1', '', 1024 * 1024);

  if (databases.remainders) {
    console.log('Database loaded');
  }

  documents.notesList = [];
  updateList();
  
  $('#addNoteButton').button().click((event) => {
    alert('Не создано сохранение');
    elements.dialogs.addNote.dialog('open');
  });

  elements.tables.notes = $('#notesTable');

  elements.inputs.receipt = $('#receiptEdit');
  elements.inputs.delivery = $('#deliveryEdit');
  elements.inputs.return = $('#returnEdit');

  elements.dialogs.addNote = $('#addNoteDialog').dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      Сохранить: () => {
        if (confirm('Добавить данную запись?')) {
          const remainder = parseInt(documents.notesList[documents.notesList.length - 1].endRemainder);
          const receipt = parseInt($('#receiptEdit').val());
          const delivery = parseInt($('#deliveryEdit').val());
          const returned = parseInt($('#returnEdit').val());
          addNote(remainder, receipt, delivery, returned);
          elements.dialogs.addNote.dialog('close');
          rebuildTable();
        }
      },
      Отмена: () => {
        elements.dialogs.addNote.dialog('close');
      }
    }
  });

  $('#evaluateReceiptButton').button({
    icon: 'ui-icon-calculator',
    showLabel: false
  }).click((event) => {
    const toEval = elements.inputs.receipt.val();
    elements.inputs.receipt.val(math.eval(toEval));
  });

  $('#evaluateDeliveryButton').button({
    icon: 'ui-icon-calculator',
    showLabel: false
  }).click((event) => {
    const toEval = elements.inputs.delivery.val();
    elements.inputs.delivery.val(math.eval(toEval));
  });

  $('#evaluateReturnButton').button({
    icon: 'ui-icon-calculator',
    showLabel: false
  }).click((event) => {
    const toEval = elements.inputs.return.val();
    elements.inputs.return.val(math.eval(toEval));
  });
}