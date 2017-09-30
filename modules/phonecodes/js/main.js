const documents = {
  dictionary: []
}

function getCarrier(code) {
  if (documents.dictionary[code] === undefined) {
    return "Не найдено";
  }
  return documents.dictionary[code];
}

function phoneCodesTabInit() {
  $.getJSON("res/carriers.json", (data) => {
    documents.dictionary = data;
  })
  .fail(() => {
    $("#inputCodeWidget").html("<i>Ошибка загрузки базы данных</i>");
  });

  $("#findCodeButton").button().click((event) => {
    $("#carrierOutput").html(getCarrier($("#codeInput").val()));
  });

  const availableCodes = [
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
