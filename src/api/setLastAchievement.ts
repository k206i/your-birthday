// Считает последнюю и следующую ачивку по прожитым неделям и пишет их в стор
// (стор автоматически сохраняется в Preferences)

import { appStore } from '@/store/appStore';
import { currentDate } from '@/store/currentDate';
import { getCurrentWeekIndex } from '@/composables/getCurrentWeekIndex';
import type { TAchievementCombined } from '@/api/getAchievementById';
import famousAchievements from '@/jsons/achievements_famous.json';
import ageAchievements from '@/jsons/achievements_age.json';

// Общая шкала жизни: famous + age (обе weeks-based)
const ALL: TAchievementCombined[] = [
  ...( famousAchievements as TAchievementCombined[] ),
  ...( ageAchievements as TAchievementCombined[] ),
];

// Ачивка с наибольшим weeks среди пройденных (weeks <= переданных); null, если таких нет
const findLast = ( weekIndex: number ): TAchievementCombined | null => {
  let result: TAchievementCombined | null = null;

  for ( const item of ALL ) {
    if ( item.weeks === undefined || item.weeks > weekIndex ) {
      continue;
    }

    if ( result === null || item.weeks > ( result.weeks ?? -Infinity ) ) {
      result = item;
    }
  }

  return result;
}

// Ачивка с наименьшим weeks среди будущих (weeks > переданных); null, если таких нет
const findNext = ( weekIndex: number ): TAchievementCombined | null => {
  let result: TAchievementCombined | null = null;

  for ( const item of ALL ) {
    if ( item.weeks === undefined || item.weeks <= weekIndex ) {
      continue;
    }

    if ( result === null || item.weeks < ( result.weeks ?? Infinity ) ) {
      result = item;
    }
  }

  return result;
}

// Дата рождения, для которой last/next были посчитаны — для детекта смены даты
let computedForBirthDate: string | null = null;

export const setLastAchievement = (): void => {
  const weekIndex: number | null = getCurrentWeekIndex( appStore.userBirthDate, currentDate.value );

  // Нет даты рождения — сбрасываем обе ачивки
  if ( weekIndex === null ) {
    appStore.lastAchievement = null;
    appStore.nextAchievement = null;
    computedForBirthDate = appStore.userBirthDate;

    return;
  }

  // Дата рождения изменилась (или первый расчёт) — полный пересчёт
  if ( computedForBirthDate !== appStore.userBirthDate ) {
    appStore.lastAchievement = findLast( weekIndex );
    appStore.nextAchievement = findNext( weekIndex );
    computedForBirthDate = appStore.userBirthDate;

    return;
  }

  // Поля ещё не заданы — полный поиск обоих
  // TODO: Не забыть тут поменять условие !== --> ===, чтобы включился кэш расчётов
  if ( appStore.lastAchievement !== null || appStore.nextAchievement === null ) {
    appStore.lastAchievement = findLast( weekIndex );
    appStore.nextAchievement = findNext( weekIndex );

    return;
  }

  // Ещё не дошли до следующей вехи — искать ничего не нужно
  if ( appStore.nextAchievement.weeks !== undefined && weekIndex < appStore.nextAchievement.weeks ) {
    return;
  }

  // Дошли до следующей вехи (или сразу нескольких, если приложение долго не открывали):
  // повышаем next до last и ищем новый next, пока текущая неделя не окажется меньше него
  let last: TAchievementCombined = appStore.nextAchievement;
  let next: TAchievementCombined | null = findNext( last.weeks ?? weekIndex );

  while ( next !== null && next.weeks !== undefined && weekIndex >= next.weeks ) {
    last = next;
    next = findNext( next.weeks );
  }

  appStore.lastAchievement = last;
  appStore.nextAchievement = next;
}
