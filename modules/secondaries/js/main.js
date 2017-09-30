function secondaryUsual(date) {
  const supposedDate = date.subtractDays(7);
  if (!supposedDate.isHoliday()) {
    return supposedDate;
  } else {
    return null;
  }
}

function secondaryJudicial(date) {
  const supposedDate = date.subtractDays(3);
  if (!supposedDate.isHoliday()) {
    return supposedDate;
  } else {
    return null;
  }
}

function secondaryTabInit() {
  const todayDate = new Date();
  const secondaryUDate = secondaryUsual(new Date());
  const secondaryJDate = secondaryJudicial(new Date());
  const todayMsg = todayDate.toStringF() + ', ' + todayDate.dayOfWeek();
  $("#todayDate2").append(todayMsg);
  if (secondaryUDate === null) {
    $("#secondaryUsual").append("Нет вторичных извещений");
  } else {
    const secondaryUMsg = secondaryUDate.toStringF() + ', ' + secondaryUDate.dayOfWeek();
    $("#secondaryUsual").append(secondaryUMsg);
  }
  if (secondaryJDate === null) {
    $("#secondaryJudicial").append("Нет вторичных извещений");
  } else {
    const secondaryJMsg = secondaryJDate.toStringF() + ', ' + secondaryJDate.dayOfWeek();
    $("#secondaryJudicial").append(secondaryJMsg);
  }
}
