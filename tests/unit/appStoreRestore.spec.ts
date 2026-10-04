import { beforeEach, describe, expect, test, vi } from 'vitest';
import { Preferences } from '@capacitor/preferences';

// Стор создаётся при импорте, поэтому для каждого случая нужен свежий модуль со значениями по умолчанию
const loadStore = async () => {
  vi.resetModules();

  return import( '@/store/appStore' );
};

beforeEach( async () => {
  await Preferences.clear();
});

describe( 'анонсы новых функций', () => {
  test( 'свежая установка анонс контактов не видит', async () => {
    const { appStore, restoreAppStore, CONTACTS_OFFER_ALERT } = await loadStore();

    await restoreAppStore();

    expect( appStore.dismissedAlerts ).toContain( CONTACTS_OFFER_ALERT );
  });

  test( 'обновившийся видит: сохранённый список заменяет значение по умолчанию целиком', async () => {
    await Preferences.set({ key: 'appStore', value: JSON.stringify({ userName: 'Аня', dismissedAlerts: [ 'saveLocalData' ] }) });

    const { appStore, restoreAppStore, CONTACTS_OFFER_ALERT } = await loadStore();

    await restoreAppStore();

    expect( appStore.dismissedAlerts ).toEqual([ 'saveLocalData' ]);
    expect( appStore.dismissedAlerts ).not.toContain( CONTACTS_OFFER_ALERT );
  });
});
