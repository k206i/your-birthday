import { appStore } from '@/store/appStore';
import { currentDate } from '@/store/currentDate';
import { setLastAchievement } from '@/api/setLastAchievement';

// Дата не перезаписывается при повторной выдаче: иначе ачивка каждый раз
// всплывала бы как последняя, вытесняя настоящие
export const grantSpecialAchievement = ( id: string ): void => {
  if ( appStore.specialAchievements[ id ] ) {
    return;
  }

  appStore.specialAchievements[ id ] = currentDate.value;
  setLastAchievement();
};
