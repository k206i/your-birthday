import { appStore } from '@/store/appStore';
import { currentDate } from '@/store/currentDate';
import { setLastAchievement } from '@/api/setLastAchievement';
import { getAchievementById } from '@/api/getAchievementById';
import type { TAchievementCombined } from '@/api/getAchievementById';

export const grantSpecialAchievement = ( id: string ): TAchievementCombined | null => {
  const achievement: TAchievementCombined | undefined = getAchievementById( id );

  if ( !achievement || appStore.specialAchievements[ id ] ) {
    return null;
  }

  appStore.specialAchievements[ id ] = currentDate.value;
  setLastAchievement();

  return achievement;
};
