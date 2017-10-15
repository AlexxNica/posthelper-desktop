const elements = {
  tables: {
    main: null
  },
  dialogs: {
    editNote: null
  },
  buttons: {
    addNote: null,
    sendData: null
  }
};

function editNote(data) {
  elements.dialogs.editNote.dialog('open');
  $('#nameEdit').val(data[1]);
  $('#addressEdit').val(data[2]);
}

function initModule() {

  elements.tables.main = $('#example').DataTable({
    language: {
      "processing": "Подождите...",
      "search": "Поиск:",
      "lengthMenu": "Показать _MENU_ записей",
      "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
      "infoEmpty": "Записи с 0 до 0 из 0 записей",
      "infoFiltered": "(отфильтровано из _MAX_ записей)",
      "infoPostFix": "",
      "loadingRecords": "Загрузка записей...",
      "zeroRecords": "Записи отсутствуют.",
      "emptyTable": "В таблице отсутствуют данные",
      "paginate": {
        "first": "Первая",
        "previous": "Предыдущая",
        "next": "Следующая",
        "last": "Последняя"
      },
      "aria": {
        "sortAscending": ": активировать для сортировки столбца по возрастанию",
        "sortDescending": ": активировать для сортировки столбца по убыванию"
      }
    },
    rowId: 'ID',
    scrollY: 300,
    paging: false
  });

  $('#example').find('tbody').on('click', 'tr', function() {
    elements.dialogs.editNote.currentNote = this;
    editNote(elements.tables.main.row(this).data());
  });

  elements.buttons.addNote = $('#addButton').button().click((event) => {
    elements.tables.main.row.add([
      $('#numberInput').val(),
      $('#nameInput').val(),
      $('#addressInput').val()
    ]).draw(false);
  });

  elements.buttons.sendData =  $('#sendButton').button().click((event) => {
    const tableData = elements.tables.main.rows().data();
    const data = [];
    for (let index = 0; index < tableData.length; ++index) {
      data.push({
        number: tableData[index][0],
        name: tableData[index][1],
        address: tableData[index][2]
      });
    }
    console.log(data);
  });

  elements.dialogs.editNote = $('#editNoteDialog').dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      Сохранить: () => {
        const currentNote = elements.dialogs.editNote.currentNote;
        const currentData = elements.tables.main.row(currentNote).data();
        currentData[1] = $('#nameEdit').val();
        currentData[2] = $('#addressEdit').val();
        elements.tables.main.row(currentNote).data(currentData);
        elements.dialogs.editNote.dialog('close');
      },
      Удалить: () => {
        if (confirm('Вы действительно хотите удалить данную запись?')) {
          const currentNote = elements.dialogs.editNote.currentNote;
          elements.tables.main.row(currentNote).remove().draw(false);
          elements.dialogs.editNote.dialog('close');
        }
      },
      Отмена: () => {
        elements.dialogs.editNote.dialog('close');
      }
    }
  });
}