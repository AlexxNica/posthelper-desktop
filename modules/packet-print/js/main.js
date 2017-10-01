/** @namespace nw */
/** @namespace global.config */
/** @namespace global.config.postCode */
/** @namespace global.config.postName */

// requiring libs
const path = require('path');
const sql = require('sqlite-cipher');

let isInDB = false;
let addressDatabaseKey;

const elements = {
  quantityOutput: null,
  letterInput: null,
  numberInput: null,
  nameInput: null,
  streetInput: null,
  buildingInput: null,
  apartmentInput: null,
  packetsTable: null
};
const documents = {
  availableNames: [],
  availableStreets: [],
  packetsList: []
};
const dialogs = {
  loading: null,
  editPacket: null
};

function selectAddress(name) {
  const query = 'SELECT address FROM addresses WHERE name LIKE ?';
  sql.runAsync(
    query,
    [name],
    (rows) => {
      try {
        const address = rows[0].address.match(/[\wа-я]+/gi);
        // check for two-word street name
        if (address[1].search(/^[0-9].*$/) !== 0) { // 1 is the second word
          address[0] = address[0] + ' ' + address[1]; // compile it again
          // shift other items
          address[1] = address[2];
          address[2] = address[3];
        }
        elements.streetInput.val(address[0]);
        elements.buildingInput.val(address[1]);
        elements.apartmentInput.val(address[2]);
        $('#adrAddressApartment').focus();
        isInDB = true;
      }
      catch (e) {
        isInDB = false;
      }
    }
  );
}

function printBlank() {
  const now = new Date();
  const stampCode = 
    `<div class="stamp">
      ${now.toStringF()}г.<br>
      ${now.toStringT()}<br>
      <div class="postcode">
        <b>${global.config.postCode}</b>
      </div><br>
      ОПС<br>
      <div class="postname">
        ${global.config.postName}
      </div>
    </div>`;
  for (let index = 0; index <= 3; ++index) {
    adrList.push({
      number: '',
      name: '_____________________',
      address: '______________',
      timestamp: stampCode
    });
  }
  sendData();
}

function compileAddress() {
  const street = elements.streetInput.val();
  const building = elements.buildingInput.val();
  const apartment = elements.apartmentInput.val();
  return `${street} ${building}-${apartment}`;
}

function addElement() {

  $('table').colResizable();

  // check for count limit

  if (documents.packetsList.length >= 48) {
    alert('Досигнут максимум вложений в список.\nДля продолжения создайте новый список.');
    return;
  }

  // check for dd

  if (!isInDB) {
    // capitalize first letters of the name
    const name = elements.nameInput.val().split(' ').map((element) => {
      return element.charAt(0).toUpperCase() + element.slice(1);
    }).join(' ');
    sql.run(
      'INSERT INTO addresses (name, address) VALUES (?,?)',
      [name, compileAddress()]
    );
  }

  // add new record for the list

  const now = new Date();

  // generate timestamp
  const stampCode = 
    `<div class="stamp">
      ${now.toStringF()}г.<br>
      ${now.toStringT()}<br>
      <div class="postcode">
        <b>${global.config.postCode}</b>
      </div><br>
      ОПС<br>
      <div class="postname">
        ${global.config.postName}
      </div>
    </div>`;

  const packetNumber = elements.letterInput.val() + elements.numberInput.val();
  const packetName = elements.nameInput.val().split(' ').map((element) => {
    return element.charAt(0).toUpperCase() + element.slice(1);
  }).join(' ');
  const packetAddress = compileAddress();
  const packetTimestamp = stampCode;
  
  documents.packetsList.push({
    number: packetNumber,
    name: packetName,
    address: packetAddress,
    timestamp: stampCode
  });

  const quantity = documents.packetsList.length
  const documentNumber = quantity - 1;

  // add it to html
  elements.packetsTable.append(
    `<tr>
      <td>${packetNumber}</td>
      <td onclick="editPacket(${documentNumber})">${packetName}</td>
      <td>${packetAddress}</td>
    </tr>`
  );

  elements.quantityOutput.html(documents.packetsList.length);
  elements.nameInput.focus();

  // reset val to defaults
  if (elements.numberInput.val() !== '') {
    // increment item number
    elements.numberInput.val(parseInt(elements.numberInput.val()) + 1);
  } else {
    elements.numberInput.val('');
  }
  elements.nameInput.val('');
  elements.streetInput.val('');
  elements.buildingInput.val('');
  elements.apartmentInput.val('');

  isInDB = false;

  if (documents.packetsList.length === 48) {
    alert('Досигнут максимум вложений в список.\nДля продолжения создайте новый список.');
  }
}

function sendData() {
  let toPush; // placeholder for empty positions
  if ($('#noNumRadio').is(':checked')) {
    toPush = {
      number: '',
      name: '_____________________',
      address: '______________',
      timestamp: '<div class="stamp"></div>'
    };
  } else {
    toPush = {
      number: '____',
      name: '_____________________',
      address: '______________',
      timestamp: '<div class="stamp"></div>'
    };
  }
  // fill spaces in the notifications form
  if (documents.packetsList.length % 4 !== 0) {
    while (documents.packetsList.length % 4 !== 0) {
      documents.packetsList.push(toPush);
    }
  }
  nw.Window.open('modules/packet-print/html/print.html', { show: false }, (win) => {
    win.maximize();
    // data is the list
    win.window.data = documents.packetsList;
  });
}

function saveWaybill() {
  const now = new Date();
  const waybill = JSON.stringify(documents.packetsList);
  const blob = new Blob([waybill], {type: 'application/json'});
  // name contains month and day of creating waybill
  const filename = 'packets' + now.toStringFShort() + '.json';
  saveAs(blob, filename);
}

