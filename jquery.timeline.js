/// <reference path="../../../Scripts/jQuery/jquery-1.4.1.min-vsdoc.js" />
/// <reference path="DateExtensions.js" />

// localization

Date.locale = {
    en: {
        month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
	ru: {
        month_names: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        month_names_short: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    },
    ko: {
        month_names: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
        month_names_short: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월','12월']
    }
};

// date extensions

Date.prototype._toString = Date.prototype.toString;

Date.prototype.toString = function (format, lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    var self = this;
    var p = function p(s) {
        return (s.toString().length == 1) ? "0" + s : s;
    };
    return format ?
    format.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g, function (format) {
        switch (format) {
            case "hh": return p(self.getHours() < 13 ? self.getHours() : (self.getHours() - 12));
            case "h": return self.getHours() < 13 ? self.getHours() : (self.getHours() - 12);
            case "HH": return p(self.getHours());
            case "H": return self.getHours();
            case "mm": return p(self.getMinutes());
            case "m": return self.getMinutes();
            case "ss": return p(self.getSeconds());
            case "s": return self.getSeconds();
            case "yyyy": return self.getFullYear();
            case "yy": return self.getFullYear().toString().substring(2, 4);
            case "dddd": return self.getDayName();
            case "ddd": return self.getDayName(true);
            case "dd": return p(self.getDate());
            case "d": return self.getDate().toString();
            case "MMMM": return self.getMonthName(lang);
            case "MMM": return self.getMonthNameShort(lang);
            case "MM": return p((self.getMonth() + 1));
            case "M": return self.getMonth() + 1;
            case "t": return self.getHours() < 12 ? Date.CultureInfo.amDesignator.substring(0, 1) : Date.CultureInfo.pmDesignator.substring(0, 1);
            case "tt": return self.getHours() < 12 ? Date.CultureInfo.amDesignator : Date.CultureInfo.pmDesignator;
            case "zzz":
            case "zz":
            case "z": return "";
        }
    }) : this._toString();
};

Date.prototype.moveToMonday = function() {
    if (this.getDay() != 1)
        this.addDays(1 - this.getDay());
};

Date.prototype.moveToSunday = function() {
    if (this.getDay() != 0)
        this.addDays(7 - this.getDay());
};

Date.prototype.addDays = function(days) {
    this.setMilliseconds(this.getMilliseconds() + (days * 24 * 60 * 60 * 1000));
};

Date.prototype.addWeeks = function(weeks) {
    this.addDays(weeks * 7);
};

Date.prototype.addMonths = function(months) {
    var currentMonth = this.getMonth();
    var currentYear = this.getFullYear();

    var years = Math.floor(Math.abs(months) / 12);

    if (months > 0) {
        if (years > 0) {
            currentYear += years;
            months -= years * 12;
        }

        currentMonth = currentMonth + months;
        if (currentMonth >= 12) {
            currentYear += 1;
            currentMonth -= 12;
        }
    } else {
        if (years > 0) {
            currentYear -= years;
            months += years * 12;
        }

        currentMonth = currentMonth + months;
        if (currentMonth < 0) {
            currentYear -= 1;
            currentMonth += 12;
        }
    }

    this.setMonth(currentMonth);
    this.setYear(currentYear);
};

Date.prototype.differenceInFullMonths = function(date) {
    var months;

    months = (date.getFullYear() - this.getFullYear()) * 12;
    months -= this.getMonth() + 1;
    months += date.getMonth();

    if (months < 0) months = 0;

    return months;
};

Date.prototype.getDaysInMonthCount = function() {
    return 32 - new Date(this.getYear(), this.getMonth(), 32).getDate();
};

Date.prototype.getMonthName = function (lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    var month = this.getMonth();
    return Date.locale[lang].month_names[month];
};

Date.prototype.getNextMonthName = function (lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    var month = this.getMonth() + 1;
    if (month >= 12) month = 0;
    return Date.locale[lang].month_names[month];
};

Date.prototype.getMonthNameShort = function (lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    var month = this.getMonth();
    return Date.locale[lang].month_names_short[month];
};

Date.prototype.getNextMonthNameShort = function (lang) {
    lang = lang && (lang in Date.locale) ? lang : 'en';
    var month = this.getMonth() + 1;
    if (month >= 12) month = 0;
    return Date.locale[lang].month_names_short[month];
};

Date.prototype.getWeek = function() {
    var determinedate = new Date();
    determinedate.setFullYear(this.getFullYear(), this.getMonth(), this.getDate());
    var D = determinedate.getDay();
    if (D == 0) D = 7;
    determinedate.setDate(determinedate.getDate() + (4 - D));
    var YN = determinedate.getFullYear();
    var ZBDoCY = Math.floor((determinedate.getTime() - new Date(YN, 0, 1, -6)) / 86400000);
    var WN = 1 + Math.floor(ZBDoCY / 7);
    return WN;
};

