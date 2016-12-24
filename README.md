kendo-multi-calendar
=========
[![npm version](https://badge.fury.io/js/kendo-multi-calendar.svg)](https://badge.fury.io/js/kendo-multi-calendar)
[![Build Status](https://travis-ci.org/iyegoroff/kendo-multi-calendar.svg?branch=master)](https://travis-ci.org/iyegoroff/kendo-multi-calendar)
[![Coverage Status](https://coveralls.io/repos/github/iyegoroff/kendo-multi-calendar/badge.svg?branch=master)](https://coveralls.io/github/iyegoroff/kendo-multi-calendar?branch=master)
[![Dependency Status](https://david-dm.org/iyegoroff/kendo-multi-calendar.svg)](https://david-dm.org/iyegoroff/kendo-multi-calendar)
[![devDependency Status](https://david-dm.org/iyegoroff/kendo-multi-calendar/dev-status.svg)](https://david-dm.org/iyegoroff/kendo-multi-calendar#info=devDependencies)
[![typings included](https://img.shields.io/badge/typings-included-brightgreen.svg)](#typescript)
[![npm](https://img.shields.io/npm/l/express.svg)](https://www.npmjs.com/package/kendo-multi-calendar)

[![Build Status](https://saucelabs.com/browser-matrix/iyegoroff-3.svg)](https://saucelabs.com/beta/builds/02341651d31d45b19e93dc08dbc67506)

Extended Kendo UI Calendar widget that supports multiselection. [Demo](https://kendo-multi-calendar.surge.sh/)

## Installation

```bash
npm i kendo-multi-calendar
```

kendo-multi-calendar(.min).js script should be included in your project along with kendo-ui-core or kendo-ui.

## Usage

```javascript
var multiCalendar = $("#multiCalendar").kendoMultiCalendar({
    // use 'values' option instead of 'value'
    values: [new Date(), new Date(2016, 5, 2)], 

    // set selection limits
    maxSelectedItems: 3,

    //... everything else is just like in ordinary Kendo UI Calendar
}).data('kendoMultiCalendar');

multiCalendar.values([]);
```

### Typescript

This module also contains type declarations.

```typescript
// use 'reference' directive
/// <reference path="node_modules/kendo-multi-calendar/dist/kendo-multi-calendar.d.ts" />

// or add types to 'compilerOptions' in your tsconfig.json:
// ...
// "types": [ "kendo-multi-calendar" ],
// ...

const calendar = new kendoExt.MultiCalendar('#multiCalendar');
```