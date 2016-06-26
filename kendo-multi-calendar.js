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
        return first && second && (
                first.getFullYear() === second.getFullYear() &&
                first.getMonth() === second.getMonth() &&
                first.getDate() === second.getDate()
            );
    }

    var MultiCalendar = Calendar.extend({
        options: {
            name: 'MultiCalendar',
            values: [],
            maxSelectedItems: null
        },

        init: function (element, options) {
            this._values = (options !== undefined && options.values)
                ? options.values
                : this.options.values;

            Calendar.fn.init.call(this, element, options);
        },

        values: function (newValues) {
            if (newValues && this._canSelectItems(newValues.length)) {
                var valuesToClear = this._values.filter(function (value) {
                    return newValues.every(function (newValue) {
                        return !isSameDate(value, newValue);
                    })
                });

                var i = null;

                this._values = newValues
                    .filter(function (item, index) {
                        for (i = index - 1; i >= 0; i -= 1) {
                            if (isSameDate(item, newValues[i])) {
                                return false;
                            }
                        }

                        return true;
                    }
                );

                if (this._values.length) {
                    this._value = this._values[0];
                }

                this._updateSelection(this._values, valuesToClear);
            }

            return this._values;
        },

        value: function (newValue) {
            var value = null;

            var valueIndex = this._values
                .reduce(function (acc, value, index) {
                    return isSameDate(value, newValue) ? index : acc;
                }, undefined);

            var shouldAddNewValue = valueIndex === undefined;
            var canAddNewValue = shouldAddNewValue
                && this._canSelectItems(this._values.length + 1);

            if (!shouldAddNewValue || canAddNewValue) {
                value = Calendar.fn.value.call(this, newValue);
            }

            if (newValue) {
                var valuesToClear = [];

                if (canAddNewValue) {
                    this._values.push(newValue);

                } else if (!shouldAddNewValue) {
                    valuesToClear = this._values.splice(valueIndex, 1);
                }

                this._updateSelection(this._values, valuesToClear);
            }

            return value;
        },

        navigate: function (value, view) {
            Calendar.fn.navigate.call(this, value, view);

            this._updateSelection(this._values);
        },

        navigateDown: function (value) {
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

        _canSelectItems: function (amount) {
            var max = this.options.maxSelectedItems;

            return max === null || amount <= max;
        },

        _cellByDate: function (value) {
            return this._table.find('td')
                .filter(function() {
                    return $(this.firstChild).attr(kendo.attr('value')) === value;
                });
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
}());