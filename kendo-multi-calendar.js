(function () {
    'use strict';

    var ui = kendo.ui;
    var Calendar = ui.Calendar;

    var views = {
        month: 0,
        year: 1,
        decade: 2,
        century: 3
    };
    var change = 'change';
    var selected = 'k-state-selected';

    function isSameDate(first, second) {
        return (
            first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate()
        );
    }

    var MultiCalendar = Calendar.extend({
        options: {
            name: 'MultiCalendar',
            values: []
        },

        init: function (element, options) {
            this._values = (options !== undefined && options.values)
                ? options.values
                : this.options.values;

            Calendar.fn.init.call(this, element, options);
        },

        values: function (newValues) {
            if (newValues) {
                var valuesToClear = this._values.filter(function (value) {
                    return newValues.every(function (newValue) {
                        return !isSameDate(value, newValue);
                    })
                });

                this._values = newValues;

                this._updateSelection(this._values, valuesToClear);
            }

            return this._values;
        },

        value: function (newValue) {
            var value = Calendar.fn.value.call(this, newValue);

            if (newValue) {
                var valueIndex = this._values
                    .reduce(function (acc, value, index) {
                        return isSameDate(value, newValue) ? index : acc;
                    }, undefined);

                var valuesToClear = [];

                if (valueIndex !== undefined) {
                    valuesToClear = this._values.splice(valueIndex, 1);

                } else {
                    this._values.push(newValue);
                }

                this._updateSelection(this._values, valuesToClear);
            }

            return value;
        },

        navigate: function(value, view) {
            Calendar.fn.navigate.call(this, value, view);

            this._updateSelection(this._values);
        },

        navigateDown: function(value) {
            var that = this,
                index = that._index,
                depth = that.options.depth;

            if (!value) {
                return;
            }

            if (index === views[depth]) {
                that.value(value);
                that.trigger(change);

                return;
            }

            that.navigate(value, --index);
        },

        _updateSelection: function (valuesToSelect, valuesToClear) {
            valuesToSelect = valuesToSelect || [];
            valuesToClear = valuesToClear || [];
            var that = this;

            if (that._index === views[that.options.depth]) {
                valuesToSelect.forEach(function (value) {
                    that._cellByDate(that.view().toDateString(value))
                        .addClass(selected);
                });

                valuesToClear.forEach(function (value) {
                    that._cellByDate(that.view().toDateString(value))
                        .removeClass(selected);
                });
            }
        }
    });

    ui.plugin(MultiCalendar);
});