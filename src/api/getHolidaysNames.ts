import holidaysData from '@/jsons/holidays_data.json';

type THolidayData = {
  "date": string, // DD-MM
  "name": string,
  "category": string,
  "established_year": number | null,
  "period"?: string, // Если праздник уже отменён
  "note": string | null,
  "isActive": boolean,
}

type TResponse = {
  datesNow: THolidayData[], // Праздники в течение ADDITIONAL_PERIOD до даты
  datesBefore: THolidayData[], // Праздники в течение ADDITIONAL_PERIOD после даты
  datesAfter: THolidayData[],
}

const ADDITIONAL_PERIOD = 7; // Дней

export const getHolidaysNames = async ( datePayload: Date ): Promise< TResponse > => {
  const returnData: TResponse = {
    datesBefore: [],
    datesNow: [],
    datesAfter: [],
  };

  const getNewDay = ( days: number ) => {
    const result: Date = new Date( datePayload );
    result.setDate( datePayload.getDate() + days);
    return result;
  };

  //returnData.datesNow = holidaysArr;

  for ( let i = 0; i <= ADDITIONAL_PERIOD; i++) {
    let formattedDay: string = getNewDay( i ).getDate().toString().padStart(2, '0');
    let formattedMonth: string = (getNewDay( i ).getMonth() + 1).toString().padStart(2, '0');
    let holidaysArr: THolidayData[] = holidaysData.filter( item => {
      return item.date === formattedDay + '-' + formattedMonth;
    });

    if ( i === 0 ) {
      returnData.datesNow = holidaysArr;

    } else {
      returnData.datesAfter.push( ...holidaysArr );

      formattedDay = getNewDay(-i).getDate().toString().padStart(2, '0');
      formattedMonth = (getNewDay(-i).getMonth() + 1).toString().padStart(2, '0');

      holidaysArr = holidaysData.filter( item => {
        return item.date === formattedDay + '-' + formattedMonth;
      });

      returnData.datesBefore.push( ...holidaysArr );
    }
  }

  console.log( returnData)

  return returnData;
}