// Сравнение версий вида 1.2.10. Возвращает 1, если первая больше, -1 если меньше, 0 при равенстве
// Суффикс после дефиса (1.2.0-beta) в сравнении не участвует
const toParts = ( version: string ): number[] => {
  return version.split( '-' )[ 0 ].split( '.' ).map( item => Number( item ) || 0 );
};

export const compareVersions = ( left: string, right: string ): number => {
  const leftParts: number[] = toParts( left );
  const rightParts: number[] = toParts( right );
  const length: number = Math.max( leftParts.length, rightParts.length );

  for ( let index: number = 0; index < length; index++ ) {
    const leftPart: number = leftParts[ index ] ?? 0;
    const rightPart: number = rightParts[ index ] ?? 0;

    if ( leftPart !== rightPart ) {
      return leftPart > rightPart ? 1 : -1;
    }
  }

  return 0;
};
