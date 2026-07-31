// Поиск ачивки по id. Контракт id: [часть имени файла]_[порядковый номер], напр. famous_62

import famousAchievements from '@/jsons/achievements_famous.json';
import ageAchievements from '@/jsons/achievements_age.json';

export type TAchievementCombined = {
  id: string,
  icon: string,
  image: string,
  name: string,
  rarity: string,
  comment?: string,
  weeks?: number,
  ageText?: string,
  person?: string,
  wiki?: string,
}

// Ключ = часть имени файла после achievements_
const FILES: Record< string, TAchievementCombined[] > = {
  famous: famousAchievements as TAchievementCombined[],
  age: ageAchievements as TAchievementCombined[],
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
