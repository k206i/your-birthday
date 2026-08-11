// Список всех аватарок из assets/img/avatars. Vite требует статический литерал в glob,
// поэтому путь фиксированный

const modules = import.meta.glob(
  '@/assets/img/avatars/*.{webp,png}',
  { eager: true, query: '?url', import: 'default' }
);

export type TAvatar = {
  name: string, // имя файла, напр. alpaka_art.webp
  url: string,
}

// Список строится один раз при загрузке модуля
const avatars: TAvatar[] = Object.entries( modules )
  .map(([ path, url ]) => ({
    name: path.split('/').pop() as string,
    url: url as string,
  }))
  .sort(( a, b ) => a.name.localeCompare( b.name ));

export const getAvatarsList = (): TAvatar[] => {
  return avatars;
}

// Карта "имя файла → URL" для резолва сохранённого выбора
const avatarByName: Map< string, string > = new Map( avatars.map( item => [ item.name, item.url ] ));

export const getAvatarUrl = ( name: string ): string | undefined => {
  return avatarByName.get( name );
}
