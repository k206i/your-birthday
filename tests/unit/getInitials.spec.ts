import { describe, expect, test } from 'vitest';
import { getInitials } from '@/composables/getInitials';

describe( 'инициалы контакта', () => {
  test( 'два слова дают две буквы', () => {
    expect( getInitials( 'Анна Петрова' )).toBe( 'АП' );
  });

  test( 'одно слово даёт одну букву', () => {
    expect( getInitials( 'Мама' )).toBe( 'М' );
  });

  test( 'третье и дальше слова не участвуют', () => {
    expect( getInitials( 'Лена с работы' )).toBe( 'ЛС' );
  });

  test( 'маленькие буквы поднимаются', () => {
    expect( getInitials( 'лена петрова' )).toBe( 'ЛП' );
  });

  test( 'берётся первая буква, а не первый символ', () => {
    expect( getInitials( 'Лена (работа)' )).toBe( 'ЛР' );
  });

  test( 'слово без букв пропускается', () => {
    expect( getInitials( '🎂 Аня' )).toBe( 'А' );
    expect( getInitials( 'Аня 🎂 Петрова' )).toBe( 'АП' );
  });

  test( 'лишние пробелы не мешают', () => {
    expect( getInitials( '  Анна   Петрова  ' )).toBe( 'АП' );
  });

  test( 'имя без букв даёт пустую строку', () => {
    expect( getInitials( '+7 999' )).toBe( '' );
    expect( getInitials( '' )).toBe( '' );
  });
});
