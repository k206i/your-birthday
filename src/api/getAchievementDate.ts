// Когда ачивка получена. Единая точка для расчёта last/next и для подсветки в списках,
// чтобы обе стороны не разъехались.
//
// Шкалы у ачивок разные и напрямую несопоставимые: weeks считаются от даты рождения,
// days — от начала стрика. Поэтому сравниваем не числа шкал, а календарные даты получения.

import { appStore } from '@/store/appStore';
import { currentDate } from '@/store/currentDate';
import { parseLocalDate } from '@/composables/localDate';
import type { TAchievementCombined } from '@/api/getAchievementById';

const MS_PER_DAY: number = 24 * 60 * 60 * 1000;

// Пройденные дни стрика; null, если стрик не запущен.
// День старта нулевой: в день нажатия кнопки стрик равен 0 дней
export const getStreakDays = (): number | null => {
  if ( !appStore.beardStreakStart ) {
    return null;
  }

  const start: Date = parseLocalDate( appStore.beardStreakStart );
  const today: Date = parseLocalDate( currentDate.value );

  return Math.floor(( today.getTime() - start.getTime() ) / MS_PER_DAY );
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
    if ( !appStore.beardStreakStart ) {
      return null;
    }

    const date: Date = parseLocalDate( appStore.beardStreakStart );
    date.setDate( date.getDate() + achievement.days );

    return date.getTime();
  }

  return null;
};

export const isAchievementReceived = ( achievement: TAchievementCombined ): boolean => {
  const date: number | null = getAchievementDate( achievement );

  return date !== null && date <= parseLocalDate( currentDate.value ).getTime();
};
