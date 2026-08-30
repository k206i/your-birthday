import { reactive, watch } from 'vue';
import { Preferences } from '@capacitor/preferences';
import { appVars } from '@/configApp';
import type { TAchievementCombined } from '@/api/getAchievementById';
import type { TStreakName } from '@/api/getAchievementDate';

type TAppStore = {
  userName: string,
  userBirthDate: string, // YYYY-MM-DD
  userAvatar: string, // имя файла выбранной аватарки, напр. alpaka_art.webp
  additionalName: string, // Важный человек, чей ДР нельзя забыть
  additionalBirthDate: string, // YYYY-MM-DD
  rememberedPersonTitle: string, // Кем приходится человек, чьё имя нельзя забыть (Тёща, Начальник...)
  rememberedPersonName: string, // ...и его имя
  lastAchievement: TAchievementCombined | null, // Последняя полученная ачивка
  nextAchievement: TAchievementCombined | null, // Следующая, которую получит пользователь
  usedWishIds: string[], // Уже показанные поздравления
  lastBirthdayGreetedDate: string, // YYYY-MM-DD последнего автопоказа поздравления
  beardStreakStart: string, // YYYY-MM-DD начала стрика бороды; пусто = не запущен
  dietStreakStart: string, // YYYY-MM-DD начала стрика диеты; пусто = не запущен
  sportStreakStart: string, // YYYY-MM-DD начала стрика спорта; пусто = не запущен
  femaleCycleLength: number, // Средняя длина цикла в днях, femaleCalendar
  weddingDate: string, // YYYY-MM-DD даты свадьбы; пусто = не задана
  dismissedAlerts: string[], // dismissName закрытых предупреждений
  specialAchievements: Record< string, string >, // id специальной ачивки -> YYYY-MM-DD получения
  resetedStreaks: TStreakName[], // стрики, которые сбрасывали: следующий запуск считается возвращением
}

const STORAGE_KEY = 'appStore';

export const appStore: TAppStore = reactive({
  userName: '',
  userBirthDate: '',
  userAvatar: '',
  additionalName: '',
  additionalBirthDate: '',
  rememberedPersonTitle: '',
  rememberedPersonName: '',
  lastAchievement: null,
  nextAchievement: null,
  usedWishIds: [],
  lastBirthdayGreetedDate: '',
  beardStreakStart: '',
  dietStreakStart: '',
  sportStreakStart: '',
  femaleCycleLength: appVars.ovulation.cycleDefault,
  weddingDate: '',
  dismissedAlerts: [],
  specialAchievements: {},
  resetedStreaks: [],
});

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
