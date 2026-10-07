export const hashString = ( value: string ): number => {
  let hash: number = 5381;

  for ( const char of value ) {
    hash = (( hash << 5 ) + hash + ( char.codePointAt( 0 ) ?? 0 )) | 0;
  }

  return hash;
};
