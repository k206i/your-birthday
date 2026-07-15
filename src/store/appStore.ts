import { reactive, watch } from 'vue';
import { Preferences } from '@capacitor/preferences';

type TAppStore = {
  userName: string,
}

const STORAGE_KEY = 'appStore';

// Глобальный реактивный стор приложения: компоненты читают и пишут напрямую
export const appStore: TAppStore = reactive({
  userName: '',
});

// Восстановление стора при запуске приложения
export const restoreAppStore = async (): Promise< void > => {
  const { value } = await Preferences.get({ key: STORAGE_KEY });

  if ( !value ) {
    return;
  }

  try {
    Object.assign( appStore, JSON.parse( value ));
  } catch {
    // Повреждённые данные игнорируем, стор останется с дефолтами
  }
};

// Автосохранение при любом изменении стора
watch( appStore, () => {
  Preferences.set({
    key: STORAGE_KEY,
    value: JSON.stringify( appStore ),
  });
});
