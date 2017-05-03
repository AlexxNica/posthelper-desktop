/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global CryptoJS */

var db;
var availableNames = [];

function dbTestInit() {

    $("#dbTestWidget").hide();
    $("#inputDBWidget").hide();

    $("#createDBButton").button();
    $("#createDBButton").click(function (event) {
        openDB();
    });

    $("#initTableButton").button();
    $("#initTableButton").click( function (event) {
        if (confirm("Are you sure you want to init main table?")) {
            tableInit();
        }
    });

    $("#commitToDB").button();
    $("#commitToDB").click( function (event) {
        commitAddress();
    });

    $("#selectFromDB").button();
    $("#selectFromDB").click( function (event) {
        selectAddress($("#dbName").val());
    });

    $("#dbName").autocomplete({
        source: availableNames
    });

    $("#dialog").dialog({
        autoOpen: false,
        closeOnEscape: false,
        resizable: false,
    });

    $("#progressbar").progressbar({
      value: false
    });

    nw.Window.get().evalNWBin(null, 'key.bin');
    try {
        if (key !== undefined) {
            alert("Access granted");
            $("#dbTestWidget").show();
        }
    } catch (e) {
        alert("Key file not found");
    }
}

function openDB() {
    var bytes;
    var plaintext;
    $("#dialog").dialog("open");
    availableNames.splice(0, availableNames.length);
    db = openDatabase('encryptionDB', '0.1', 'crypted', 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql(
            'SELECT name FROM addresses',
            [],
            function(tx, results) {
                for (var i = 0; i < results.rows.length; ++i) {
                    bytes  = CryptoJS.AES.decrypt(results.rows.item(i).name.toString(), key);
                    plaintext = bytes.toString(CryptoJS.enc.Utf8);
                    availableNames.push(plaintext);
                    //availableNames.push(results.rows.item(i).name);
                }
            }
        );
    });
    alert("Database loaded");
    $("#dialog").dialog("close");
    $("#inputDBWidget").show();
}

function tableInit() {
	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS addresses (name, address)');
		alert("Done");
	});
}

function commitAddress() {
	var name = $("#dbName").val();
	var address = $("#dbAddress").val();
	db.transaction( function (tx) {
		tx.executeSql(
			'INSERT INTO addresses (name, address) VALUES (?,?)',
			[CryptoJS.AES.encrypt(name, key), address]
		);
	});
	alert(
		"Committed:\n" +
		name + "\n" +
		address
	);
}

function selectAddress(name) {
    var number = availableNames.indexOf(name) + 1;
	var query = 'SELECT address FROM addresses WHERE rowid = ?';
	db.transaction(function (tx) {
		tx.executeSql(
			query, 
			[number.toString()],
			function (tx, results) {
                //console.log(results);
    			//alert(results.rows.item(0).address);
    			$("#dbAddress").val(results.rows.item(0).address);
    		},
    		null
    	);
	});
}

