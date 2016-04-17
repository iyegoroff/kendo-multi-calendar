'use strict';

var Browser = require("zombie");
var restify = require('restify');

var asCssClass = function (klass) {
    return klass[0] === '.' ? klass : ('.' + klass);
};

var selected = 'k-state-selected';
var selectedDates = "$('." + selected + "')";
var today = 'k-today';
var next = 'k-nav-next';
var prev = 'k-nav-prev';
var focused = 'k-state-focused';
var up = 'k-nav-fast';
var calendar = "$('#multi-cal')";
var kendoCalendar = calendar + ".data('kendoMultiCalendar')";
var createDateCalendar = "$(function () {$('#multi-cal').kendoMultiCalendar();});";
var createMonthCalendar = "$(function () {$('#multi-cal').kendoMultiCalendar({ depth:'year', start:'year' });});";
var createYearCalendar = "$(function () {$('#multi-cal').kendoMultiCalendar({ depth:'decade', start:'decade' });});";

var values = function (list) {
    list = list === undefined ? '' : ('[' + list.map(function (d) { return "new Date('" + d + "')"; }) + ']');
    return kendoCalendar + ".values(" + list + ")";
};

var length = function (list) {
    return list + '.length';
};

var dateElem = function (day) {
    return "[data-value$='/" + day + "']";
};

var date = function (day) {
    var date = new Date();

    if (day !== undefined) {
        date.setDate(day);
    }

    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
};

var monthElem = function (month) {
    return "[data-value$='/" + month + "/1']";
};

var month = function (month) {
    var today = new Date();

    return new Date(today.getFullYear(), month, today.getDate());
};

var yearElem = function (year) {
    return "[data-value$='" + year + "/0/1']";
};

var year = function (year) {
    var today = new Date();

    return new Date(year, today.getMonth(), today.getDate());
};

var app = restify.createServer();

app.get(/.*/, restify.serveStatic({
    directory: __dirname + '/public',
    default: 'index.html'
}));

