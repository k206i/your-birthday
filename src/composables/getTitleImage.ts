const modules = import.meta.glob(
  '@/assets/img/titles/*.{webp,png}',
  { eager: true, query: '?url', import: 'default' }
);

const titles: string[] = Object.values( modules ) as string[];

// Выбор один раз при загрузке модуля
const titleImage: string = titles[ Math.floor( Math.random() * titles.length ) ];

export const getTitleImage = (): string => {
  return titleImage;
}
