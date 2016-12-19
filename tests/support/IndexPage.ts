import * as Command from 'leadfoot/Command';
import { IRequire } from 'dojo/loader';
import * as Promise from 'dojo/Promise';

export class IndexPage {

    private static delay = 1000;
    private static navigateDelay = 2000;

    constructor(private remote: Command<any>, depth: kendoExt.CalendarDepth = 'month') {
        let code: Function;

        if (depth === 'month') {
            code = () => $('#multi-cal').kendoMultiCalendar({ maxSelectedItems: 3 });
        } else if (depth === 'year') {
            code = () => $('#multi-cal').kendoMultiCalendar({ depth: 'year', start: 'year' });
        } else {
            code = () => $('#multi-cal').kendoMultiCalendar({ depth: 'decade', start: 'decade' });
        }

        this.remote = remote
            .setFindTimeout(2500)
            .setPageLoadTimeout(5000)
            .get((require as IRequire & NodeRequire).toUrl('../index.html'))
            .execute(code, []);
    }

    public static day(day: number): Date {
        const today = new Date();

        return new Date(today.getFullYear(), today.getMonth(), day);
    }

    public static month(month: number): Date {
        const today = new Date();

        return new Date(today.getFullYear(), month, today.getDate());
    }

    public static year(year: number): Date {
        const today = new Date();

        return new Date(year, today.getMonth(), today.getDate());
    }

    private static daySel(date: Date): string {
        return `[data-value$='/${date.getDate()}']`;
    }

    private static monthSel(date: Date): string {
        return `[data-value$='/${date.getMonth()}/1']`;
    }

    private static yearSel(date: Date): string {
        return `[data-value$='${date.getFullYear()}/0/1']`;
    }

    private static parseDates(dates: string): Date[] {
        return JSON.parse(dates).map((date: string) => new Date(date));
    }

    public selectDatesWithCode(dates: Date[]): Command<void> {
        const code = (stringDates: string[]) => {
            $('#multi-cal')
                .data('kendoMultiCalendar')
                .values(stringDates.map(d => new Date(d)));
        };

        return this.remote
            .execute(code, [dates])
            .sleep(IndexPage.delay);
    }

    public selectDatesWithClick(dates: Date[], depth: kendoExt.CalendarDepth = 'month'): Command<void> {
        let selector: Function;

        if (depth === 'month') {
            selector = IndexPage.daySel;
        } else if (depth === 'year') {
            selector = IndexPage.monthSel;
        } else if (depth === 'decade') {
            selector = IndexPage.yearSel;
        }

        return dates.reduce(
            (command, date) => {
                return command.then<any>(() => this.remote
                    .findByCssSelector(selector(date))
                    .click()
                    .sleep(IndexPage.delay)
                );
            },
            this.remote
        );
    }

    public packedSelectedDates(): Command<Date[][]> {
        return this.remote
            .then(() => Promise.all([
                this.selectedDatesFromCode().promise,
                this.selectedDatesFromDom().promise
            ]));
    }

    public navigateToFuture(): Command<void> {
        const code = () => {
            $('#multi-cal')
                .data('kendoMultiCalendar')
                .navigateToFuture();
        };

        return this.remote
            .execute(code, [])
            .sleep(IndexPage.navigateDelay);
    }

    public navigateToPast(): Command<void> {
        const code = () => {
            $('#multi-cal')
                .data('kendoMultiCalendar')
                .navigateToPast();
        };

        return this.remote
            .execute(code, [])
            .sleep(IndexPage.navigateDelay);
    }

    public navigateUp(): Command<void> {
        const code = () => {
            $('#multi-cal')
                .data('kendoMultiCalendar')
                .navigateUp();
        };

        return this.remote
            .execute(code, [])
            .sleep(IndexPage.navigateDelay);
    }

    public navigateDown(): Command<void> {
        const code = () => {
            $('#multi-cal')
                .data('kendoMultiCalendar')
                .navigateDown(new Date());
        };

        return this.remote
            .execute(code, [])
            .sleep(IndexPage.navigateDelay);
    }

    private selectedDatesFromCode(): Command<Date[]> {
        const code = () => JSON.stringify(
            $('#multi-cal')
                .data('kendoMultiCalendar')
                .values()
        );

        return this.remote
            .execute(code, [])
            .then(IndexPage.parseDates);
    }

    private selectedDatesFromDom(): Command<Date[]> {
        const dataValueToDate = (value: string) => {
            const [y, m, d] = value.split('/');

            return new Date(+y, +m, +d);
        };

        return this.remote
            .findAllByCssSelector('td.k-state-selected > a')
            .then(elems => Promise.all(
                elems.map(elem => elem.getAttribute('data-value'))
            ))
            .then(values => values.filter(v => v !== null).map(dataValueToDate));
    }
}
