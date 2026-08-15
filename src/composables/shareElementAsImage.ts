import { toPng } from 'html-to-image';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Capacitor } from '@capacitor/core';

// Снимает DOM-элемент в PNG и открывает системный диалог "Поделиться"
export const shareElementAsImage = async (
  element: HTMLElement | undefined,
  fileName: string = 'share.png',
  excludeSelectors: string[] = []
): Promise< void > => {
  if ( !element ) {
    return;
  }

  // Без фона PNG получится прозрачным и в мессенджерах будет выглядеть сломанным
  const backgroundColor: string = getComputedStyle( document.documentElement )
    .getPropertyValue( '--brd-color-bg' ).trim() || '#0c0f17';

  const dataUrl: string = await toPng( element, {
    pixelRatio: 2,
    backgroundColor,
    filter: ( node: HTMLElement ): boolean => {
      if ( typeof node.matches !== 'function' ) {
        return true;
      }

      return !excludeSelectors.some( selector => node.matches( selector ));
    },
  });

  if ( Capacitor.getPlatform() === 'web' ) {
    // В браузере нативного шаринга файлов нет — просто скачиваем (удобно для отладки)
    const link: HTMLAnchorElement = document.createElement( 'a' );
    link.href = dataUrl;
    link.download = fileName;
    link.click();

    return;
  }

  const savedFile = await Filesystem.writeFile({
    path: fileName,
    data: dataUrl.split( ',' )[1],
    directory: Directory.Cache,
  });

  try {
    await Share.share({
      files: [ savedFile.uri ],
    });
  } catch {
    // Пользователь закрыл диалог шаринга — это не ошибка
  }
}
