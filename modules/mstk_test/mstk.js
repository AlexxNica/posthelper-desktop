var addressList = {
	"Last": {
		"1": true,
		"3": true,
		"5": true
	},
	"Least": {
		"3": true,
		"4": true
	}
};

function mstkInit() {
	$("#checkAddressButton").button();
	$("#checkAddressButton").click(function (event) {
		checkAddress();
	});
	$("#list").html(JSON.stringify(addressList));
}

function checkAddress() {
	var street = $("#adrAddressStreet").val();
	var building = $("#adrAddressBuilding").val();
	try {
		if (addressList[street][building] !== undefined) {
			alert("Found");
		} else {
			alert("Not found");
		}
	} catch (e) {
		alert("Not found");
	}
}