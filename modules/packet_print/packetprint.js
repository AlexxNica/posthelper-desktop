/* global nw */

var db; // database object
var adrList = []; // array contains packets
var availableNames = []; // array for name autocomplete
var count = 0; // counter of packets in the waybil
var isInDB = false; // flag for checking name db selection
var editDialog; // object for jqueryui edit window
var numberToEdit = 0; // element for editing

function selectAddress(name) {
    var query = 'SELECT address FROM addresses WHERE name LIKE ?';
    db.transaction(function (tx) {
        tx.executeSql(
            query,
            [name],
            function (tx, results) {
                //alert(results.rows.item(0).address);
                try {
                    $("#adrAddress").val(results.rows.item(0).address);
                    isInDB = true;
                }
                catch (e) {
                    isInDB = false;
                }
            },
            null
        );
    });
}

function addElement() {
    
    $("table").colResizable();
    
    // check for count limit
    
    if (count >= 32) {
        alert("Досигнут максимум вложений в список.\nДля продолжения создайте новый список.");
        return;
    }

    // check for dd

    if (isInDB === false) {
        var name = $("#adrName").val().split(' ').map(function(el) {return el.charAt(0).toUpperCase() + el.slice(1);}).join(' ');
        var address = $("#adrAddress").val();
        db.transaction( function (tx) {
            tx.executeSql(
                'INSERT INTO addresses (name, address) VALUES (?,?)',
                [name, address]
            );
        });
    }

    // add new record for the list

    var now = new Date();

    var stampCode = "<div class=\"stamp\">" + now.toStringF() + "г.<br>" + now.toStringT() + "<br><div class=\"postcode\"><b>~индекс~</b></div><br>ОПС<br><div class=\"postname\">~опс~</div></div>";

    adrList.push(
        [
            $("#adrLetter").val() + $("#adrNumber").val(), 
            $("#adrName").val().split(' ').map(function(el) {return el.charAt(0).toUpperCase() + el.slice(1);}).join(' '),
            $("#adrAddress").val(),
            stampCode
        ]
    );

    // add it to html
    $("#adrList").append(
        "<tr><td>" + 
        adrList[count][0] + "</td><td onclick=\"javascript: editPacket(" + count + ")\">" + 
        adrList[count][1] + "</td><td>" + 
        adrList[count][2] + 
        "</td></tr>"
    );

    count++;
    $("#scoreOutput").html(count);
    if($("#adrNumber").is(":hidden")) {
        $("#adrName").focus();
    } else {
        $("#adrNumber").focus();
    }

    // reset val to defaults
    if ($("#adrNumber").val() !== "") {
        $("#adrNumber").val( parseInt($("#adrNumber").val()) + 1 );
    } else {
        $("#adrNumber").val("");
    }
    $("#adrName").val("");
    $("#adrAddress").val("");

    isInDB = false;
}

function sendData() {
    var toPush;
    if ($("#noNumRadio").is(":checked")) {
        toPush = ["","_____________________","______________","<div class=\"stamp\"></div>"];
    } else {
        toPush = ["____","_____________________","______________","<div class=\"stamp\"></div>"];
    }
    if (adrList.length % 4 !== 0) {
        while (adrList.length % 4 !== 0) {
            adrList.push(toPush);
        }
    }
    nw.Window.open('res/packet_print/print.html', {"width": 1366, "height": 768}, function(win) {
        win.maximize();
        // data is the list
        win.window.data = adrList;
    });
}

function saveWaybill() {
    var now = new Date();
    var waybill = JSON.stringify(adrList);
    var blob = new Blob([waybill], {type: "application/json"});
    // name contains month and day of creating waybill
    var filename = "packets" + now.toStringFShort() + ".json";
    saveAs(blob, filename);
}

