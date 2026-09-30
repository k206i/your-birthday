import { beforeEach, describe, expect, test, vi } from 'vitest';

const plugin = vi.hoisted(() => ({
  checkPermissions: vi.fn(),
  requestPermissions: vi.fn(),
  getContacts: vi.fn(),
}));

vi.mock( '@capgo/capacitor-contacts', () => ({ CapacitorContacts: plugin }));

import { appStore } from '@/store/appStore';
import { contactsBirthdays, contactsPermission } from '@/store/contactsStore';
import { enableContacts, refreshContacts, syncContacts } from '@/api/getContactsBirthdays';

const permission = ( state: string ) => ({ readContacts: state, writeContacts: 'denied' });

const ANYA = { id: '1', displayName: 'Аня', birthday: { day: 12, month: 5 } };

beforeEach(() => {
  vi.resetAllMocks();
  plugin.getContacts.mockResolvedValue({ contacts: [ ANYA ] });

  appStore.isContactsEnabled = false;
  contactsBirthdays.value = [];
  contactsPermission.value = 'prompt';
});

describe( 'включение тумблера', () => {
  test( 'разрешили в диалоге: включено и прочитано', async () => {
    plugin.checkPermissions.mockResolvedValue( permission( 'prompt' ));
    plugin.requestPermissions.mockResolvedValue( permission( 'granted' ));

    expect( await enableContacts()).toBe( 'enabled' );
    expect( appStore.isContactsEnabled ).toBe( true );
    expect( contactsBirthdays.value ).toHaveLength( 1 );
  });

  test( 'запрашивается только чтение', async () => {
    plugin.checkPermissions.mockResolvedValue( permission( 'prompt' ));
    plugin.requestPermissions.mockResolvedValue( permission( 'granted' ));

    await enableContacts();

    expect( plugin.requestPermissions ).toHaveBeenCalledWith({ permissions: [ 'readContacts' ] });
  });

  test( 'отказали в диалоге: тумблер выключен, подсказки нет', async () => {
    plugin.checkPermissions.mockResolvedValue( permission( 'prompt' ));
    plugin.requestPermissions.mockResolvedValue( permission( 'denied' ));

    expect( await enableContacts()).toBe( 'refused' );
    expect( appStore.isContactsEnabled ).toBe( false );
    expect( plugin.getContacts ).not.toHaveBeenCalled();
  });

  test( 'запрещено навсегда: диалог не вызывается', async () => {
    plugin.checkPermissions.mockResolvedValue( permission( 'denied' ));

    expect( await enableContacts()).toBe( 'blocked' );
    expect( plugin.requestPermissions ).not.toHaveBeenCalled();
    expect( appStore.isContactsEnabled ).toBe( false );
  });

  test( 'доступ уже был: без диалога', async () => {
    plugin.checkPermissions.mockResolvedValue( permission( 'granted' ));

    expect( await enableContacts()).toBe( 'enabled' );
    expect( plugin.requestPermissions ).not.toHaveBeenCalled();
  });
});

describe( 'синхронизация', () => {
  test( 'выключено: контакты не читаются', async () => {
    plugin.checkPermissions.mockResolvedValue( permission( 'granted' ));

    await syncContacts();

    expect( plugin.getContacts ).not.toHaveBeenCalled();
  });

  test( 'включено и доступ есть: контакты прочитаны', async () => {
    appStore.isContactsEnabled = true;
    plugin.checkPermissions.mockResolvedValue( permission( 'granted' ));

    await syncContacts();

    expect( contactsBirthdays.value ).toHaveLength( 1 );
  });

  test( 'доступ отозвали: тумблер выключается, список очищается', async () => {
    appStore.isContactsEnabled = true;
    contactsBirthdays.value = [{ id: '1', name: 'Аня', month: 5, day: 12 }];
    plugin.checkPermissions.mockResolvedValue( permission( 'denied' ));

    await syncContacts();

    expect( appStore.isContactsEnabled ).toBe( false );
    expect( contactsBirthdays.value ).toEqual([]);
  });
});

describe( 'возврат в приложение', () => {
  test( 'разрешение не изменилось: контакты не перечитываются', async () => {
    appStore.isContactsEnabled = true;
    contactsPermission.value = 'granted';
    plugin.checkPermissions.mockResolvedValue( permission( 'granted' ));

    await refreshContacts();

    expect( plugin.getContacts ).not.toHaveBeenCalled();
  });

  test( 'разрешение отозвали: тумблер выключается', async () => {
    appStore.isContactsEnabled = true;
    contactsPermission.value = 'granted';
    plugin.checkPermissions.mockResolvedValue( permission( 'denied' ));

    await refreshContacts();

    expect( appStore.isContactsEnabled ).toBe( false );
  });
});
