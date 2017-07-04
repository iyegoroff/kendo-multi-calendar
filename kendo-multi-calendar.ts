declare namespace kendo {
    namespace ui {
        interface Calendar {
            _todayClick(e: kendo.ui.CalendarEvent): void;
        }
    }
}

namespace kendoExt {

    export type CalendarDepth = 'month' | 'year' | 'decade' | 'century';

    export interface MultiCalendarOptions extends kendo.ui.CalendarOptions {
        values?: Date[];
        maxSelectedItems?: number | null;
        cleanSelectedItemsOnTodayClick?: boolean;
    }

    export class MultiCalendar extends kendo.ui.Calendar {
        public static fn: MultiCalendar;

        private static _views: { [key: string]: number } = {
            month: 0,
            year: 1,
            decade: 2,
            century: 3
        };

        public options: MultiCalendarOptions;

        private _values: Date[];

        constructor(element: Element | JQuery | string, options?: MultiCalendarOptions) {
            super(element as Element, options);

            this._values = (options && options.values) || [];

            (this as any).navigate();
        }

        private static isSameDate(first: Date, second: Date) {
            return first
                && second
                && first.getFullYear() === second.getFullYear()
                && first.getMonth() === second.getMonth()
                && first.getDate() === second.getDate();
        }

        public values(newValues?: Date[]): Date[] {
            if (newValues !== undefined && this.canSelectItems(newValues.length)) {
                const valuesToClear = this._values.filter(value => {
                    return newValues.every(newValue => !MultiCalendar.isSameDate(value, newValue));
                });

                let i = null;

                this._values = newValues
                    .filter((item, index) => {
                        for (i = index - 1; i >= 0; i -= 1) {
                            if (MultiCalendar.isSameDate(item, newValues[i])) {
                                return false;
                            }
                        }

                        return true;
                    }
                );

                this.updateSelection(this._values, valuesToClear);
            }

            return this._values;
        }

        public value(newValue?: Date | string): Date {
            const valueIndex: number = (this._values || [])
                .reduce((acc, val, index) => MultiCalendar.isSameDate(val, (newValue as Date)) ? index : acc, -1);

            const shouldAddNewValue = valueIndex === -1;
            const canAddNewValue = shouldAddNewValue && this._values && this.canSelectItems(this._values.length + 1);

            if (!shouldAddNewValue || canAddNewValue) {
                super.value((newValue as Date));
            }

            if (newValue) {
                let valuesToClear: Date[] = [];

                if (canAddNewValue) {
                    this._values.push((newValue as Date));

                } else if (!shouldAddNewValue) {
                    valuesToClear = this._values.splice(valueIndex, 1);
                }

                this.updateSelection(this._values, valuesToClear);
            }

            return super.value();
        }

        public navigate(value: Date, view: string) {
            super.navigate(value, view);

            this.updateSelection(this._values);
        }

        public navigateDown(value: Date) {
            if (!value) {
                return;
            }

            const index: number = (this as any)._index;

            if (index === MultiCalendar._views[(this.options.depth as string)]) {
                this.value(value);
                this.trigger('change');

                return;
            }

            this.navigate(value, (index - 1 as any));
        }

        public _todayClick(e: kendo.ui.CalendarEvent) {
            this.selectToday();

            super._todayClick(e);
        }

        private canSelectItems(amount: number): boolean {
            const max = (this.options as MultiCalendarOptions).maxSelectedItems;

            return !max || amount <= max;
        }

        private cellByDate(value: string): JQuery {
            return (this as any)._table.find('td')
                .filter(function () {
                    return $(this.firstChild).attr((kendo as any).attr('value')) as string === value;
                });
        }

        private updateSelection(valuesToSelect: Date[] = [], valuesToClear: Date[] = []) {
            if ((this as any)._index === MultiCalendar._views[(this.options.depth as string)]) {
                const selected = 'k-state-selected';

                const _value = ((this as any)._value);

                if (_value) {
                    this.cellByDate(this.view().toDateString(_value))
                        .removeClass(selected);
                }

                valuesToSelect.forEach(value => {
                    this.cellByDate(this.view().toDateString(value))
                        .addClass(selected);
                });

                valuesToClear.forEach(value => {
                    this.cellByDate(this.view().toDateString(value))
                        .removeClass(selected);
                });
            }
        }

        private selectToday = () => {
            const today = new Date();
            const value = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const values = (this.options as MultiCalendarOptions).cleanSelectedItemsOnTodayClick
                ? [value]
                : [...this._values, value];

            this.values(values);
        }
    }

    MultiCalendar.fn = MultiCalendar.prototype;
    MultiCalendar.fn.options = {
        ...kendo.ui.Calendar.fn.options,
        ...{
            name: 'MultiCalendar',
            values: [],
            maxSelectedItems: null,
            cleanSelectedItemsOnTodayClick: true
        }
    };

    kendo.ui.plugin(MultiCalendar);
}

interface JQuery {
    kendoMultiCalendar(options?: kendoExt.MultiCalendarOptions): JQuery;
    data(key: 'kendoMultiCalendar'): kendoExt.MultiCalendar;
}
