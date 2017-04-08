var db;
var availableNames = [];

function dbTestInit() {

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
}

function openDB() {
	availableNames.splice(0, availableNames.length);
	db = openDatabase('addressDB', '0.1', 'adresses', 32 * 1024);
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
	alert("Database loaded");
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
			[name, address]
		);
	});
	alert(
		"Committed:\n" +
		name + "\n" +
		address
	);
}

function selectAddress(name) {
	var query = 'SELECT address FROM addresses WHERE name LIKE ?';
	db.transaction(function (tx) {
		tx.executeSql(
			query, 
			[name], 
			function (tx, results) {
    			//alert(results.rows.item(0).address);
    			$("#dbAddress").val(results.rows.item(0).address);
    		},
    		null
    	);
	});
}