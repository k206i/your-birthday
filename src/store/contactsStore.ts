import { ref } from 'vue';
import type { Ref } from 'vue';

export type TContactsPermission = 'granted' | 'denied' | 'prompt';

export type TContactBirthday = {
  id: string,
  name: string,
  month: number, // 1-12
  day: number,
  year?: number, // в контактах год часто не указан
}

// Живёт только в памяти: контакты читаются заново при каждом запуске и на диск не пишутся
export const contactsPermission: Ref< TContactsPermission > = ref( 'prompt' );
export const contactsBirthdays: Ref< TContactBirthday[] > = ref([]);
