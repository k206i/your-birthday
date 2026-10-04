// Для анимации brd-collapse: от height: auto браузер анимировать не умеет
export const fixHeight = ( el: Element ): void => {
  ( el as HTMLElement ).style.height = `${ ( el as HTMLElement ).offsetHeight }px`;
};
