// Знаменитые политики России

import politicsData from '@/jsons/politics_russia.json';
import { getNewFormattedDate } from '@/composables/getNewFormattedDate';
import { appVars } from '@/configApp';

export type TFamousPoliticData = {
  name: string,
  category: string,
  date_birth: string | null, // DD-MM-YYYY
  date_death: string | null, // DD-MM-YYYY
  note: string | null,
  isAlive: boolean,
}

export type TGetFamousPoliticsResponse = {
  birthNow: TFamousPoliticData[],    // Родились в расчётный день
  deathNow: TFamousPoliticData[],    // Умерли в расчётный день
  birthNormal: TFamousPoliticData[], // Родились в диапазоне нормального течения беременности
  deathNormal: TFamousPoliticData[], // Умерли в диапазоне нормального течения беременности
}

const getDayMonth = ( ddMmYyyy: string | null ): string | null => {
  if ( !ddMmYyyy ) return null;
  const parts = ddMmYyyy.split( '-' );
  return parts[0] + '-' + parts[1]; // DD-MM
};

export const getFamousPolitics = async ( datePayload: Date ): Promise< TGetFamousPoliticsResponse > => {
  const returnData: TGetFamousPoliticsResponse = {
    birthNow: [],
    deathNow: [],
    birthNormal: [],
    deathNormal: [],
  };

  const getFormattedDayMonth = ( daysShift: number ): string => {
    const day: string = getNewFormattedDate({
      dateObject: datePayload,
      dateName: 'day',
      daysShift,
    });
    const month: string = getNewFormattedDate({
      dateObject: datePayload,
      dateName: 'month',
      daysShift,
    });
    return day + '-' + month;
  };

  const getFilteredByBirth = ( daysShift: number ): TFamousPoliticData[] => {
    const target = getFormattedDayMonth( daysShift );
    return politicsData.filter( item => getDayMonth( item.date_birth ) === target );
  };

  const getFilteredByDeath = ( daysShift: number ): TFamousPoliticData[] => {
    const target = getFormattedDayMonth( daysShift );
    return politicsData.filter( item => getDayMonth( item.date_death ) === target );
  };

  // В расчётный день
  returnData.birthNow.push( ...getFilteredByBirth( 0 ));
  returnData.deathNow.push( ...getFilteredByDeath( 0 ));

  // В диапазоне нормального течения беременности
  for ( let i = -appVars.dayNormalPeriod; i < appVars.dayNormalPeriod; i++ ) {
    returnData.birthNormal.push( ...getFilteredByBirth( i ));
    returnData.deathNormal.push( ...getFilteredByDeath( i ));
  }

  return returnData;
};
