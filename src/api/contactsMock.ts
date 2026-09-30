import type { TContactBirthday } from '@/store/contactsStore';

// Даты от сегодняшнего дня, чтобы «сегодня» и «скоро» были видны всегда
const inDays = ( days: number ): { month: number, day: number } => {
  const date: Date = new Date();
  date.setDate( date.getDate() + days );

  return { month: date.getMonth() + 1, day: date.getDate() };
};

export const getContactsMock = (): TContactBirthday[] => {
  return [
    { id: 'mock-1', name: 'Анна Петрова', ...inDays( 0 ), year: 1990 },
    { id: 'mock-2', name: 'Мама', ...inDays( 3 ) },
    { id: 'mock-3', name: 'Константин Константинопольский', ...inDays( 12 ), year: 1985 },
    { id: 'mock-4', name: 'Лена с работы', ...inDays( 45 ) },
    { id: 'mock-5', name: 'Дедушка', ...inDays( 200 ), year: 1948 },
    { id: 'mock-6', name: 'Вася', month: 2, day: 29, year: 1996 },
  ];
};
