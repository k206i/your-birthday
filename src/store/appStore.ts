import { reactive } from 'vue';

type TAppStore = {
  userName: string,
}

// Глобальный реактивный стор приложения: компоненты читают и пишут напрямую
export const appStore: TAppStore = reactive({
  userName: '',
});
