function secondaryUsual(date) {
  var supposedDate = date.subtractDays(7);
  if (!supposedDate.isHoliday()) {
    return supposedDate;
  } else {
    return null;
  }
}

function secondaryJudicial(date) {
  var supposedDate = date.subtractDays(3);
  if (!supposedDate.isHoliday()) {
    return supposedDate;
  } else {
    return null;
  }
}

function secondaryTabInit() {
  var todayDate = new Date();
  var secondaryUDate = secondaryUsual(new Date());
  var secondaryJDate = secondaryJudicial(new Date());
  var todayMsg = todayDate.toStringF() + ', ' + todayDate.dayOfWeek();
  $("#todayDate2").append(todayMsg);
  if (secondaryUDate === null) {
    $("#secondaryUsual").append("Нет вторичных извещений");
  } else {
    var secondaryUMsg = secondaryUDate.toStringF() + ', ' + secondaryUDate.dayOfWeek();
    $("#secondaryUsual").append(secondaryUMsg);
  }
  if (secondaryJDate === null) {
    $("#secondaryJudicial").append("Нет вторичных извещений");
  } else {
    var secondaryJMsg = secondaryJDate.toStringF() + ', ' + secondaryJDate.dayOfWeek();
    $("#secondaryJudicial").append(secondaryJMsg);
  }
}
