// Резолв картинки ачивки по имени файла (значение поля image, напр. "famous_1.webp").
// Один рекурсивный glob по всем подпапкам achievements/ — Vite требует статический литерал,
// поэтому путь фиксированный, а категории-подпапки покрывает **

const modules = import.meta.glob(
  '@/assets/img/achievements/**/*.webp',
  { eager: true, query: '?url', import: 'default' }
);

// Карта "имя файла (famous_1.webp) → URL", строится один раз при загрузке модуля
const imageByFile: Map< string, string > = new Map(
  Object.entries( modules ).map(([ path, url ]) => [
    path.split('/').pop() as string,
    url as string,
  ])
);

export const getAchievementImage = ( image: string ): string | undefined => {
  return imageByFile.get( image );
}
