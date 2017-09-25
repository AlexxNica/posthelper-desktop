const dialogs = {};
const databases = {};

function moduleInit() {

  databases.remainders = openDatabase('storage-remainder', '1', '', 1024 * 1024);

  if (databases.remainders) {
    console.log('Database loaded');
  }
  
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