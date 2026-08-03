export type TDeclineUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';

// Формы слова: [ 1, 2-4, 5-20 ] — 1 год, 2 года, 5 лет
const FORMS: Record< TDeclineUnit, [ string, string, string ] > = {
  year: [ 'год', 'года', 'лет' ],
  month: [ 'месяц', 'месяца', 'месяцев' ],
  week: [ 'неделя', 'недели', 'недель' ],
  day: [ 'день', 'дня', 'дней' ],
  hour: [ 'час', 'часа', 'часов' ],
  minute: [ 'минуту', 'минуты', 'минут' ], // В винительном падеже
  second: [ 'секунду', 'секунды', 'секунд' ],
};

// Склонение единицы времени по количеству: 1 день, 2 дня, 5 дней
export const declineUnit = ( count: number, type: TDeclineUnit = 'day' ): string => {
  const forms: [ string, string, string ] = FORMS[ type ];
  const mod10: number = count % 10;
  const mod100: number = count % 100;

  if ( mod10 === 1 && mod100 !== 11 ) {
    return forms[0];
  }

  if ( mod10 >= 2 && mod10 <= 4 && ( mod100 < 12 || mod100 > 14 )) {
    return forms[1];
  }

  return forms[2];
}
