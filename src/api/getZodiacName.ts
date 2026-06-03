// Знаки зодиака

import zodiacData from '@/jsons/zodiac.json';
import { appVars } from '@/configApp';

export type TZodiacSign = {
  name: string,
  name_en: string,
  symbol: string,
  date_start: string, // DD-MM
  date_end: string,   // DD-MM
  element: string,
  planet: string,
  modality: string,
  traits: string,
  note: string | null,
}

export type TGetZodiacNameResponse = {
  exact: TZodiacSign[],   // Знак для точной даты
  period: TZodiacSign[],  // Знаки для диапазона ±dayNormalPeriod/2 дней
}

const toDateNumber = ( ddMm: string, year: number ): number => {
  const [ day, month ] = ddMm.split( '-' ).map( Number );
  return new Date( year, month - 1, day ).getTime();
};

const findZodiacByDate = ( date: Date ): TZodiacSign | null => {
  const year = date.getFullYear();
  const time = date.getTime();

  const result = zodiacData.find(( sign ) => {
    const start = toDateNumber( sign.date_start, year );
    const end = toDateNumber( sign.date_end, year );

    // Козерог: диапазон переходит через новый год (22-12 → 20-01)
    if ( start > end ) {
      return time >= start || time <= end;
    }

    return time >= start && time <= end;
  });

  return result ?? null;
};

export const getZodiacName = async ( datePayload: Date ): Promise< TGetZodiacNameResponse > => {
  const halfPeriod = Math.floor( appVars.dayNormalPeriod / 2 );

  // Точная дата
  const signExact = findZodiacByDate( datePayload );
  const exact: TZodiacSign[] = signExact ? [ signExact ] : [];

  // Диапазон ±halfPeriod дней
  const dateStart = new Date( datePayload );
  dateStart.setDate( dateStart.getDate() - halfPeriod );

  const dateEnd = new Date( datePayload );
  dateEnd.setDate( dateEnd.getDate() + halfPeriod );

  const signStart = findZodiacByDate( dateStart );
  const signEnd = findZodiacByDate( dateEnd );

  const period: TZodiacSign[] = [];

  if ( signStart ) {
    period.push( signStart );
  }

  // Добавляем второй знак только если он отличается от первого
  if ( signEnd && signEnd.name !== signStart?.name ) {
    period.push( signEnd );
  }

  return { exact, period };
};
