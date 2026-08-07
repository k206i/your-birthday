// Случайный арт для низа модалки. Vite требует статический литерал в glob,
// поэтому путь фиксированный

const modules = import.meta.glob(
  '@/assets/img/animals/modal_bottom/*.{webp,png}',
  { eager: true, query: '?url', import: 'default' }
);

const arts: string[] = Object.values( modules ) as string[];

export const getModalBottomArt = (): string => {
  return arts[ Math.floor( Math.random() * arts.length ) ];
}
