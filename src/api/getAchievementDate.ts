// Когда ачивка получена. Единая точка для расчёта last/next и для подсветки в списках,
// чтобы обе стороны не разъехались.
//
// Шкалы у ачивок разные и напрямую несопоставимые: weeks считаются от даты рождения,
// days — от начала своего стрика. Поэтому сравниваем не числа шкал, а календарные даты.

import { appStore } from '@/store/appStore';
import { currentDate } from '@/store/currentDate';
import { parseLocalDate } from '@/composables/localDate';
import type { TAchievementCombined } from '@/api/getAchievementById';

export type TStreakName = 'beard' | 'diet';

const MS_PER_DAY: number = 24 * 60 * 60 * 1000;

// Стрик ачивки определяется префиксом id (beard_1 -> beard, diet_1 -> diet) —
// тот же контракт, что у getAchievementById
const getStreakName = ( achievementId: string ): TStreakName | null => {
  const prefix: string = achievementId.split( '_' )[0];

  return prefix === 'beard' || prefix === 'diet' ? prefix : null;
};

const getStreakStart = ( streakName: TStreakName ): string => {
  return streakName === 'beard' ? appStore.beardStreakStart : appStore.dietStreakStart;
};

export const setStreakStart = ( streakName: TStreakName, value: string ): void => {
  if ( streakName === 'beard' ) {
    appStore.beardStreakStart = value;

    return;
  }

  appStore.dietStreakStart = value;
};

// Пройденные дни стрика; null, если стрик не запущен.
// День старта нулевой: в день нажатия кнопки стрик равен 0 дней
export const getStreakDays = ( streakName: TStreakName ): number | null => {
  const start: string = getStreakStart( streakName );

  if ( !start ) {
    return null;
  }

  const startDate: Date = parseLocalDate( start );
  const today: Date = parseLocalDate( currentDate.value );

  return Math.floor(( today.getTime() - startDate.getTime() ) / MS_PER_DAY );
};

// Календарная дата получения ачивки в ms; null, если её шкала неактивна
export const getAchievementDate = ( achievement: TAchievementCombined ): number | null => {
  if ( achievement.weeks !== undefined ) {
    if ( !appStore.userBirthDate ) {
      return null;
    }

    const date: Date = parseLocalDate( appStore.userBirthDate );
    date.setDate( date.getDate() + achievement.weeks * 7 );

    return date.getTime();
  }

  if ( achievement.days !== undefined ) {
    const streakName: TStreakName | null = getStreakName( achievement.id );

    if ( streakName === null ) {
      return null;
    }

    const start: string = getStreakStart( streakName );

    if ( !start ) {
      return null;
    }

    const date: Date = parseLocalDate( start );
    date.setDate( date.getDate() + achievement.days );

    return date.getTime();
  }

  return null;
};

export const isAchievementReceived = ( achievement: TAchievementCombined ): boolean => {
  const date: number | null = getAchievementDate( achievement );

  return date !== null && date <= parseLocalDate( currentDate.value ).getTime();
};
