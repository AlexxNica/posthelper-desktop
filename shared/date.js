Date.prototype.toStringF = function () {
	var dd = this.getDate();
	var mm = this.getMonth() + 1;
	var yyyy = this.getFullYear();

	if (dd < 10) {
		dd = "0" + dd;
	}

	if (mm < 10) {
		mm = "0" + mm;
	}

    return dd + "." + mm + "." + yyyy;
};

Date.prototype.toStringFShort = function() {
	var dd = this.getDate();
	var mm = this.getMonth() + 1;

	if (dd < 10) {
		dd = "0" + dd;
	}

	if (mm < 10) {
		mm = "0" + mm;
	}

	return dd + "_" + mm;
};

Date.prototype.toStringT = function() {
	var hh = this.getHours();
	var mm = this.getMinutes();
	var ss = this.getSeconds();

	if (hh < 10) {
		hh = "0" + hh;
	}

	if (mm < 10) {
		mm = "0" + mm;
	}

	if (ss < 10) {
		ss = "0" + ss;
	}

	return hh + ":" + mm + ":" + ss;
};

Date.prototype.subtractDays = function(days) {
	this.setDate(this.getDate() - days);
	return this;
};

Date.prototype.isHoliday = function() {
	var day = this.getDay();
	switch (day) {
		case 0:
			return true;
		default:
			return false;
	}
};

Date.prototype.dayOfWeek = function() {
	var day = this.getDay();
	switch (day) {
		case 0:
			return "воскресенье";

		case 1:
			return "понедельник";

		case 2:
			return "вторник";

		case 3:
			return "среда";

		case 4:
			return "четверг";

		case 5:
			return "пятница";

		case 6:
			return "суббота";

		default:
			return null;
	}
};