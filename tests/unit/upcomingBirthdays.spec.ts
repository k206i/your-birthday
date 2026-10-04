import { describe, expect, test } from 'vitest';
import { getUpcomingBirthdays } from '@/api/getUpcomingBirthdays';
import { formatDayMonth } from '@/composables/localDate';
import type { TContactBirthday } from '@/store/contactsStore';

const TODAY: string = '2026-10-04';

const contact = ( id: string, month: number, day: number, year?: number ): TContactBirthday => {
  return { id, name: id, month, day, year };
};

describe( 'ближайшие дни рождения', () => {
  test( 'сортировка от ближайшего, сегодняшний первым', () => {
    const result = getUpcomingBirthdays([ contact( 'далеко', 4, 19 ), contact( 'сегодня', 10, 4 ), contact( 'скоро', 10, 7 ) ], TODAY );

    expect( result.map( item => item.contact.id )).toEqual([ 'сегодня', 'скоро', 'далеко' ]);
  });

  test( 'сегодняшний отмечен, возраст считается', () => {
    const [ item ] = getUpcomingBirthdays([ contact( 'Аня', 10, 4, 1990 ) ], TODAY );

    expect( item.isToday ).toBe( true );
    expect( item.age ).toBe( 36 );
  });

  test( 'без года возраст 0', () => {
    const [ item ] = getUpcomingBirthdays([ contact( 'Мама', 10, 7 ) ], TODAY );

    expect( item.age ).toBe( 0 );
  });

  test( 'вчерашний переезжает на следующий год', () => {
    const [ item ] = getUpcomingBirthdays([ contact( 'Вчера', 10, 3, 1990 ) ], TODAY );

    expect( item.date ).toEqual( new Date( 2027, 9, 3 ));
    expect( item.age ).toBe( 37 );
    expect( item.isToday ).toBe( false );
  });

  test( 'ровно через 60 дней ещё скоро, через 61 уже нет', () => {
    const [ soon, later ] = getUpcomingBirthdays([ contact( '60', 12, 3 ), contact( '61', 12, 4 ) ], TODAY );

    expect( soon.isSoon ).toBe( true );
    expect( later.isSoon ).toBe( false );
  });

  test( '29 февраля в невисокосный год празднуется 1 марта', () => {
    const [ item ] = getUpcomingBirthdays([ contact( 'Вася', 2, 29, 1996 ) ], '2027-02-10' );

    expect( item.date ).toEqual( new Date( 2027, 2, 1 ));
    expect( item.age ).toBe( 31 );
  });

  test( '29 февраля после марта в год перед високосным ждёт настоящее 29 февраля', () => {
    const [ item ] = getUpcomingBirthdays([ contact( 'Вася', 2, 29, 1996 ) ], '2027-03-05' );

    expect( item.date ).toEqual( new Date( 2028, 1, 29 ));
    expect( item.age ).toBe( 32 );
  });
});

describe( 'дата без года', () => {
  test( 'число и месяц', () => {
    expect( formatDayMonth( new Date( 2026, 9, 4 ))).toBe( '4 октября' );
  });

  test( 'с днём недели', () => {
    expect( formatDayMonth( new Date( 2026, 9, 4 ), true )).toBe( '4 октября, вс' );
  });
});