function loadWaybill () {
  //$('#file-input').trigger('click');
  const file = $('#file-input').get(0).files[0];
  if (file.name.match(/\.(txt|json)$/)) {
    const reader = new FileReader();
    reader.onload = () => {
      //console.log(reader.result);
      $('#packetTypeSelect').hide();
      $('#packetList').show();
      //noinspection JSCheckFunctionSignatures
      documents.packetsList = JSON.parse(reader.result);
      elements.quantityOutput.html(documents.packetsList.length);
      rebuildTable();
    };
    reader.readAsText(file);
  } else {
    alert('Ошибка: неправильный формат файла');
  }
}

function rebuildTable() {
  elements.packetsTable.find('td').parent().remove();
  for (let index = 0; index < documents.packetsList.length; ++index) {
    const number = documents.packetsList[index].number;
    const name = documents.packetsList[index].name;
    const address = documents.packetsList[index].address;
    elements.packetsTable.append(
      `<tr>
        <td>${number}</td>
        <td onclick="editPacket(${index})">${name}</td>
        <td>${address}</td>
      </tr>`
    );
  }
  $('table').colResizable();
}

function editPacket(number) {
  dialogs.editPacket.numberToEdit = number;
  dialogs.editPacket.dialog('open');
  const name = documents.packetsList[number].name;
  const address = documents.packetsList[number].address;
  $('#nameEdit').val(name);
  $('#addressEdit').val(address);
}

function savePacket(number) {
  documents.packetsList[number].name = $('#nameEdit').val();
  documents.packetsList[number].address = $('#addressEdit').val();
}

function changeField(event) {
  if (event.keyCode === 13) {
    selectAddress($('#adrName').val());
    if (isInDB) {
      document.getElementById('adrAddressApartment').focus();
    } else {
      document.getElementById('adrAddressStreet').focus();
    }
  }
}

function moduleInit() {

  dialogs.loading = $('#loadingDialog').dialog({
    autoOpen: false,
    closeOnEscape: false,
    resizable: false
  });

  $('#progressbar').progressbar({
    value: false
  });

  // hide table before waybill is created
  $('#packetTypeSelect').hide();
  $('#packetList').hide();

  $('#loadingDialog').dialog('open');

  // config loading
  documents.availableStreets = global.config.streets;

  // db loading
  documents.availableNames.splice(0, documents.availableNames.length);
  try {
    nw.Window.get().evalNWBin(null, path.join(nw.App.dataPath, 'Address Database Key'));
  } catch (e) {
    alert('Ошибка: не найден файл ключа\n\n' + e.stack);
    return;
  }
  const databasePath = path.join(nw.App.dataPath, 'Address Database');
  try {
    sql.connect(databasePath, addressDatabaseKey, 'aes-256-ctr');
  } catch (e) {
    alert('Ошибка: нет соединения с БД\n\n' + e.stack);
    return;
  }
  sql.runAsync(
    'SELECT name FROM addresses',
    (rows) => {
      for (let i = 0; i < rows.length; ++i) {
        documents.availableNames.push(rows[i].name);
      }
    }
  );
  //alert("db loaded");
  $('#loadingDialog').dialog('close');
  $('#packetTypeSelect').show();
  console.log('Database loaded');

  // set ediiting dialog properties
  dialogs.editPacket = $('#editDialog').dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      Удалить: () => {
        if (confirm('Вы действительно хотите удалить данную позицию?')) {
          documents.packetsList.splice(dialogs.editPacket.numberToEdit, 1);
          rebuildTable();
          elements.quantityOutput.html(documents.packetsList.length);
          dialogs.editPacket.dialog('close');
        }
      },
      Сохранить: () => {
        savePacket(dialogs.editPacket.numberToEdit);
        rebuildTable();
        dialogs.editPacket.dialog('close');
      },
      Отмена: () => {
        dialogs.editPacket.dialog( 'close' );
      }
    }
  });

  // initialize interface elements
  elements.quantityOutput = $('#scoreOutput');
  elements.letterInput = $('#adrLetter');
  elements.numberInput = $('#adrNumber');
  elements.nameInput = $('#adrName');
  elements.streetInput = $('#adrAddressStreet');
  elements.buildingInput = $('#adrAddressBuilding');
  elements.apartmentInput = $('#adrAddressApartment');
  elements.packetsTable = $('#adrList');

  $( 'input[type=\'radio\']' ).checkboxradio();

  $('#selectTypeButton').button().click((event) => {
    $('#packetTypeSelect').hide();
    if ($('#noNumRadio').is(':checked')) {
      $('#adrNumberLabel').hide();
      $('#adrLetter').hide();
      $('#adrNumber').hide();
    }
    $('#packetList').show();
  });

  $('#loadWaybillButton').button().click((event) => {
    loadWaybill();
  });

  elements.nameInput.autocomplete({
    source: (request, response) => {
      const results = $.ui.autocomplete.filter(documents.availableNames, request.term);
      response(results.slice(0, 10));
    }
  });

  elements.streetInput.autocomplete({
    source: documents.availableStreets
  });

  $('#addPacketButton').button().click((event) => {
    const street = elements.streetInput.val();
    const building = elements.buildingInput.val();
    const name = elements.nameInput.val();
    if (global.config.area[street][building] !== undefined) {
      if (confirm('Добавить данное вложение?\n' + name + '\n' + compileAddress())) {
        addElement();
      }
    } else {
      alert('Данный адрес не входит в участок отделения');
    }
  });

  $('#printPacketButton').button().click((event) => {
    sendData();
  });

  $('#saveWaybillButton').button().click((event) => {
    saveWaybill();
  });

  $('#printBlank').button().click((event) => {
    printBlank();
  });
}
