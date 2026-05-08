// Именины
import namesDaysData from '@/jsons/name_day.json';
import {getNewFormattedDate} from '@/composables/getNewFormattedDate';
import {appVars} from '@/configApp';

type TNameDayData = {
  date: string, // DD-MM
  male_names: string[],
  female_names: string[],
}

export type TGetNamesDaysResponse = {
  nameDayNow: TNameDayData[], // Именины в расчётный день
  nameDayBefore: TNameDayData[], // Именины в течение ADDITIONAL_PERIOD до даты
  nameDayNormal: TNameDayData[],
  nameDayAfter: TNameDayData[], // Именины в течение ADDITIONAL_PERIOD после даты
}

export const getNamesDays = async ( datePayload: Date ): Promise< TGetNamesDaysResponse > => {
  const returnData: TGetNamesDaysResponse = {
    nameDayNow: [],
    nameDayBefore: [],
    nameDayNormal: [],
    nameDayAfter: [],
  };

  const getFilteredData = ( daysShift: number ): TNameDayData => {
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
    return namesDaysData.filter( item => {
      return item.date === formattedDay + '-' + formattedMonth;
    })[0];
  };

  returnData.nameDayNow.push( getFilteredData( 0 ));

  // от расчётной даты зачатия, в пределах нормального срока беременности
  for ( let i = -appVars.dayNormalPeriod; i < appVars.dayNormalPeriod; i++) {
    returnData.nameDayNormal.push( getFilteredData( i ));
  }

  // от расчётной даты зачатия, в случае преждевременных родов
  for (
    let i = - (appVars.dayNormalPeriod + appVars.dayAdditionalPeriod);
    i < -appVars.dayNormalPeriod; i++) {
    returnData.nameDayAfter.push( getFilteredData( i ));
  }

  // от расчётной даты зачатия, в случае запоздалых родов
  for (
    let i = appVars.dayNormalPeriod;
    i <= appVars.dayNormalPeriod + appVars.dayAdditionalPeriod; i++) {
    returnData.nameDayBefore.push( getFilteredData( i ));
  }

  return returnData;
}