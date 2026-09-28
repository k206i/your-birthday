import { beforeEach, describe, expect, test } from 'vitest';
import { appStore } from '@/store/appStore';
import { currentDate } from '@/store/currentDate';
import { getStreakDays, setStreakStart } from '@/api/getAchievementDate';
import { formatLocalDate, parseLocalDate } from '@/composables/localDate';

const START: string = '2026-06-01';

// Серия длиной days дней, закончившаяся сбросом
const runAndReset = ( days: number ): void => {
  currentDate.value = START;
  setStreakStart( 'beard', START );

  const end: Date = parseLocalDate( START );
  end.setDate( end.getDate() + days );
  currentDate.value = formatLocalDate( end );

  setStreakStart( 'beard', '' );
};

describe( 'история серии', () => {
  beforeEach(() => {
    appStore.streakRecords = {};
    appStore.streakLastResults = {};
    appStore.beardStreakStart = '';
  });

  test( 'сброс сохраняет длину серии', () => {
    runAndReset( 10 );

    expect( appStore.streakRecords.beard ).toBe( 10 );
    expect( appStore.streakLastResults.beard ).toBe( 10 );
  });

  test( 'короткая серия не перетирает рекорд, но видна как последняя', () => {
    runAndReset( 10 );
    runAndReset( 5 );

    expect( appStore.streakRecords.beard ).toBe( 10 );
    expect( appStore.streakLastResults.beard ).toBe( 5 );
  });

  test( 'длинная серия обновляет рекорд', () => {
    runAndReset( 10 );
    runAndReset( 20 );

    expect( appStore.streakRecords.beard ).toBe( 20 );
    expect( appStore.streakLastResults.beard ).toBe( 20 );
  });

  test( 'запуск серии историю не трогает', () => {
    runAndReset( 10 );
    setStreakStart( 'beard', currentDate.value );

    expect( appStore.streakRecords.beard ).toBe( 10 );
    expect( appStore.streakLastResults.beard ).toBe( 10 );
    expect( getStreakDays( 'beard' )).toBe( 0 );
  });

  test( 'без запущенной серии сброс ничего не пишет', () => {
    setStreakStart( 'beard', '' );

    expect( appStore.streakRecords.beard ).toBeUndefined();
    expect( appStore.streakLastResults.beard ).toBeUndefined();
  });
});
