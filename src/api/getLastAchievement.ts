import { appStore } from '@/store/appStore';
import { currentDate } from '@/store/currentDate';
import { parseLocalDate } from '@/composables/localDate';
import { getAchievementDate } from '@/api/getAchievementDate';
import type { TAchievementCombined } from '@/api/getAchievementById';

export const getLastAchievement = ( achievements: TAchievementCombined[] ): TAchievementCombined | null => {
  const today: number = parseLocalDate( currentDate.value ).getTime();

  // Особые ачивки одного дня могут иметь одинаковую дату. Порядок выдачи берём из порядка ключей стора
  const grantOrder: string[] = Object.keys( appStore.specialAchievements );

  const getGrantRank = ( achievement: TAchievementCombined ): number => grantOrder.indexOf( achievement.id );

  let last: TAchievementCombined | null = null;
  let lastAt: number = -Infinity;

  for ( const item of achievements ) {
    const at: number | null = getAchievementDate( item );

    if ( at === null || at > today ) {
      continue;
    }

    const isNewer: boolean = at > lastAt;
    const isSameDayButLater: boolean = at === lastAt && last !== null && getGrantRank( item ) > getGrantRank( last );

    if ( isNewer || isSameDayButLater ) {
      last = item;
      lastAt = at;
    }
  }

  return last;
};
