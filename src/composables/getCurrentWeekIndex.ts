import { parseLocalDate } from '@/composables/localDate';

// Прожитая неделя жизни: полных лет × 52 + неделя внутри текущего года (0-51).
// null, если дата рождения не задана.
export const getCurrentWeekIndex = ( birthDate: string, today: string ): number | null => {
  if ( !birthDate ) {
    return null;
  }

  const birth: Date = parseLocalDate( birthDate );
  const todayDate: Date = parseLocalDate( today );

  // Возраст в полных годах
  let yearsLived: number = todayDate.getFullYear() - birth.getFullYear();
  const lastBirthday: Date = new Date( birth );
  lastBirthday.setFullYear( birth.getFullYear() + yearsLived );

  if ( lastBirthday > todayDate ) {
    yearsLived--;
    lastBirthday.setFullYear( birth.getFullYear() + yearsLived );
  }

  // Неделя внутри текущего года жизни (53-я прижимается к 52-й)
  const MS_PER_WEEK: number = 7 * 24 * 60 * 60 * 1000;
  const weeksSinceBirthday: number = Math.min( 51, Math.floor(( todayDate.getTime() - lastBirthday.getTime() ) / MS_PER_WEEK ));

  return yearsLived * 52 + weeksSinceBirthday;
}
