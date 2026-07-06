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
