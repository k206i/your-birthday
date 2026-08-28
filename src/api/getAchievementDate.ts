// Когда ачивка получена. Единая точка для расчёта last/next и для подсветки в списках,
// чтобы обе стороны не разъехались.
//
// Шкалы у ачивок разные и напрямую несопоставимые: weeks считаются от даты рождения,
// days — от начала своего стрика, years — от даты свадьбы. Поэтому сравниваем
// не числа шкал, а календарные даты.

import { appStore } from '@/store/appStore';
import { currentDate } from '@/store/currentDate';
import { parseLocalDate } from '@/composables/localDate';
import type { TAchievementCombined } from '@/api/getAchievementById';

export type TStreakName = 'beard' | 'diet' | 'sport';

type TStreakAccess = {
  get: () => string,
  set: ( value: string ) => void,
}

export const MS_PER_DAY: number = 24 * 60 * 60 * 1000;

// Единственное место, где стрик привязан к полю стора. Record по TStreakName даёт
// гарантию компилятора: добавили имя в тип — vue-tsc потребует запись и здесь,
// поэтому новый стрик нельзя случайно оставить на чужой дате
const STREAK_ACCESS: Record< TStreakName, TStreakAccess > = {
  beard: {
    get: () => appStore.beardStreakStart,
    set: ( value ) => { appStore.beardStreakStart = value; },
  },
  diet: {
    get: () => appStore.dietStreakStart,
    set: ( value ) => { appStore.dietStreakStart = value; },
  },
  sport: {
    get: () => appStore.sportStreakStart,
    set: ( value ) => { appStore.sportStreakStart = value; },
  },
};

// Стрик ачивки определяется префиксом id (beard_1 -> beard, diet_1 -> diet) —
// тот же контракт, что у getAchievementById
const getStreakName = ( achievementId: string ): TStreakName | null => {
  const prefix: string = achievementId.split( '_' )[0];

  return prefix in STREAK_ACCESS ? prefix as TStreakName : null;
};

const getStreakStart = ( streakName: TStreakName ): string => {
  return STREAK_ACCESS[ streakName ].get();
};

export const setStreakStart = ( streakName: TStreakName, value: string ): void => {
  STREAK_ACCESS[ streakName ].set( value );
};

// Даты старта всех стриков — чтобы следить за ними одним вотчером,
// не перечисляя поля стора при добавлении нового стрика
export const getStreakStarts = (): string[] => {
  return Object.values( STREAK_ACCESS ).map( item => item.get() );
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

  // setFullYear даёт ту же календарную дату через N лет, с учётом високосных
  if ( achievement.years !== undefined ) {
    if ( !appStore.weddingDate ) {
      return null;
    }

    const date: Date = parseLocalDate( appStore.weddingDate );
    date.setFullYear( date.getFullYear() + achievement.years );

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

  // Ни одной шкалы — специальная ачивка, её дату записали в момент выдачи
  const grantedAt: string | undefined = appStore.specialAchievements[ achievement.id ];

  return grantedAt ? parseLocalDate( grantedAt ).getTime() : null;
};

export const isAchievementReceived = ( achievement: TAchievementCombined ): boolean => {
  const date: number | null = getAchievementDate( achievement );

  return date !== null && date <= parseLocalDate( currentDate.value ).getTime();
};
