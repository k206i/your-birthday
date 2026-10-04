import { parseLocalDate } from '@/composables/localDate';
import type { TContactBirthday } from '@/store/contactsStore';

const SOON_DAYS: number = 60;

export type TUpcomingBirthday = {
  contact: TContactBirthday,
  date: Date,
  age: number, // 0, если год неизвестен
  isToday: boolean,
  isSoon: boolean,
}

const getNextBirthday = ( contact: TContactBirthday, today: Date ): Date => {
  const date: Date = new Date( today.getFullYear(), contact.month - 1, contact.day );

  if ( date < today ) {
    return new Date( today.getFullYear() + 1, contact.month - 1, contact.day );
  }

  return date;
};

export const getUpcomingBirthdays = ( contacts: TContactBirthday[], todayString: string ): TUpcomingBirthday[] => {
  const today: Date = parseLocalDate( todayString );
  const limit: Date = new Date( today );
  limit.setDate( limit.getDate() + SOON_DAYS );

  return contacts
    .map( contact => {
      const date: Date = getNextBirthday( contact, today );

      return {
        contact,
        date,
        age: contact.year ? date.getFullYear() - contact.year : 0,
        isToday: date.getTime() === today.getTime(),
        isSoon: date <= limit,
      };
    })
    .sort(( a, b ) => a.date.getTime() - b.date.getTime() );
};
