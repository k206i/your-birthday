import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { ToggleCustomEvent } from '@ionic/vue';

const plugin = vi.hoisted(() => ({
  checkPermissions: vi.fn(),
  requestPermissions: vi.fn(),
  getContacts: vi.fn(),
}));

vi.mock( '@capgo/capacitor-contacts', () => ({ CapacitorContacts: plugin }));

import { appStore } from '@/store/appStore';
import { contactsBirthdays, contactsPermission } from '@/store/contactsStore';
import { useContactsToggle } from '@/composables/useContactsToggle';

const permission = ( state: string ) => ({ readContacts: state, writeContacts: 'denied' });

const toggle = ( checked: boolean ): ToggleCustomEvent => {
  return { detail: { checked, value: 'on' } } as unknown as ToggleCustomEvent;
};

beforeEach(() => {
  vi.resetAllMocks();
  plugin.getContacts.mockResolvedValue({ contacts: [] });

  appStore.isContactsEnabled = false;
  contactsBirthdays.value = [];
  contactsPermission.value = 'prompt';
});

describe( 'тумблер контактов', () => {
  test( 'разрешили: тумблер остаётся включённым', async () => {
    plugin.checkPermissions.mockResolvedValue( permission( 'prompt' ));
    plugin.requestPermissions.mockResolvedValue( permission( 'granted' ));

    const { isContactsToggleOn, onContactsToggle } = useContactsToggle();

    await onContactsToggle( toggle( true ));

    expect( isContactsToggleOn.value ).toBe( true );
    expect( appStore.isContactsEnabled ).toBe( true );
  });

  test( 'отказали в диалоге: тумблер возвращается, подсказки нет', async () => {
    plugin.checkPermissions.mockResolvedValue( permission( 'prompt' ));
    plugin.requestPermissions.mockResolvedValue( permission( 'prompt-with-rationale' ));

    const { isContactsToggleOn, isBlockedHintShown, onContactsToggle } = useContactsToggle();

    await onContactsToggle( toggle( true ));

    expect( isContactsToggleOn.value ).toBe( false );
    expect( isBlockedHintShown.value ).toBe( false );
  });

  test( 'запрещено навсегда: тумблер возвращается и появляется подсказка', async () => {
    plugin.checkPermissions.mockResolvedValue( permission( 'denied' ));

    const { isContactsToggleOn, isBlockedHintShown, onContactsToggle } = useContactsToggle();

    await onContactsToggle( toggle( true ));

    expect( isContactsToggleOn.value ).toBe( false );
    expect( isBlockedHintShown.value ).toBe( true );
  });

  test( 'подсказка уходит, когда доступ появился', async () => {
    plugin.checkPermissions.mockResolvedValue( permission( 'denied' ));

    const { isBlockedHintShown, onContactsToggle } = useContactsToggle();

    await onContactsToggle( toggle( true ));
    contactsPermission.value = 'granted';

    expect( isBlockedHintShown.value ).toBe( false );
  });

  test( 'выключили: функция выключена, список очищен', async () => {
    appStore.isContactsEnabled = true;
    contactsBirthdays.value = [{ id: '1', name: 'Аня', month: 5, day: 12 }];

    const { isContactsToggleOn, onContactsToggle } = useContactsToggle();

    await onContactsToggle( toggle( false ));

    expect( isContactsToggleOn.value ).toBe( false );
    expect( appStore.isContactsEnabled ).toBe( false );
    expect( contactsBirthdays.value ).toEqual([]);
  });
});
