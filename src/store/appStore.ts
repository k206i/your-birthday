import { reactive, watch } from 'vue';
import { Preferences } from '@capacitor/preferences';
import type { TAchievementCombined } from '@/api/getAchievementById';

type TAppStore = {
  userName: string,
  userBirthDate: string, // YYYY-MM-DD
  additionalName: string, // Важный человек, чей ДР нельзя забыть
  additionalBirthDate: string, // YYYY-MM-DD
  rememberedPersonTitle: string, // Кем приходится человек, чьё имя нельзя забыть (Тёща, Начальник...)
  rememberedPersonName: string, // ...и его имя
  lastAchievement: TAchievementCombined | null, // Последняя полученная ачивка
  nextAchievement: TAchievementCombined | null, // Следующая, которую получит пользователь
  usedWishIds: string[], // Уже показанные поздравления — чтобы не повторяться
  lastBirthdayGreetedDate: string, // YYYY-MM-DD последнего автопоказа поздравления
}

const STORAGE_KEY = 'appStore';

// Глобальный реактивный стор приложения: компоненты читают и пишут напрямую
export const appStore: TAppStore = reactive({
  userName: '',
  userBirthDate: '',
  additionalName: '',
  additionalBirthDate: '',
  rememberedPersonTitle: '',
  rememberedPersonName: '',
  lastAchievement: null,
  nextAchievement: null,
  usedWishIds: [],
  lastBirthdayGreetedDate: '',
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
