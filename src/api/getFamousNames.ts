// Знаменитые люди России

import famousData from '@/jsons/famous_russia.json';
import { getNewFormattedDate } from '@/composables/getNewFormattedDate';
import { appVars } from '@/configApp';

export type TFamousPersonData = {
  name: string,
  category: string,
  date_birth: string | null, // DD-MM-YYYY
  date_death: string | null, // DD-MM-YYYY
  note: string | null,
  isAlive: boolean,
}

export type TGetFamousNamesResponse = {
  birthNow: TFamousPersonData[],    // Родились в расчётный день
  deathNow: TFamousPersonData[],    // Умерли в расчётный день
  birthNormal: TFamousPersonData[], // Родились в диапазоне нормального течения беременности
  deathNormal: TFamousPersonData[], // Умерли в диапазоне нормального течения беременности
}

const getDayMonth = ( ddMmYyyy: string | null ): string | null => {
  if ( !ddMmYyyy ) return null;
  const parts = ddMmYyyy.split( '-' );
  return parts[0] + '-' + parts[1]; // DD-MM
};

export const getFamousNames = async ( datePayload: Date ): Promise< TGetFamousNamesResponse > => {
  const returnData: TGetFamousNamesResponse = {
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

  const getFilteredByBirth = ( daysShift: number ): TFamousPersonData[] => {
    const target = getFormattedDayMonth( daysShift );
    return famousData.filter( item => getDayMonth( item.date_birth ) === target );
  };

  const getFilteredByDeath = ( daysShift: number ): TFamousPersonData[] => {
    const target = getFormattedDayMonth( daysShift );
    return famousData.filter( item => getDayMonth( item.date_death ) === target );
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
