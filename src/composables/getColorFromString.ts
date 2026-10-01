export const getColorFromString = ( value: string ): string => {
  let hash: number = 5381;

  for ( const char of value ) {
    hash = (( hash << 5 ) + hash + ( char.codePointAt( 0 ) ?? 0 )) | 0;
  }

  return `hsl( ${ Math.abs( hash ) % 360 } 75% 72% )`;
};