function loadWaybill () {
    //$('#file-input').trigger('click');
    var file = $('#file-input').get(0).files[0];
    if (file.name.match(/\.(txt|json)$/)) {
        var reader = new FileReader();
        reader.onload = function() {
            //console.log(reader.result);

            $("#packetTypeSelect").hide();
            $("#packetList").show();

            adrList = JSON.parse(reader.result);
            count = adrList.length;
            rebuildTable();
            $("#scoreOutput").html(count);
        };
        reader.readAsText(file);    
    } else {
        alert("File not supported, .txt or .json files only");
    }
}

function rebuildTable() {
    /*$("#adrList").html(
       "<tr class=\"ui-widget-header\">" +
           "<th>Вх. №</th>" +
           "<th width=\"300px\">Имя получателя</th>" +
           "<th>Адрес получателя</th>" +
       "</tr>"
    );*/
    $('#adrList td').parent().remove();
    for (var item = 0; item < adrList.length; ++item) {
        $("#adrList").append(
            "<tr><td>" + 
            adrList[item][0] + "</td><td onclick=\"javascript: editPacket(" + item + ")\">" + 
            adrList[item][1] + "</td><td>" + 
            adrList[item][2] + 
            "</td></tr>"
        );
    }
}

function editPacket(number) {
    numberToEdit = number;
    editDialog.dialog("open");
    $("#name").val(adrList[number][1]);
    $("#address").val(adrList[number][2]);
}

function packetPrintTabInit() {
    
    // hide table before waybill is created
    $("#packetList").hide();

    // db loading
    availableNames.splice(0, availableNames.length);
    db = openDatabase('addressDB', '0.1', 'adresses', 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql(
            'SELECT name FROM addresses',
            [],
            function(tx, results) {
                for (var i = 0; i < results.rows.length; ++i) {
                    availableNames.push(results.rows.item(i).name);
                }
            }
        );
    });
    console.log("Database loaded");

    var availableStreets = [
    ];

    // set ediiting dialog properties
    editDialog = $("#editDialog").dialog({
        autoOpen: false,
        height: 400,
        width: 350,
        modal: true,
        buttons: {
            Удалить: function () {
                if (confirm("Вы действительно хотите удалить данную позицию?")) {
                    adrList.splice(numberToEdit, 1);
                    count = adrList.length;
                    rebuildTable();
                    $("#scoreOutput").html(count);
                    editDialog.dialog("close");
                }
            },
            Сохранить: function() {
                adrList[numberToEdit][1] = $("#name").val();
                adrList[numberToEdit][2] = $("#address").val();
                rebuildTable();
                editDialog.dialog("close");
            },
            Отмена: function() {
                editDialog.dialog( "close" );
            }
        }
    });

    // initialize interface elements
    $( "input[type='radio']" ).checkboxradio();

    $("#selectTypeButton").button();
    $("#selectTypeButton").click(function (event) {
        $("#packetTypeSelect").hide();
        if ($("#noNumRadio").is(":checked")) {
            $("#adrNumberLabel").hide();
            $("#adrLetter").hide();
            $("#adrNumber").hide();
        }
        $("#packetList").show();
    });

    $("#loadWaybillButton").button();
    $("#loadWaybillButton").click(function (event) {
        loadWaybill();
    });

    $("#adrName").autocomplete({
        source: function(request, response) {
            var results = $.ui.autocomplete.filter(availableNames, request.term);
            response(results.slice(0, 10));
        }
    });

    $("#adrAddress").autocomplete({
        source: availableStreets
    });

    $("#addPacketButton").button();
    $("#addPacketButton").click(function (event) {
        if (confirm("Добавить данное вложение?\n" + $("#adrName").val() + "\n" + $("#adrAddress").val())) {
            addElement();
        }
    });
    
    $("#printPacketButton").button();
    $("#printPacketButton").click(function (event) {
        sendData();
    });

    $("#saveWaybillButton").button();
    $("#saveWaybillButton").click(function (event) {
    	saveWaybill();
    });
}