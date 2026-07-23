// Возрастные ачивки: делит их на пройденные и будущие по количеству прожитых недель

import ageAchievements from '@/jsons/achievements_age.json';

export type TAchievementAge = {
  id: string,
  icon: string,
  image: string,
  name: string,
  comment: string,
  weeks: number,
  rarity: string,
}

export type TGetAchievementsAgeResponse = {
  count: number,       // всего ачивок
  earned: TAchievementAge[],   // пройденные (weeks <= переданных)
  upcoming: TAchievementAge[], // будущие
}

export const getAchievementsAge = async ( weeks: number ): Promise< TGetAchievementsAgeResponse > => {
  const earned: TAchievementAge[] = [];
  const upcoming: TAchievementAge[] = [];

  ( ageAchievements as TAchievementAge[] ).forEach( item => {
    if ( item.weeks <= weeks ) {
      earned.push( item );
    } else {
      upcoming.push( item );
    }
  });

  return {
    count: ageAchievements.length,
    earned,
    upcoming,
  };
}
