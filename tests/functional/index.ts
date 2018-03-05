const { describe, it, before } = intern.getInterface('bdd');
const { expect } = intern.getPlugin('chai');
import { IndexPage } from '../support/IndexPage';
import Command from '@theintern/leadfoot/Command';
import Suite from 'intern/lib/Suite';

describe('multi calendar', () => {
  let remote: Command<void>;

  before(function ({ remote: rem }: Suite) {
    remote = rem;
  });

  it('should select dates with code', () => {
    const page = new IndexPage(remote);
    const dates = [10, 15, 20].map(IndexPage.day);

    return page
      .selectDatesWithCode(dates)
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql(dates);
        expect(domDates).to.eql(dates);
      });
  });

  it('should select dates with clicks', () => {
    const page = new IndexPage(remote);
    const dates = [10, 15, 20].map(IndexPage.day);

    return page
      .selectDatesWithClick(dates)
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql(dates);
        expect(domDates).to.eql(dates);
      });
  });

  it('should select months with code', () => {
    const page = new IndexPage(remote, { depth: 'year' });
    const months = [0, 3, 6].map(IndexPage.month);

    return page
      .selectDatesWithCode(months)
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates]: Date[][]) => {
        expect(apiDates).to.eql(months);
      });
  });

  it('should select months with clicks', () => {
    const page = new IndexPage(remote, { depth: 'year' });
    const months = [0, 3, 6].map(IndexPage.month);

    return page
      .selectDatesWithClick(months)
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates]: Date[][]) => {
        expect(apiDates).to.eql(months);
      });
  });

  it('should select years with code', () => {
    const page = new IndexPage(remote, { depth: 'decade' });
    const years = [2016, 2017, 2018].map(IndexPage.year);

    return page
      .selectDatesWithCode(years)
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates]: Date[][]) => {
        expect(apiDates).to.eql(years);
      });
  });

  it('should select years with clicks', () => {
    const page = new IndexPage(remote, { depth: 'decade' });
    const years = [2016, 2017, 2018].map(IndexPage.year);

    return page
      .selectDatesWithClick(years)
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates]: Date[][]) => {
        expect(apiDates).to.eql(years);
      });
  });

  it('should clear selection with code', () => {
    const page = new IndexPage(remote);
    const dates = [10, 15, 20].map(IndexPage.day);

    return page
      .selectDatesWithCode(dates)
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql(dates);
        expect(domDates).to.eql(dates);
      })
      .then<void>(() => page.selectDatesWithCode([]))
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql([]);
        expect(domDates).to.eql([]);
      });
  });

  it('should clear selection with clicks', () => {
    const page = new IndexPage(remote);
    const dates = [10, 15, 20].map(IndexPage.day);

    return page
      .selectDatesWithClick(dates)
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql(dates);
        expect(domDates).to.eql(dates);
      })
      .then<void>(() => page.selectDatesWithClick(dates))
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql([]);
        expect(domDates).to.eql([]);
      });
  });

  it('should select dates and navigate to next month and back', () => {
    const page = new IndexPage(remote);
    const dates = [10, 15, 20].map(IndexPage.day);

    return page
      .selectDatesWithCode(dates)
      .then<void>(() => page.navigateToFuture())
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql(dates);
        expect(domDates).to.eql([]);
      })
      .then<void>(() => page.navigateToPast())
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql(dates);
        expect(domDates).to.eql(dates);
      });
  });

  it('should clear dates and navigate to next month and back', () => {
    const page = new IndexPage(remote);
    const dates = [10, 15, 20].map(IndexPage.day);
    const clearedDates = [20].map(IndexPage.day);
    const remainingDates = [10, 15].map(IndexPage.day);

    return page
      .selectDatesWithCode(dates)
      .then<void>(() => page.selectDatesWithClick(clearedDates))
      .then<void>(() => page.navigateToFuture())
      .then<void>(() => page.navigateToPast())
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql(remainingDates);
        expect(domDates).to.eql(remainingDates);
      });
  });

  it('should select dates and navigate up and down', () => {
    const page = new IndexPage(remote);
    const dates = [10, 15, 20].map(IndexPage.day);

    return page
      .selectDatesWithCode(dates)
      .then<void>(() => page.navigateUp())
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql(dates);
        expect(domDates).to.eql([]);
      })
      .then<void>(() => page.navigateDown())
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql(dates);
        expect(domDates).to.eql(dates);
      });
  });

  it('should select only unique dates', () => {
    const page = new IndexPage(remote);
    const dates = [10, 12, 10].map(IndexPage.day);
    const expectedDates = [10, 12].map(IndexPage.day);

    return page
      .selectDatesWithCode(dates)
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates]: Date[][]) => {
        expect(apiDates).to.eql(expectedDates);
      });
  });

  it('maxSelectedItems should be taken in account', () => {
    const page = new IndexPage(remote);
    const dates = [10, 9, 11, 12].map(IndexPage.day);
    const expectedDates = [10, 9, 11].map(IndexPage.day);

    return page
      .selectDatesWithClick(dates)
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates]: Date[][]) => {
        expect(apiDates).to.eql(expectedDates);
      });
  });

  it('only today should remain selected after click on today in footer', () => {
    const page = new IndexPage(remote);
    const dates = [10, 15, 20].map(IndexPage.day);
    const today = IndexPage.day(new Date().getDate());

    return page
      .selectDatesWithCode(dates)
      .then<void>(() => page.todayClick())
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql([today]);
        expect(domDates).to.eql([today]);
      });
  });

  it('should add today to selected values after click on today in footer', () => {
    const page = new IndexPage(remote, { cleanOnTodayClick: false });
    const dates = [10, 15].map(IndexPage.day);
    const expectedDates = [...dates, IndexPage.day(new Date().getDate())];

    return page
      .selectDatesWithCode(dates)
      .then<void>(() => page.todayClick())
      .then<Date[][]>(() => page.packedSelectedDates())
      .then(([apiDates, domDates]: Date[][]) => {
        expect(apiDates).to.eql(expectedDates);
        expect(domDates).to.eql(
          [...expectedDates].sort((f: Date, s: Date) => f.getTime() - s.getTime())
        );
      });
  });
});
