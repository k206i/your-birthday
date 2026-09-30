import { describe, expect, test } from 'vitest';
import { toContactBirthday, toContactsPermission } from '@/api/getContactsBirthdays';

describe( 'разбор контакта', () => {
  test( 'полная дата сохраняется целиком', () => {
    const result = toContactBirthday({ id: '1', displayName: 'Аня', birthday: { day: 12, month: 5, year: 1990 } });

    expect( result ).toEqual({ id: '1', name: 'Аня', month: 5, day: 12, year: 1990 });
  });

  test( 'дата без года не отбрасывается', () => {
    const result = toContactBirthday({ id: '1', displayName: 'Аня', birthday: { day: 12, month: 5 } });

    expect( result ).toEqual({ id: '1', name: 'Аня', month: 5, day: 12, year: undefined });
  });

  test( 'контакт без даты рождения отбрасывается', () => {
    expect( toContactBirthday({ id: '1', displayName: 'Аня' })).toBeNull();
  });

  test( 'неполная или невозможная дата отбрасывается', () => {
    expect( toContactBirthday({ id: '1', displayName: 'Аня', birthday: { month: 5 } })).toBeNull();
    expect( toContactBirthday({ id: '1', displayName: 'Аня', birthday: { day: 12 } })).toBeNull();
    expect( toContactBirthday({ id: '1', displayName: 'Аня', birthday: { day: 12, month: 13 } })).toBeNull();
    expect( toContactBirthday({ id: '1', displayName: 'Аня', birthday: { day: 32, month: 5 } })).toBeNull();
  });

  test( 'без displayName берётся fullName', () => {
    const result = toContactBirthday({ id: '1', fullName: 'Анна Петрова', birthday: { day: 12, month: 5 } });

    expect( result?.name ).toBe( 'Анна Петрова' );
  });

  test( 'контакт без имени отбрасывается', () => {
    expect( toContactBirthday({ id: '1', birthday: { day: 12, month: 5 } })).toBeNull();
    expect( toContactBirthday({ id: '1', displayName: '   ', birthday: { day: 12, month: 5 } })).toBeNull();
  });

  test( 'контакт без id отбрасывается', () => {
    expect( toContactBirthday({ displayName: 'Аня', birthday: { day: 12, month: 5 } })).toBeNull();
  });
});

describe( 'состояние разрешения', () => {
  test( 'после одного отказа спросить ещё можно', () => {
    expect( toContactsPermission( 'prompt-with-rationale' )).toBe( 'prompt' );
  });

  test( 'ограниченный доступ iOS считается выданным', () => {
    expect( toContactsPermission( 'limited' )).toBe( 'granted' );
  });

  test( 'остальные состояния переходят как есть', () => {
    expect( toContactsPermission( 'granted' )).toBe( 'granted' );
    expect( toContactsPermission( 'denied' )).toBe( 'denied' );
    expect( toContactsPermission( 'prompt' )).toBe( 'prompt' );
  });
});
