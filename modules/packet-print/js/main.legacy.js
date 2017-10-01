/** @namespace nw */
/** @namespace global.config */
/** @namespace global.config.postCode */
/** @namespace global.config.postName */

// requiring libs
var path = require('path');
var sql = require('sqlite-cipher');

var db; // database object
var adrList = []; // array contains packets
var addressString; // field for address
var availableStreets; // array for street autocomplete
var availableNames = []; // array for name autocomplete
var count = 0; // counter of packets in the waybil
var isInDB = false; // flag for checking name db selection
var editDialog; // object for jqueryui edit window
var numberToEdit = 0; // element for editing

// input fields
var adrLetterInput;
var adrNumberInput;
var adrNameInput;
var adrAddressStreetInput;
var adrAddressBuildingInput;
var adrAddressApartmentInput;

// list
var adrListDocument;

function selectAddress(name) {
  var query = 'SELECT address FROM addresses WHERE name LIKE ?';
  sql.runAsync(
    query,
    [name],
    function (rows) {
      try {
        var address = rows[0].address.match(/[\wа-я]+/gi);
        // check for two-word street name
        if (address[1].search(/^[0-9].*$/) !== 0) { // 1 is the second word
          address[0] = address[0] + ' ' + address[1]; // compile it again
          // shift other items
          address[1] = address[2];
          address[2] = address[3];
        }
        adrAddressStreetInput.val(address[0]);
        adrAddressBuildingInput.val(address[1]);
        adrAddressApartmentInput.val(address[2]);
        isInDB = true;
        if (isInDB) {
          document.getElementById('adrAddressApartment').focus();
        } else {
          document.getElementById('adrAddressStreet').focus();
        }
      }
      catch (e) {
        isInDB = false;
      }
    }
  );
}

function printBlank() {
  var now = new Date();
  var stampCode = 
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
  for (var i = 0; i <= 3; ++i) {
    adrList.push(['','_____________________','______________', stampCode]);
  }
  sendData();
}

function compileAddress() {
  addressString =
    adrAddressStreetInput.val() + ' ' +
    adrAddressBuildingInput.val() + '-' +
    adrAddressApartmentInput.val()
  ;
}

function addElement() {

  $('table').colResizable();

  // check for count limit

  if (count >= 48) {
    alert('Досигнут максимум вложений в список.\nДля продолжения создайте новый список.');
    return;
  }

  compileAddress();

  // check for dd

  if (!isInDB) {
    // capitalize first letters of the name
    var name = adrNameInput.val().split(' ').map(function(el) {
      return el.charAt(0).toUpperCase() + el.slice(1);
    }).join(' ');
    sql.run(
      'INSERT INTO addresses (name, address) VALUES (?,?)',
      [name, addressString]
    );
  }

  // add new record for the list

  var now = new Date();

  // generate timestamp
  var stampCode = 
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

  adrList.push(
    [
      adrLetterInput.val() + adrNumberInput.val(), // number (with letter)
      adrNameInput.val().split(' ').map(function(el) { // capitalized name
        return el.charAt(0).toUpperCase() + el.slice(1);
      }).join(' '),
      addressString, // address
      stampCode // timestamp
    ]
  );

  // add it to html
  adrListDocument.append(
    `<tr>
      <td>${adrList[count][0]}</td>
      <td onclick="editPacket(${count})">${adrList[count][1]}</td>
      <td>${adrList[count][2]}</td>
    </tr>`
  );

  count++;
  $('#scoreOutput').html(count);
  adrNameInput.focus();

  // reset val to defaults
  if (adrNumberInput.val() !== '') {
    // increment item number
    adrNumberInput.val( parseInt(adrNumberInput.val()) + 1 );
  } else {
    adrNumberInput.val('');
  }
  adrNameInput.val('');
  adrAddressStreetInput.val('');
  adrAddressBuildingInput.val('');
  adrAddressApartmentInput.val('');

  isInDB = false;

  if (count === 48) {
    alert('Досигнут максимум вложений в список.\nДля продолжения создайте новый список.');
  }
}

function sendData() {
  var toPush; // placeholder for empty positions
  if ($('#noNumRadio').is(':checked')) {
    toPush = [
      '',
      '_____________________','______________',
      '<div class="stamp"></div>'
    ];
  } else {
    toPush = [
      '____',
      '_____________________',
      '______________',
      '<div class="stamp"></div>'
    ];
  }
  // fill spaces in the notifications form
  if (adrList.length % 4 !== 0) {
    while (adrList.length % 4 !== 0) {
      adrList.push(toPush);
    }
  }
  nw.Window.open('modules/packet-print/html/print.html', { show: false }, function(win) {
    win.maximize();
    // data is the list
    win.window.data = adrList;
  });
}

function saveWaybill() {
  var now = new Date();
  var waybill = JSON.stringify(adrList);
  var blob = new Blob([waybill], {type: 'application/json'});
  // name contains month and day of creating waybill
  var filename = 'packets' + now.toStringFShort() + '.json';
  saveAs(blob, filename);
}