// plugin

(function ($) {
    $.fn.timeline = function (options) {

        // calculate how much days in the period
        function getDaysCount(startDate, finishDate) {
            var duration = finishDate - startDate;
            var totalDays = duration / (24 * 60 * 60 * 1000);
            return Math.round(totalDays);
        }

        // return array of months in th period
        function getMonths(startDate, finishDate, language) {
            if (!language) language = "en";

            // calculate how much months in the period, including start and finish months
            var totalMonthsInPeriod = (finishDate.getFullYear() - startDate.getFullYear()) * 12;
            totalMonthsInPeriod -= startDate.getMonth() + 1;
            totalMonthsInPeriod += finishDate.getMonth() + 1 + 1;

            var months = [];

            // fill months
            var curDate = new Date(startDate);
            var startDateMonth = startDate.getMonth();
            var startDateYear = startDate.getFullYear();
            var finishDateMonth = finishDate.getMonth();
            var finishDateYear = finishDate.getFullYear();
            for (var i = 0; i < totalMonthsInPeriod; i++) {

                var daysInMonth = 0;
                var currMonth = curDate.getMonth();
                var currYear = curDate.getFullYear();

                if (currMonth == startDateMonth && currYear == startDateYear) {
                    daysInMonth = startDate.getDaysInMonthCount() - startDate.getDate() + 1;
                } else if (currMonth == finishDateMonth && currYear == finishDateYear) {
                    daysInMonth = finishDate.getDate() - 1;
                    if (daysInMonth == 0) continue;
                } else {
                    daysInMonth = curDate.getDaysInMonthCount();
                }

                months[i] = { number: currMonth, name: curDate.getMonthName(language), daysCount: daysInMonth };

                curDate.addMonths(1);

                var expectedMonth = currMonth + 1;
                if (expectedMonth > 11) {
                    expectedMonth = 0;
                }

                if (curDate.getMonth() > expectedMonth) {
                    curDate.addDays(0 - curDate.getDate());
                }
            }

            return months;
        }

        // return array of months in th period
        function getWeeks(startDate, finishDate) {
            // calculate how much weeks in the period, including start and finish weeks
            var totalWeeksInPeriod = 1;

            var curDate = new Date(startDate);
            curDate.setHours(0, 0, 0, 0);
            curDate.moveToSunday();

            var endDate = new Date(finishDate);
            endDate.setHours(0, 0, 0, 0);

            while (curDate < endDate) {
                totalWeeksInPeriod += 1;
                curDate.addWeeks(1);
            }

            var weeks = [];

            // fill weeks
            curDate = new Date(startDate);
            for (var i = 0; i < totalWeeksInPeriod; i++) {
                var daysInWeek = 7;
                if (i == 0) {
                    daysInWeek = startDate.getDay();
                    if (daysInWeek == 0) daysInWeek = 7;
                    daysInWeek = 8 - daysInWeek;
                } else if (i == totalWeeksInPeriod - 1) {
                    daysInWeek = finishDate.getDay();
                    if (daysInWeek == 0) daysInWeek = 7;
                    daysInWeek -= 1;
                    if (daysInWeek <= 0)
                        continue;
                }
                weeks[i] = { number: curDate.getWeek(), daysCount: daysInWeek };
                curDate.addWeeks(1);
            }

            return weeks;
        }


        function getPeriodData(startDate, finishDate, language) {
            if (!language) language = "en";

            var totalDaysInPeriod = getDaysCount(startDate, finishDate);
            var months = getMonths(startDate, finishDate, language);
            var weeks = getWeeks(startDate, finishDate);

            return { totalDays: totalDaysInPeriod, months: months, weeks: weeks };
        }

        function getBands(startDate, finishDate, receivedBands) {
            var bands = [];

            // fill bands and events
            for (var i = 0; i < receivedBands.length; i++) {

                var events = [];

                // fill events
                for (var n = 0; n < receivedBands[i].events.length; n++) {
                    var event = receivedBands[i].events[n];
                    event.startDate = new Date(parseInt(event.startDate.substr(6)));
                    event.finishDate = new Date(parseInt(event.finishDate.substr(6)));

                    var eventStartDate = new Date(event.startDate);
                    if (eventStartDate < startDate)
                        eventStartDate = new Date(startDate);

                    var eventFinishDate = new Date(event.finishDate);
                    if (eventFinishDate > finishDate)
                        eventFinishDate = new Date(finishDate);

                    var eventDurationInDays = getDaysCount(eventStartDate, eventFinishDate);
                    var eventStartDay = getDaysCount(startDate, eventStartDate);

                    events[n] = {
                        name: event.name,
                        durationInDaysCount: eventDurationInDays,
                        startDay: eventStartDay,
                        startDate: event.startDate,
                        finishDate: event.finishDate
                    };
                }

                bands[i] = { name: receivedBands[i].name, events: events };
            }

            return bands;
        }

        var defaults = {
            eventDateFormat: 'dd.MM.yyyy HH:mm',
            showLegend: false,
            tooltipHtml: function (event) {
                return event.name + '<br/>' + event.startDate + ' - ' + event.finishDate;
            },
            legendHeader: 'Legend',
            legendBusyDescription: 'Time is occupied',
            language: "en"
        };

        options = $.extend(defaults, options);

        this.html('<div class="timeline-loading"><p>loading...</p></div>');

        var self = this;
        $.ajax({
            url: options.timelineDataUrl,
            type: "POST",
            success: function (data) {
                var startDate = new Date(parseInt(data.startDate.substr(6)));
                var finishDate = new Date(parseInt(data.finishDate.substr(6)));

                var periodData = getPeriodData(startDate, finishDate, options.language);
                var bands = getBands(startDate, finishDate, data.bands);


                var table = $('<table/>').addClass('timeline-table');
                var header = $('<thead/>');
                var body = $('<tbody/>');

                var row = $('<tr/>');
                for (var i = 0; i < periodData.totalDays + 1; i++) {
                    row.append($('<th/>').addClass('timeline-th-marker').html(i));
                }
                header.append(row);

                // fill months
                row = $('<tr/>');
                row.append($('<th/>'));
                for (var i = 0; i < periodData.months.length; i++) {
                    var month = periodData.months[i];
                    var column = $('<th/>').addClass('timeline-th-month').attr('colspan', month.daysCount).html(month.name);
                    row.append(column);
                }
                header.append(row);

                // fill weeks
                row = $('<tr/>');
                row.append($('<th/>'));
                for (var i = 0; i < periodData.weeks.length; i++) {
                    var week = periodData.weeks[i];
                    var column = $('<th/>').addClass('timeline-th-week').attr('colspan', week.daysCount).html(week.number);
                    row.append(column);
                }
                header.append(row);

                table.append(header);

                // fill bands and events
                for (var i = 0; i < bands.length; i++) {
                    row = $('<tr/>');
                    row.append($('<td/>').addClass('timeline-td-bandname').append($('<h3/>').html(bands[i].name)));

                    if (bands[i].events.length <= 0) {
                        row.append($('<td/>').attr('colspan', periodData.totalDays));
                    } else {
                        var currentDay = 0;
                        for (var n = 0; n < bands[i].events.length; n++) {
                            var event = bands[i].events[n];
                            if (event.startDay > currentDay) {
                                row.append($('<td/>').addClass('timeline-td-empty').attr('colspan', event.startDay - currentDay));
                            }
                            row.append($('<td/>').addClass('timeline-td-event').attr('colspan', event.durationInDaysCount).qtip({
                                    content: options.tooltipHtml(event),
                                    style: {
                                        tip: 'bottomLeft',
                                        background: '#FAFAFA',
                                        name: 'light' // Inherit from preset style
                                    },
                                    position: {
                                        corner: {
                                            target: 'topLeft',
                                            tooltip: 'bottomLeft'
                                        }
                                    }
                                }) );
                            currentDay = event.startDay + event.durationInDaysCount;
                            if (n == bands[i].events.length - 1 && currentDay < periodData.totalDays) {
                                row.append($('<td/>').addClass('timeline-td-empty').attr('colspan', periodData.totalDays - currentDay));
                            }
                        }
                    }
                    body.append(row);
                }

                table.append(body);

                var divLegend = $('<div/>').addClass('timeline-legend-container');

                // legend
                if (options.showLegend) {
                    divLegend.append($('<h3/>').text(options.legendHeader));
                    var divLegendItem = $('<div/>').addClass('timeline-legend');
                    divLegendItem.append($('<div>').addClass('timeline-legend-busy-item'));
                    divLegendItem.append($('<div>').addClass('timeline-legend-busy-description').append($('<p/>').text(options.legendBusyDescription)));
                    divLegend.append(divLegendItem);
                    divLegend.append($('<div/>').addClass('timeline-clear'));
                }

                self.html('');
                self.append(table);

                if (options.showLegend) {
                    self.append(divLegend);
                }

            },
            error: function () {
                self.html('Error!');
            }
        });

    };
})(jQuery);