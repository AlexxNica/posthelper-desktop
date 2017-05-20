var addressList = {
  "Last": {
    "1": [],
    "3": [],
    "5": []
  },
  "Least": {
    "3": [],
    "4": []
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