import { beforeEach, describe, expect, test } from 'vitest';
import { appStore } from '@/store/appStore';
import { contactsBirthdays } from '@/store/contactsStore';
import type { TContactBirthday } from '@/store/contactsStore';
import { buildReminders, getReminderInput } from '@/api/birthdayReminders';
import type { TReminderInput } from '@/api/birthdayReminders';

const contact = ( id: string, name: string, month: number, day: number ): TContactBirthday => ({ id, name, month, day });

const input = ( patch: Partial< TReminderInput > ): TReminderInput => ({
  userBirthDate: '',
  additionalName: '',
  additionalBirthDate: '',
  contacts: [],
  ...patch,
});

// 14 октября 2026, 9:00 по местному времени
const morning: Date = new Date( 2026, 9, 14, 9 );

beforeEach(() => {
  appStore.isContactsEnabled = false;
  contactsBirthdays.value = [];
});

describe( 'напоминания о днях рождения', () => {
  test( 'один именинник в 10 утра своего дня', () => {
    const [ reminder ] = buildReminders( input({ contacts: [ contact( '1', 'Анна Петрова', 10, 20 ) ] }), morning );

    expect( reminder.at ).toEqual( new Date( 2026, 9, 20, 10 ));
    expect( reminder.title ).toBe( '🎂 Сегодня празднует Анна Петрова' );
  });

  test( 'несколько именинников в один день идут одним уведомлением', () => {
    const reminders = buildReminders( input({
      contacts: [ contact( '1', 'Мама', 10, 20 ), contact( '2', 'Вася', 10, 20 ), contact( '3', 'Лена', 10, 20 ) ],
    }), morning );

    expect( reminders ).toHaveLength( 1 );
    expect( reminders[ 0 ].body ).toBe( 'Мама, Вася и Лена. Самое время поздравить' );
  });

  test( 'сегодняшний день рождения: до 10 утра ставится, после уже нет', () => {
    const today: TReminderInput = input({ contacts: [ contact( '1', 'Аня', 10, 14 ) ] });

    expect( buildReminders( today, morning )).toHaveLength( 1 );
    expect( buildReminders( today, new Date( 2026, 9, 14, 11 ))).toHaveLength( 0 );
  });

  test( 'свой день рождения отдельным уведомлением со своим id', () => {
    const reminders = buildReminders( input({
      userBirthDate: '1990-10-20',
      contacts: [ contact( '1', 'Мама', 10, 20 ) ],
    }), morning );

    expect( reminders ).toHaveLength( 2 );
    expect( new Set( reminders.map(({ id }) => id )).size ).toBe( 2 );
    expect( reminders.map(({ title }) => title )).toContain( 'С днём рождения! 🎉' );
  });

  test( 'близкий человек из профиля не дублируется, если он есть в контактах', () => {
    const [ reminder ] = buildReminders( input({
      additionalName: 'Мама',
      additionalBirthDate: '1965-10-20',
      contacts: [ contact( '1', 'Мама', 10, 20 ) ],
    }), morning );

    expect( reminder.title ).toBe( '🎂 Сегодня празднует Мама' );
  });

  test( '29 февраля в невисокосный год переезжает на 1 марта', () => {
    const [ reminder ] = buildReminders( input({ contacts: [ contact( '1', 'Вася', 2, 29 ) ] }), morning );

    expect( reminder.at ).toEqual( new Date( 2027, 2, 1, 10 ));
  });

  test( 'нажатие ведёт в открытку, к контактам или на главную', () => {
    const tapOn = ( patch: Partial< TReminderInput > ) => buildReminders( input( patch ), morning ).map(({ tap }) => tap );

    expect( tapOn({ contacts: [ contact( '1', 'Аня', 10, 20 ) ] }))
      .toEqual([{ path: '/giftCardPage', name: 'Аня' }]);

    expect( tapOn({ additionalName: 'Мама', additionalBirthDate: '1965-10-20' }))
      .toEqual([{ path: '/giftCardPage', name: 'Мама' }]);

    expect( tapOn({ contacts: [ contact( '1', 'Аня', 10, 20 ), contact( '2', 'Вася', 10, 20 ) ] }))
      .toEqual([{ path: '/contactsBirthdaysPage' }]);

    expect( tapOn({ additionalName: 'Мама', additionalBirthDate: '1965-10-20', contacts: [ contact( '1', 'Аня', 10, 20 ) ] }))
      .toEqual([{ path: '/home' }]);

    expect( tapOn({ userBirthDate: '1990-10-20' }))
      .toEqual([{ path: '/home' }]);
  });

  test( 'контакты не попадают в напоминания, если функция выключена', () => {
    contactsBirthdays.value = [ contact( '1', 'Мама', 10, 20 ) ];

    expect( getReminderInput().contacts ).toEqual([]);

    appStore.isContactsEnabled = true;

    expect( getReminderInput().contacts ).toHaveLength( 1 );
  });
});
