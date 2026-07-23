// Ачивки-знаменитости: делит их на пройденные и будущие по количеству прожитых недель

import famousAchievements from '@/jsons/achievements_famous.json';

export type TAchievementFamous = {
  id: string,
  image: string,
  icon: string,
  person: string,
  name: string,
  comment: string,
  weeks: number,
  rarity: string,
  wiki: string,
}

export type TGetAchievementsFamousResponse = {
  count: number,       // всего ачивок
  earned: TAchievementFamous[],   // пройденные (weeks <= переданных)
  upcoming: TAchievementFamous[], // будущие
}

export const getAchievementsFamous = async ( weeks: number ): Promise< TGetAchievementsFamousResponse > => {
  const earned: TAchievementFamous[] = [];
  const upcoming: TAchievementFamous[] = [];

  ( famousAchievements as TAchievementFamous[] ).forEach( item => {
    if ( item.weeks <= weeks ) {
      earned.push( item );
    } else {
      upcoming.push( item );
    }
  });

  return {
    count: famousAchievements.length,
    earned,
    upcoming,
  };
}
