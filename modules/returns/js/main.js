function returnUsual(date) {
  const supposedDate = date.subtractDays(31);
  if (!supposedDate.isHoliday()) {
    return supposedDate;
  } else {
    return null;
  }
}

function returnJudicial(date) {
  const supposedDate = date.subtractDays(8);
  if (!supposedDate.isHoliday()) {
    return supposedDate;
  } else {
    return null;
  }
}

function returnsTabInit() {
  const todayDate = new Date();
  const returnUDate = returnUsual(new Date());
  const returnJDate = returnJudicial(new Date());
  const todayMsg = todayDate.toStringF() + ', ' + todayDate.dayOfWeek();
  $("#todayDate1").html(todayMsg);
  if (returnUDate === null) {
    $("#returnUsual").append("Нет возвратов");
  } else {
    const returnUMsg = returnUDate.toStringF() + ', ' + returnUDate.dayOfWeek();
    $("#returnUsual").append(returnUMsg);
  }
  if (returnJDate === null) {
    $("#returnJudicial").append("Нет возвратов");
  } else {
    const returnJMsg = returnJDate.toStringF() + ', ' + returnJDate.dayOfWeek();
    $("#returnJudicial").append(returnJMsg);
  }
}
