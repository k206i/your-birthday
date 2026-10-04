// Работа с датами в локальной таймзоне.
// new Date( 'YYYY-MM-DD' ) и toISOString() работают в UTC, из-за чего
// около полуночи дата может "уехать" на сутки.

export const parseLocalDate = ( dateString: string ): Date => {
  const [ year, month, day ] = dateString.split( '-' ).map( Number );

  return new Date( year, month - 1, day );
}

export const formatLocalDate = ( dateObject: Date ): string => {
  const year: string = dateObject.getFullYear().toString();
  const month: string = ( dateObject.getMonth() + 1 ).toString().padStart( 2, '0' );
  const day: string = dateObject.getDate().toString().padStart( 2, '0' );

  return year + '-' + month + '-' + day;
}

export const formatDayMonth = ( dateObject: Date, withWeekday: boolean = false ): string => {
  const dayMonth: string = dateObject.toLocaleDateString( 'ru-RU', { day: 'numeric', month: 'long' });

  if ( !withWeekday ) {
    return dayMonth;
  }

  return `${ dayMonth }, ${ dateObject.toLocaleDateString( 'ru-RU', { weekday: 'short' }) }`;
};

// Дата для отображения пользователю: "7 апр. 2027 г."
export const formatDisplayDate = ( dateObject: Date ): string => {
  return dateObject.toLocaleDateString( 'ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
