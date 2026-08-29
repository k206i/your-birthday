import { currentDate } from '@/store/currentDate';
import { parseLocalDate } from '@/composables/localDate';
import { getAchievementDate, MS_PER_DAY } from '@/api/getAchievementDate';
import type { TAchievementCombined } from '@/api/getAchievementById';

export type TAchievementsProgress = {
  daysToNext: number | null, // null — следующей ачивки нет или шкала неактивна
  daysFromLast: number | null, // null — шкала неактивна; 0 — ещё ничего не получено
}

export const getAchievementsProgress = ( achievements: TAchievementCombined[] ): TAchievementsProgress => {
  const today: number = parseLocalDate( currentDate.value ).getTime();

  let lastAt: number | null = null;
  let nextAt: number | null = null;
  let hasActiveScale: boolean = false;

  for ( const item of achievements ) {
    // Ачивка без шкалы выдаётся за действие и не образует последовательности — в прогресс не идёт
    if ( item.weeks === undefined && item.days === undefined && item.years === undefined ) {
      continue;
    }

    const at: number | null = getAchievementDate( item );

    if ( at === null ) {
      continue;
    }

    hasActiveScale = true;

    if ( at <= today && ( lastAt === null || at > lastAt )) {
      lastAt = at;
    }

    if ( at > today && ( nextAt === null || at < nextAt )) {
      nextAt = at;
    }
  }

  if ( !hasActiveScale ) {
    return { daysToNext: null, daysFromLast: null };
  }

  return {
    daysToNext: nextAt === null ? null : Math.round(( nextAt - today ) / MS_PER_DAY ),
    daysFromLast: lastAt === null ? 0 : Math.round(( today - lastAt ) / MS_PER_DAY ),
  };
}
