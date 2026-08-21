export type TDuration = {
  years: number,
  months: number,
  weeks: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

// Разбивка интервала: календарные годы и месяцы, остаток — недели, дни и время
export const splitDuration = ( from: Date, to: Date ): TDuration => {
  // Полные годы
  let years: number = to.getFullYear() - from.getFullYear();
  const yearMark: Date = new Date( from );
  yearMark.setFullYear( from.getFullYear() + years );

  if ( yearMark > to ) {
    years--;
    yearMark.setFullYear( from.getFullYear() + years );
  }

  // Полные месяцы после последней годовщины
  let months: number = 0;
  const monthMark: Date = new Date( yearMark );
  const nextMonth: Date = new Date( monthMark );
  nextMonth.setMonth( nextMonth.getMonth() + 1 );

  while ( nextMonth <= to ) {
    monthMark.setTime( nextMonth.getTime() );
    months++;
    nextMonth.setMonth( nextMonth.getMonth() + 1 );
  }

  // Остаток переводим в недели, дни, часы, минуты и секунды
  const MS_PER_SECOND: number = 1000;
  const MS_PER_MINUTE: number = 60 * MS_PER_SECOND;
  const MS_PER_HOUR: number = 60 * MS_PER_MINUTE;
  const MS_PER_DAY: number = 24 * MS_PER_HOUR;
  const MS_PER_WEEK: number = 7 * MS_PER_DAY;

  let rest: number = to.getTime() - monthMark.getTime();

  const weeks: number = Math.floor( rest / MS_PER_WEEK );
  rest -= weeks * MS_PER_WEEK;

  const days: number = Math.floor( rest / MS_PER_DAY );
  rest -= days * MS_PER_DAY;

  const hours: number = Math.floor( rest / MS_PER_HOUR );
  rest -= hours * MS_PER_HOUR;

  const minutes: number = Math.floor( rest / MS_PER_MINUTE );
  rest -= minutes * MS_PER_MINUTE;

  const seconds: number = Math.floor( rest / MS_PER_SECOND );

  return { years, months, weeks, days, hours, minutes, seconds };
}
