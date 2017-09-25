function returnUsual(date) {
  var supposedDate = date.subtractDays(31);
  if (!supposedDate.isHoliday()) {
    return supposedDate;
  } else {
    return null;
  }
}

function returnJudicial(date) {
  var supposedDate = date.subtractDays(8);
  if (!supposedDate.isHoliday()) {
    return supposedDate;
  } else {
    return null;
  }
}

function returnsTabInit() {
  var todayDate = new Date();
  var returnUDate = returnUsual(new Date());
  var returnJDate = returnJudicial(new Date());
  var todayMsg = todayDate.toStringF() + ', ' + todayDate.dayOfWeek();
  $("#todayDate1").html(todayMsg);
  if (returnUDate === null) {
    $("#returnUsual").append("Нет возвратов");
  } else {
    var returnUMsg = returnUDate.toStringF() + ', ' + returnUDate.dayOfWeek();
    $("#returnUsual").append(returnUMsg);
  }
  if (returnJDate === null) {
    $("#returnJudicial").append("Нет возвратов");
  } else {
    var returnJMsg = returnJDate.toStringF() + ', ' + returnJDate.dayOfWeek();
    $("#returnJudicial").append(returnJMsg);
  }
}
