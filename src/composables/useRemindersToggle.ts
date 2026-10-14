import { computed, ref, watch } from 'vue';
import type { ToggleCustomEvent } from '@ionic/vue';
import { appStore } from '@/store/appStore';
import { disableReminders, enableReminders, remindersPermission } from '@/api/birthdayReminders';
import type { TRemindersEnableResult } from '@/api/birthdayReminders';

export const useRemindersToggle = () => {
  // IonToggle переключается сам, после отказа его нужно вернуть явно
  const isRemindersToggleOn = ref< boolean >( appStore.isRemindersEnabled );
  const isBlockedHintRequested = ref< boolean >( false );

  watch(() => appStore.isRemindersEnabled, ( value: boolean ) => {
    isRemindersToggleOn.value = value;
  });

  const isBlockedHintShown = computed(() => isBlockedHintRequested.value && remindersPermission.value === 'denied' );

  const onRemindersToggle = async ( event: ToggleCustomEvent ): Promise< void > => {
    const isChecked: boolean = event.detail.checked;

    isRemindersToggleOn.value = isChecked;

    if ( !isChecked ) {
      disableReminders();

      return;
    }

    const result: TRemindersEnableResult = await enableReminders();

    isBlockedHintRequested.value = result === 'blocked';
    isRemindersToggleOn.value = appStore.isRemindersEnabled;
  };

  return { isRemindersToggleOn, isBlockedHintShown, onRemindersToggle };
};
