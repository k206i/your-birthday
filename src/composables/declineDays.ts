// Склонение слова "день" по количеству: 1 день, 2 дня, 5 дней
export const declineDays = ( count: number ): string => {
  const mod10: number = count % 10;
  const mod100: number = count % 100;

  if ( mod10 === 1 && mod100 !== 11 ) {
    return 'день';
  }

  if ( mod10 >= 2 && mod10 <= 4 && ( mod100 < 12 || mod100 > 14 )) {
    return 'дня';
  }

  return 'дней';
}
