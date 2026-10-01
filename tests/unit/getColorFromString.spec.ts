import { describe, expect, test } from 'vitest';
import { getColorFromString } from '@/composables/getColorFromString';

const getHue = ( color: string ): number => {
  return Number( color.match( /^hsl\( (\d+) 75% 72% \)$/ )?.[1] );
};

describe( 'цвет из строки', () => {
  test( 'одна строка всегда даёт один цвет', () => {
    expect( getColorFromString( 'Анна Петрова' )).toBe( getColorFromString( 'Анна Петрова' ));
  });

  test( 'оттенок в диапазоне 0–359', () => {
    for ( const value of [ 'Анна Петрова', 'Мама', 'Константин Константинопольский', '🎂', 'a'.repeat( 500 ) ]) {
      const hue: number = getHue( getColorFromString( value ));

      expect( hue ).toBeGreaterThanOrEqual( 0 );
      expect( hue ).toBeLessThan( 360 );
    }
  });

  test( 'разные строки дают разные оттенки', () => {
    expect( getColorFromString( 'Мама' )).not.toBe( getColorFromString( 'Папа' ));
  });

  test( 'пустая строка ничего не ломает', () => {
    expect( getHue( getColorFromString( '' ))).toBeGreaterThanOrEqual( 0 );
  });
});
