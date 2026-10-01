export const getInitials = ( name: string ): string => {
  return name
    .split( /\s+/ )
    .map( word => word.match( /\p{L}/u )?.[0] ?? '' )
    .filter( Boolean )
    .slice( 0, 2 )
    .join( '' )
    .toUpperCase();
};