function loadWaybill () {
  //$('#file-input').trigger('click');
  var file = $('#file-input').get(0).files[0];
  if (file.name.match(/\.(txt|json)$/)) {
    var reader = new FileReader();
    reader.onload = function() {
      //console.log(reader.result);
      $('#packetTypeSelect').hide();
      $('#packetList').show();
      //noinspection JSCheckFunctionSignatures
      adrList = JSON.parse(reader.result);
      count = adrList.length;
      rebuildTable();
      $('#scoreOutput').html(count);
    };
    reader.readAsText(file);
  } else {
    alert('File not supported, .txt or .json files only');
  }
}

function rebuildTable() {
  adrListDocument.find('td').parent().remove();
  for (var item = 0; item < adrList.length; ++item) {
    adrListDocument.append(
      `<tr>
        <td>${adrList[item][0]}</td>
        <td onclick="editPacket(${item})">${adrList[item][1]}</td>
        <td>${adrList[item][2]}</td>
      </tr>`
    );
  }
  $('table').colResizable();
}

function editPacket(number) {
  numberToEdit = number;
  editDialog.dialog('open');
  $('#nameEdit').val(adrList[number][1]);
  $('#addressEdit').val(adrList[number][2]);
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

function packetPrintTabInit() {

  $('#loadingDialog').dialog({
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
  availableStreets = global.config.streets;

  // db loading
  availableNames.splice(0, availableNames.length);
  nw.Window.get().evalNWBin(null, path.join(nw.App.dataPath, 'Address Database Key'));
  try {
    if (key !== undefined) {
      //alert("Access granted");
    }
  } catch (e) {
    alert('Key file not found');
    return;
  }
  var dbpath = path.join(nw.App.dataPath, 'Address Database');
  sql.connect(dbpath, key, 'aes-256-ctr');
  sql.runAsync(
    'SELECT name FROM addresses',
    function (rows) {
      for (var i = 0; i < rows.length; ++i) {
        availableNames.push(rows[i].name);
      }
    }
  );
  //alert("db loaded");
  $('#loadingDialog').dialog('close');
  $('#packetTypeSelect').show();
  console.log('Database loaded');

  // set ediiting dialog properties
  editDialog = $('#editDialog').dialog({
    autoOpen: false,
    height: 400,
    width: 350,
    modal: true,
    buttons: {
      Удалить: function () {
        if (confirm('Вы действительно хотите удалить данную позицию?')) {
          adrList.splice(numberToEdit, 1);
          count = adrList.length;
          rebuildTable();
          $('#scoreOutput').html(count);
          editDialog.dialog('close');
        }
      },
      Сохранить: function() {
        adrList[numberToEdit][1] = $('#nameEdit').val();
        adrList[numberToEdit][2] = $('#addressEdit').val();
        rebuildTable();
        editDialog.dialog('close');
      },
      Отмена: function() {
        editDialog.dialog( 'close' );
      }
    }
  });

  // initialize interface elements
  adrLetterInput = $('#adrLetter');
  adrNumberInput = $('#adrNumber');
  adrNameInput = $('#adrName');
  adrAddressStreetInput = $('#adrAddressStreet');
  adrAddressBuildingInput = $('#adrAddressBuilding');
  adrAddressApartmentInput = $('#adrAddressApartment');
  adrListDocument = $('#adrList');

  $( 'input[type=\'radio\']' ).checkboxradio();

  $('#selectTypeButton').button().click(function (event) {
    $('#packetTypeSelect').hide();
    if ($('#noNumRadio').is(':checked')) {
      $('#adrNumberLabel').hide();
      $('#adrLetter').hide();
      $('#adrNumber').hide();
    }
    $('#packetList').show();
  });

  $('#loadWaybillButton').button().click(function (event) {
    loadWaybill();
  });

  adrNameInput.autocomplete({
    source: function(request, response) {
      var results = $.ui.autocomplete.filter(availableNames, request.term);
      response(results.slice(0, 10));
    }
  });

  adrAddressStreetInput.autocomplete({
    source: availableStreets
  });

  $('#addPacketButton').button().click(function (event) {
    try {
      if (global.config.area[adrAddressStreetInput.val()][adrAddressBuildingInput.val()] !== undefined) {
        compileAddress();
        if (confirm('Добавить данное вложение?\n' + adrNameInput.val() + '\n' + addressString)) {
          addElement();
        }
      } else {
        alert('Данный адрес не входит в участок отделения');
      }
    } catch (e) {
      alert('Данный адрес не входит в участок отделения');
    }
  });

  $('#printPacketButton').button().click(function (event) {
    sendData();
  });

  $('#saveWaybillButton').button().click(function (event) {
    saveWaybill();
  });

  $('#printBlank').button().click(function (event) {
    printBlank();
  });
}
