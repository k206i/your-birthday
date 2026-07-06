// Праздничные дни

import holidaysData from '@/jsons/holidays_data.json';
import {getNewFormattedDate} from '@/composables/getNewFormattedDate';
import {appVars} from '@/configApp';

export type THolidayData = {
  "date": string, // DD-MM
  "name": string,
  "category": string,
  "established_year": number | null,
  "period"?: string, // Если праздник уже отменён
  "note": string | null,
  "isActive": boolean,
}

export type TGetHolidaysNamesResponse = {
  datesNow: THolidayData[], // Праздники в расчётный день
  datesBefore: THolidayData[], // Праздники в случае преждевременных родов
  datesNormal: THolidayData[], // Праздники в нормальном случае с погрешностью appVars.dayNormalPeriod
  datesAfter: THolidayData[], // Праздники в случае запоздалых родов
}

export const getHolidaysNames = async ( datePayload: Date ): Promise< TGetHolidaysNamesResponse > => {
  const returnData: TGetHolidaysNamesResponse = {
    datesNow: [],
    datesBefore: [],
    datesNormal: [],
    datesAfter: [],
  };

  const getFilteredData = ( daysShift: number ): THolidayData[] => {
    const formattedDay: string = getNewFormattedDate({
      dateObject: datePayload,
      dateName: 'day',
      daysShift,
    });
    const formattedMonth: string = getNewFormattedDate({
      dateObject: datePayload,
      dateName: 'month',
      daysShift,
    });
    return holidaysData.filter( item => {
      return item.date === formattedDay + '-' + formattedMonth;
    });
  };

  // в расчётный день
  returnData.datesNow.push( ...getFilteredData( 0 ));

  // от расчётной даты зачатия, в пределах нормального срока беременности
  for ( let i = -appVars.dayNormalPeriod; i <= appVars.dayNormalPeriod; i++) {
    if ( i === 0 ) {
      continue; // расчётный день уже лежит в datesNow
    }
    returnData.datesNormal.push( ...getFilteredData( i ));
  }

  // от расчётной даты зачатия, в случае преждевременных родов
  for (
    let i = - (appVars.dayNormalPeriod + appVars.dayAdditionalPeriod);
    i < -appVars.dayNormalPeriod; i++) {
    returnData.datesAfter.push( ...getFilteredData( i ));
  }

  // от расчётной даты зачатия, в случае запоздалых родов
  for (
    let i = appVars.dayNormalPeriod;
    i <= appVars.dayNormalPeriod + appVars.dayAdditionalPeriod; i++) {
    returnData.datesBefore.push( ...getFilteredData( i ));
  }

  return returnData;
}