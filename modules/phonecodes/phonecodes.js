var dict;

function getCarrier(code) {
  if (dict[code] === undefined) {
    return "Не найдено";
  }
  return dict[code];
}

function phoneCodesTabInit() {
  $.getJSON("carriers.json", function(data) {
    dict = data;
  })
  .fail(function(){
    $("#inputCodeWidget").html("<i>Ошибка загрузки базы данных</i>");
  });

  $("#findCodeButton").button().click(function (event) {
    $("#carrierOutput").html(getCarrier($("#codeInput").val()));
  });

  var availableCodes = [
    "900",
    "911",
    "921",
    "931",
    "950"
  ];

  $("#codeInput").autocomplete({
    source: availableCodes
  });
}
