// Ачивка за возвращение к брошенному стрику. Возвращением считается запуск после сброса,
// поэтому помним не «запускал», а «сбрасывал»: у стрика, идущего прямо сейчас, следа
// прошлых запусков нет, а сброс мы увидим.

import { appStore } from '@/store/appStore';
import { grantSpecialAchievement } from '@/api/grantSpecialAchievement';
import type { TStreakName } from '@/api/getAchievementDate';
import type { TAchievementCombined } from '@/api/getAchievementById';

// Record по TStreakName даёт гарантию компилятора: добавили стрик — придётся указать и его ачивку
const RESTART_ACHIEVEMENT: Record< TStreakName, string > = {
  beard: 'special_backBeard',
  diet: 'special_backDiet',
  sport: 'special_backSport',
};

export const markStreakReset = ( streakName: TStreakName ): void => {
  if ( !appStore.resetedStreaks.includes( streakName )) {
    appStore.resetedStreaks.push( streakName );
  }
};

// null — стрик запускают впервые, возвращаться было неоткуда
export const grantStreakRestart = ( streakName: TStreakName ): TAchievementCombined | null => {
  if ( !appStore.resetedStreaks.includes( streakName )) {
    return null;
  }

  return grantSpecialAchievement( RESTART_ACHIEVEMENT[ streakName ] );
};
