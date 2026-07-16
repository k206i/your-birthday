import { parseLocalDate } from '@/composables/localDate';

// Дней до ближайшей годовщины даты (0 — годовщина сегодня)
export const getDaysToDate = ( dateString: string, todayString: string ): number => {
  const targetDate: Date = parseLocalDate( dateString );
  const today: Date = parseLocalDate( todayString );

  const nextOccurrence: Date = new Date( targetDate );
  nextOccurrence.setFullYear( today.getFullYear() );

  if ( nextOccurrence < today ) {
    nextOccurrence.setFullYear( today.getFullYear() + 1 );
  }

  const MS_PER_DAY: number = 24 * 60 * 60 * 1000;

  return Math.round(( nextOccurrence.getTime() - today.getTime() ) / MS_PER_DAY );
}