describe('multi-calendar', function() {
    var server, browser;

    var evaluate = function (code, done) {
        browser.on('evaluated', function (evaluated) {
            if (evaluated === code) {
                done();
            }
        });

        browser.evaluate(code);
    };

    before(function () {
        server = app.listen(3001);
    });

    after(function () {
        server.close();
    });

    beforeEach(function (done) {
        browser = new Browser({
            site: 'http://localhost:3001'
        });

        browser.visit('/', done);
    });

    describe('select today', function () {
        var todayDate = date();
        var todayDateElem = asCssClass(today);

        var checkDom = function () {
            browser.assert.hasClass(todayDateElem, selected);
            browser.assert.evaluate(length(selectedDates), 1);
        };

        var checkJs = function () {
            browser.assert.evaluate(values() + '[0].getTime()', todayDate.getTime());
            browser.assert.evaluate(length(values()), 1);
        };

        beforeEach(function (done) {
            evaluate(createDateCalendar, done);
        });

        describe('with code', function () {

            beforeEach(function (done) {
                evaluate(values([todayDate]), done);
            });

            it('only today element should be selected', checkDom);

            it('values list should contain only today', checkJs);
        });

        describe('with click', function () {

            beforeEach(function (done) {
                browser
                    .click(todayDateElem)
                    .then(done);
            });

            it('only today element should be selected', checkDom);

            it('values list should contain only today', checkJs);
        });
    });

    describe('select several dates', function () {
        var dates = [date(16), date(17), date(18)];
        var dateElems = [dateElem(16), dateElem(17), dateElem(18)];

        var checkDom = function () {
            dateElems.forEach(function (elem) {
                browser.assert.evaluate(length('$("td' + asCssClass(selected) + ' > ' + elem + '")'), 1);
            });

            browser.assert.evaluate(length(selectedDates), dateElems.length);
        };

        var checkJs = function () {
            dates.forEach(function (date, index) {
                browser.assert.evaluate(values() + '[' + index + '].getTime()', date.getTime());
            });

            browser.assert.evaluate(length(values()), dates.length);
        };

        beforeEach(function (done) {
            evaluate(createDateCalendar, done);
        });

        describe('with code', function () {

            beforeEach(function (done) {
                evaluate(values(dates), done);
            });

            it('only 15th, 16th and 17th elements should be selected', checkDom);

            it('values list should contain only 15th, 16th and 17th', checkJs);
        });

        describe('with click', function () {

            beforeEach(function (done) {
                var clicks = dateElems.map(function (elem) {
                    return browser.click(elem);
                });

                Promise.all(clicks)
                    .then(function() {
                        done();
                    });
            });

            it('only 15th, 16th and 17th elements should be selected', checkDom);

            it('values list should contain only 15th, 16th and 17th', checkJs);
        });
    });

    describe('clear date selection', function () {
        var todayDateElem = asCssClass(today);

        var checkDom = function () {
            browser.assert.evaluate(length(selectedDates), 0);
        };

        var checkJs = function () {
            browser.assert.evaluate(length(values()), 0);
        };

        beforeEach(function (done) {
            evaluate(
                createDateCalendar,
                function () {
                    browser
                        .click(todayDateElem)
                        .then(done);
                }
            );
        });

        describe('with code', function () {

            beforeEach(function (done) {
                evaluate(values([]), done);
            });

            it('nothing should be selected', checkDom);

            it('values list should be empty', checkJs);
        });

        describe('with click', function () {

            beforeEach(function (done) {
                browser
                    .click(todayDateElem)
                    .then(done);
            });

            it('nothing should be selected', checkDom);

            it('values list should be empty', checkJs);
        });
    });

    describe('select several dates and navigate to next month and back', function () {
        var dates = [date(16), date(17), date(18)];
        var dateElems = [dateElem(16), dateElem(17), dateElem(18)];
        var transitionTimeout = 1000;

        var checkDom = function () {
            dateElems.forEach(function (elem) {
                browser.assert.evaluate(length('$("td' + asCssClass(selected) + ' > ' + elem + '")'), 1);
            });

            browser.assert.evaluate(length(selectedDates), dateElems.length);
        };

        var checkJs = function () {
            dates.forEach(function (date, index) {
                browser.assert.evaluate(values() + '[' + index + '].getTime()', date.getTime());
            });

            browser.assert.evaluate(length(values()), dates.length);
        };

        beforeEach(function (done) {
            evaluate(createDateCalendar + values(dates), done);
        });

        describe('with code', function () {

            beforeEach(function (done) {
                var navigateToPast = kendoCalendar + '.navigateToPast();';
                var navigateToFuture = kendoCalendar + '.navigateToFuture();';

                evaluate(
                    navigateToFuture + 'setTimeout(function () {' + navigateToPast + '},' + transitionTimeout + ');',
                    function () { setTimeout(done, transitionTimeout); }
                );
            });

            it('only today element should be selected', checkDom);

            it('values list should contain only today', checkJs);
        });

        describe('with click', function () {

            beforeEach(function (done) {
                browser
                    .click(asCssClass(next))
                    .then(function () {
                        setTimeout(function () {
                            browser
                                .click(asCssClass(prev))
                                .then(function () {
                                    setTimeout(done, transitionTimeout);
                                })
                        }, transitionTimeout);
                    });
            });

            it('only today element should be selected', checkDom);

            it('values list should contain only today', checkJs);
        });
    });

    describe('select several dates and navigate up and back', function () {
        var dates = [date(16), date(17), date(18)];
        var dateElems = [dateElem(16), dateElem(17), dateElem(18)];
        var transitionTimeout = 1000;

        var checkDom = function () {
            dateElems.forEach(function (elem) {
                browser.assert.evaluate(length('$("td' + asCssClass(selected) + ' > ' + elem + '")'), 1);
            });

            browser.assert.evaluate(length(selectedDates), dateElems.length);
        };

        var checkJs = function () {
            dates.forEach(function (date, index) {
                browser.assert.evaluate(values() + '[' + index + '].getTime()', date.getTime());
            });

            browser.assert.evaluate(length(values()), dates.length);
        };

        beforeEach(function (done) {
            evaluate(createDateCalendar + values(dates), done);
        });

        describe('with code', function () {

            beforeEach(function (done) {
                var navigateUp = kendoCalendar + '.navigateUp();';
                var navigateDown = kendoCalendar + '.navigateDown();';

                evaluate(
                    navigateUp + 'setTimeout(function () {' + navigateDown + '},' + transitionTimeout + ');',
                    function () { setTimeout(done, transitionTimeout); }
                );
            });

            it('only today element should be selected', checkDom);

            it('values list should contain only today', checkJs);
        });

        describe('with click', function () {

            beforeEach(function (done) {
                browser
                    .click(asCssClass(up))
                    .then(function () {
                        setTimeout(function () {
                            browser
                                .click(asCssClass(focused))
                                .then(function () {
                                    setTimeout(done, transitionTimeout);
                                })
                        }, transitionTimeout);
                    });
            });

            it('only today element should be selected', checkDom);

            it('values list should contain only today', checkJs);
        });
    });

    describe('select several months', function () {
        var dates = [month(0), month(3), month(6)];
        var dateElems = [monthElem(0), monthElem(3), monthElem(6)];

        var checkDom = function () {
            dateElems.forEach(function (elem) {
                browser.assert.evaluate(length('$("td' + asCssClass(selected) + ' > ' + elem + '")'), 1);
            });

            browser.assert.evaluate(length(selectedDates), dateElems.length);
        };

        var checkJs = function () {
            dates.forEach(function (date, index) {
                browser.assert.evaluate(values() + '[' + index + '].getTime()', date.getTime());
            });

            browser.assert.evaluate(length(values()), dates.length);
        };

        beforeEach(function (done) {
            evaluate(createMonthCalendar, done);
        });

        describe('with code', function () {

            beforeEach(function (done) {
                evaluate(values(dates), done);
            });

            it('only Jan, Apr and Jul elements should be selected', checkDom);

            it('values list should contain only Jan, Apr and Jul', checkJs);
        });

        describe('with click', function () {

            beforeEach(function (done) {
                var clicks = dateElems.map(function (elem) {
                    return browser.click(elem);
                });

                Promise.all(clicks)
                    .then(function() {
                        done();
                    });
            });

            it('only Jan, Apr and Jul elements should be selected', checkDom);

            it('values list should contain only Jan, Apr and Jul', checkJs);
        });
    });

    describe('select several years', function () {
        var dates = [year(2015), year(2016), year(2017)];
        var dateElems = [yearElem(2015), yearElem(2016), yearElem(2017)];

        var checkDom = function () {
            dateElems.forEach(function (elem) {
                browser.assert.evaluate(length('$("td' + asCssClass(selected) + ' > ' + elem + '")'), 1);
            });

            browser.assert.evaluate(length(selectedDates), dateElems.length);
        };

        var checkJs = function () {
            dates.forEach(function (date, index) {
                browser.assert.evaluate(values() + '[' + index + '].getTime()', date.getTime());
            });

            browser.assert.evaluate(length(values()), dates.length);
        };

        beforeEach(function (done) {
            evaluate(createYearCalendar, done);
        });

        describe('with code', function () {

            beforeEach(function (done) {
                evaluate(values(dates), done);
            });

            it('only 2015, 2016 and 2017 elements should be selected', checkDom);

            it('values list should contain only 2015, 2016 and 2017', checkJs);
        });

        describe('with click', function () {

            beforeEach(function (done) {
                var clicks = dateElems.map(function (elem) {
                    return browser.click(elem);
                });

                Promise.all(clicks)
                    .then(function() {
                        done();
                    });
            });

            it('only 2015, 2016 and 2017 elements should be selected', checkDom);

            it('values list should contain only 2015, 2016 and 2017', checkJs);
        });
    });

});
