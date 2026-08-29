// Поиск ачивки по id. Контракт id: [часть имени файла]_[порядковый номер], напр. famous_62

import famousAchievements from '@/jsons/achievements_famous.json';
import ageAchievements from '@/jsons/achievements_age.json';
import specialAchievements from '@/jsons/achievements_special.json';

export type TAchievementCombined = {
  id: string,
  icon: string,
  image: string,
  name: string,
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'special',
  comment?: string,
  weeks?: number,
  days?: number, // Дни стрика — для ачивок, основанных на дневной шкале
  years?: number, // Годовщины свадьбы: календарные годы от даты свадьбы
  ageText?: string,
  person?: string,
  wiki?: string,
}

// Ключ = часть имени файла после achievements_
const FILES: Record< string, TAchievementCombined[] > = {
  famous: famousAchievements as TAchievementCombined[],
  age: ageAchievements as TAchievementCombined[],
  special: specialAchievements as TAchievementCombined[],
};

export const getAchievementById = ( id: string ): TAchievementCombined | undefined => {
  const separatorIndex: number = id.lastIndexOf( '_' );

  if ( separatorIndex === -1 ) {
    return undefined;
  }

  const prefix: string = id.slice( 0, separatorIndex );
  const ordinal: number = Number( id.slice( separatorIndex + 1 ) );
  const data: TAchievementCombined[] | undefined = FILES[ prefix ];

  if ( !data ) {
    return undefined;
  }

  // Основной путь — по полю id; подстраховка — по порядковому номеру (1-based)
  return data.find( item => item.id === id ) ?? data[ ordinal - 1 ];
}
