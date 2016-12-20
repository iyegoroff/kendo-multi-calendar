namespace kendoExt {

    export type CalendarDepth = 'month' | 'year' | 'decade' | 'century';

    export interface MultiCalendarOptions {
        name?: string;
        culture?: string;
        dates?: any;
        depth?: CalendarDepth;
        disableDates?: any|Function;
        footer?: string|Function;
        format?: string;
        max?: Date;
        min?: Date;
        month?: kendo.ui.CalendarMonth;
        start?: CalendarDepth;
        values?: Date[];
        maxSelectedItems?: number;
        change?(e: kendo.ui.CalendarEvent): void;
        navigate?(e: kendo.ui.CalendarEvent): void;
    }

    export class MultiCalendar extends kendo.ui.Calendar {
        private static _views: { [key: string]: number } = {
            month: 0,
            year: 1,
            decade: 2,
            century: 3
        };

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

                if (this._values.length) {
                    (this as any)._value = this._values[0];
                }

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

        private canSelectItems(amount: number): boolean {
            const max = (this.options as MultiCalendarOptions).maxSelectedItems;

            return max === null || amount <= max;
        }

        private cellByDate(value: string): JQuery {
            return (this as any)._table.find('td')
                .filter(function () {
                    return $(this.firstChild).attr((kendo as any).attr('value')) === value;
                });
        }

        private updateSelection(valuesToSelect: Date[] = [], valuesToClear: Date[] = []) {
            if ((this as any)._index === MultiCalendar._views[(this.options.depth as string)]) {
                const selected = 'k-state-selected';

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
    }

    MultiCalendar.fn = MultiCalendar.prototype;
    MultiCalendar.fn.options = {
        ...kendo.ui.Calendar.fn.options,
        ...{
            name: 'MultiCalendar',
            values: [],
            maxSelectedItems: null
        }
    };

    kendo.ui.plugin(MultiCalendar);
}

interface JQuery {
    kendoMultiCalendar(options?: kendoExt.MultiCalendarOptions): JQuery;
    data(key: 'kendoMultiCalendar'): kendoExt.MultiCalendar;
}
