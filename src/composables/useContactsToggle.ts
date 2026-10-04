import { computed, ref, watch } from 'vue';
import type { ToggleCustomEvent } from '@ionic/vue';
import { appStore } from '@/store/appStore';
import { contactsPermission } from '@/store/contactsStore';
import { disableContacts, enableContacts } from '@/api/getContactsBirthdays';
import type { TContactsEnableResult } from '@/api/getContactsBirthdays';

export const useContactsToggle = () => {
  // IonToggle переключается сам, после отказа его нужно вернуть явно
  const isContactsToggleOn = ref< boolean >( appStore.isContactsEnabled );
  const isBlockedHintRequested = ref< boolean >( false );

  watch(() => appStore.isContactsEnabled, ( value: boolean ) => {
    isContactsToggleOn.value = value;
  });

  const isBlockedHintShown = computed(() => isBlockedHintRequested.value && contactsPermission.value === 'denied' );

  const onContactsToggle = async ( event: ToggleCustomEvent ): Promise< void > => {
    const isChecked: boolean = event.detail.checked;

    isContactsToggleOn.value = isChecked;

    if ( !isChecked ) {
      disableContacts();

      return;
    }

    const result: TContactsEnableResult = await enableContacts();

    isBlockedHintRequested.value = result === 'blocked';
    isContactsToggleOn.value = appStore.isContactsEnabled;
  };

  return { isContactsToggleOn, isBlockedHintShown, onContactsToggle };
};
