// Последний релиз на GitHub. Любая осечка — нет сети, исчерпан лимит API, пришло не то —
// это молчаливый null: проверка обновлений не повод показывать пользователю ошибку.
//
// Модуль попадает в сборку только при UPDATE_CHECK=true, см. __UPDATE_CHECK__ в vite.config.ts

const LATEST_RELEASE_URL = 'https://api.github.com/repos/k206i/your-birthday/releases/latest';

type TGithubAsset = {
  name?: string,
  browser_download_url?: string,
  size?: number,
}

type TGithubRelease = {
  tag_name?: string,
  html_url?: string,
  assets?: TGithubAsset[],
}

export type TRelease = {
  version: string,
  url: string, // страница релиза — запасной путь, если apk не нашёлся
  apkUrl: string,
  apkSize: number, // байт, 0 если неизвестен
}

// Магазинная сборка сейчас уходит в артефакты прогона, но если однажды переедет
// в релиз, по имени её отличим и качать не предложим
const findApk = ( assets: TGithubAsset[] ): TGithubAsset | undefined => {
  return assets.find( item => item.name?.endsWith( '.apk' ) && !item.name.includes( '-store' ));
};

export const getLatestRelease = async (): Promise< TRelease | null > => {
  try {
    const response: Response = await fetch( LATEST_RELEASE_URL );

    if ( !response.ok ) {
      return null;
    }

    const data: TGithubRelease = await response.json();

    if ( !data.tag_name || !data.html_url ) {
      return null;
    }

    const apk: TGithubAsset | undefined = findApk( data.assets ?? [] );

    return {
      version: data.tag_name.replace( /^v/, '' ),
      url: data.html_url,
      apkUrl: apk?.browser_download_url ?? '',
      apkSize: apk?.size ?? 0,
    };
  } catch {
    return null;
  }
};
