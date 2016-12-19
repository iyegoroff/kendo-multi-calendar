kendo-multi-calendar
=========
[![npm version](https://badge.fury.io/js/kendo-multi-calendar.svg)](https://badge.fury.io/js/kendo-multi-calendar)
[![Build Status](https://travis-ci.org/iyegoroff/kendo-multi-calendar.svg?branch=master)](https://travis-ci.org/iyegoroff/kendo-multi-calendar)
[![Coverage Status](https://coveralls.io/repos/github/iyegoroff/kendo-multi-calendar/badge.svg?branch=master)](https://coveralls.io/github/iyegoroff/kendo-multi-calendar?branch=master)
[![Dependency Status](https://david-dm.org/iyegoroff/kendo-multi-calendar.svg)](https://david-dm.org/iyegoroff/kendo-multi-calendar)
[![devDependency Status](https://david-dm.org/iyegoroff/kendo-multi-calendar/dev-status.svg)](https://david-dm.org/iyegoroff/kendo-multi-calendar#info=devDependencies)
[![npm](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/kendo-multi-calendar)

[![Build Status](https://saucelabs.com/browser-matrix/iyegoroff-3.svg)](https://saucelabs.com/beta/builds/02341651d31d45b19e93dc08dbc67506)

Extended Kendo UI Calendar widget that supports multiselection. [Demo](http://iyegoroff.github.io/kendo-multi-calendar/)

## Installation

```bash
npm i kendo-multi-calendar
```

kendo-multi-calendar.min.js script should be included in your project along with kendo-ui-core or kendo-ui.

## Usage

```javascript
var multiCalendar = $("#multiCalendar").kendoMultiCalendar({
    values: [new Date(), new Date(2016, 5, 2)], // use this option instead of 'value'
    maxSelectedItems: 3,
    //... everything else is just like in ordinary Kendo UI Calendar
}).data('kendoMultiCalendar');

multiCalendar.values([]);
```

## Tests

Tested with Zombie.js.

## Contributing

Add tests for any new or changed functionality.
