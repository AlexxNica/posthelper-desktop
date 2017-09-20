const dialogs = {};

function moduleInit() {
  
  $('#addNoteButton').button().click( (event) => {
    alert('Не создано сохранение');
    dialogs.addNote.dialog('open');
  });

  dialogs.addNote = $('#addNoteDialog').dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      Отмена: () => {
        dialogs.addNote.dialog('close');
      }
    }
  });
}