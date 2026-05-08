type TPayload = {
  dateObject: Date
  daysShift: number,
  dateName: 'day' | 'month',
}

export const getNewFormattedDate = ( payload: TPayload ): string => {
  let result = '00';
  const findDate: Date = new Date( payload.dateObject );
  findDate.setDate( payload.dateObject.getDate() + payload.daysShift);

  switch ( payload.dateName ) {
    case 'day':
      result = findDate.getDate().toString().padStart(2, '0');
      break;

    case 'month':
      result = (findDate.getMonth() + 1).toString().padStart(2, '0');
      break;

    default:
      console.warn( 'Error in getNewFormattedDate.ts' );
  }

  return result;
}