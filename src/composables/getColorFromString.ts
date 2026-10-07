import { hashString } from '@/composables/hashString';

export const getColorFromString = ( value: string ): string => {
  return `hsl( ${ Math.abs( hashString( value )) % 360 } 75% 72% )`;
};
