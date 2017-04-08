var adrList = [];
var count = 0;

function addElement() {
	// add new record for the list

	var now = new Date();

	var stampCode = "<div class=\"stamp\">" + now.toStringF() + "г.<br>" + now.toStringT() + "<br><div class=\"postcode\"><b>~index~</b></div><br>ОПС<br><div class=\"postname\">~postname~</div></div>";

	adrList.push(
		[
			$("#adrNumber").val(), 
			$("#adrName").val().split(' ').map(function(el) {return el.charAt(0).toUpperCase() + el.slice(1)}).join(' '),
			$("#adrAddress").val(),
			stampCode
		]
	);

	// add it to html
	$("#adrList").append(
		"<tr><td>" + 
		adrList[count][0] + "</td><td>" + 
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
	var newWindow = window.open('print.html');
	newWindow.data = adrList;
}

function saveWaybill() {
	var now = new Date();
	var waybill = JSON.stringify(adrList);
	var blob = new Blob([waybill], {type: "application/json"});
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
            for (var item = 0; item < adrList.length; ++item) {
            	$("#adrList").append(
					"<tr><td>" + 
					adrList[item][0] + "</td><td>" + 
					adrList[item][1] + "</td><td>" + 
					adrList[item][2] + 
					"</td></tr>"
				);
            }
            $("#scoreOutput").html(count);
        };

        reader.readAsText(file);    
    } else {
        alert("File not supported, .txt or .json files only");
    }
}

function packetPrintTabInit() {

	$("#packetList").hide();

	var availableStreets = [
	];

	$( "input[type='radio']" ).checkboxradio();

	$("#selectTypeButton").button();
	$("#selectTypeButton").click(function (event) {
		$("#packetTypeSelect").hide();
		if ($("#noNumRadio").is(":checked")) {
			$("#adrNumberLabel").hide();
			$("#adrNumber").hide();
		}
		$("#packetList").show();
	});

	$("#loadWaybillButton").button();
	$("#loadWaybillButton").click(function (event) {
		loadWaybill();
	});

	$("#adrAddress").autocomplete({
		source: availableStreets
	});

	$("#addPacketButton").button();
	$("#addPacketButton").click(function (event) {
        addElement();
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