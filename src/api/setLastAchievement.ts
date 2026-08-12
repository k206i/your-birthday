// Считает последнюю и следующую ачивку по всем подключённым шкалам и пишет их в стор
// (стор автоматически сохраняется в Preferences).
//
// Критерий один — календарная дата получения, см. getAchievementDate. За счёт этого
// сброс стрика бесплатен: beard-шкала выпадает из перебора, и last сам возвращается
// к возрастной вехе, ничего восстанавливать не нужно.

import { appStore } from '@/store/appStore';
import { currentDate } from '@/store/currentDate';
import { parseLocalDate } from '@/composables/localDate';
import { getAchievementDate } from '@/api/getAchievementDate';
import type { TAchievementCombined } from '@/api/getAchievementById';
import famousAchievements from '@/jsons/achievements_famous.json';
import ageAchievements from '@/jsons/achievements_age.json';
import beardAchievements from '@/jsons/achievements_beard.json';

const SOURCES: TAchievementCombined[] = [
  ...( famousAchievements as TAchievementCombined[] ),
  ...( ageAchievements as TAchievementCombined[] ),
  ...( beardAchievements as TAchievementCombined[] ),
];

export const setLastAchievement = (): void => {
  const today: number = parseLocalDate( currentDate.value ).getTime();

  let last: TAchievementCombined | null = null;
  let lastAt: number = -Infinity;
  let next: TAchievementCombined | null = null;
  let nextAt: number = Infinity;

  for ( const item of SOURCES ) {
    const at: number | null = getAchievementDate( item );

    // Шкала неактивна — ачивка недостижима, в расчёт не идёт
    if ( at === null ) {
      continue;
    }

    if ( at <= today && at > lastAt ) {
      last = item;
      lastAt = at;
    }

    if ( at > today && at < nextAt ) {
      next = item;
      nextAt = at;
    }
  }

  appStore.lastAchievement = last;
  appStore.nextAchievement = next;
}
