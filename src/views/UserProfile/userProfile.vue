<script setup lang="ts">
import styles from './userProfile.module.scss';
import {IonContent, IonPage, IonToggle} from '@ionic/vue';
import type {ToggleCustomEvent} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import UiInput from '@/components/Ui/Input/uiInput.vue';
import {appStore} from '@/store/appStore';
import {contactsPermission} from '@/store/contactsStore';
import {disableContacts, enableContacts, openContactsSettings} from '@/api/getContactsBirthdays';
import type {TContactsEnableResult} from '@/api/getContactsBirthdays';
import AvatarSetup from '@/components/Avatar/Setup/avatarSetup.vue';
import WidgetAlert from '@/components/Widgets/Alert/widgetAlert.vue';
import AppVersion from '@/components/AppVersion/appVersion.vue';
import {computed, ref, watch} from 'vue';

// IonToggle переключается сам, после отказа его нужно вернуть явно
const isContactsToggleOn = ref< boolean >( appStore.isContactsEnabled );
const isBlockedHintRequested = ref< boolean >( false );

watch(() => appStore.isContactsEnabled, ( value: boolean ) => {
  isContactsToggleOn.value = value;
});

const isBlockedHintShown = computed(() => isBlockedHintRequested.value && contactsPermission.value === 'denied' );

const onContactsToggle = async ( event: ToggleCustomEvent ) => {
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
</script>

<template>
  <ion-page :class="styles.userProfile">
    <AppHeader page-name="Ваши <span class='accent-theme'>настройки</span>" />

    <ion-content :fullscreen="true" class="ion-padding">
      <WidgetAlert
          title="Ваши данные — только у вас"
          comment="Все записи хранятся на устройстве, приложение работает офлайн.
Если очистить данные или переустановить приложение, записи могут исчезнуть. Но их легко восстановить — главное, помнить важные даты."
          type="warning"
          dismiss-name="saveLocalData"
      />

      <div :class="styles.userProfile__block">
        <AvatarSetup />
      </div>

      <div :class="styles.userProfile__block">
        <div :class="styles.userProfile__blockLabel">
          Обо мне
        </div>

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.userName"
            label="Как вас зовут?"
            placeholder="Введите имя"
        />

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.userBirthDate"
            type="date"
            label="Когда у вас день рождения?"
            placeholder="выберите дату"
        />
      </div>

      <div :class="styles.userProfile__block">
        <div :class="styles.userProfile__blockLabel">
          Контакты
        </div>

        <div :class="styles.userProfile__toggleRow">
          <div>
            <div :class="styles.userProfile__toggleRowText">
              Показывать дни рождения из контактов
            </div>

            <div :class="styles.userProfile__blockComment">
              Контакты читаются только на этом телефоне: мы их не сохраняем и никуда не отправляем

              <div v-if="isBlockedHintShown"
                   :class="styles.userProfile__hiddenBlock"
              >
                Доступ к контактам запрещён в настройках телефона.

                <span :class="styles.userProfile__actionLink" @click="openContactsSettings">
                  Открыть настройки
                </span>
              </div>
            </div>
          </div>

          <ion-toggle
              :checked="isContactsToggleOn"
              aria-label="Показывать дни рождения из контактов"
              @ionChange="onContactsToggle"
          ></ion-toggle>
        </div>
      </div>

      <div :class="styles.userProfile__block">
        <div :class="styles.userProfile__blockLabel">
          Семья
        </div>

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.weddingDate"
            type="date"
            label="День рождения вашей семьи"
            placeholder="выберите дату"
        />

        <div :class="styles.userProfile__blockComment">
          Откроем достижения по годовщинам — от ситцевой до золотой&nbsp;💍
        </div>
      </div>

      <div :class="styles.userProfile__block">
        <div :class="styles.userProfile__blockLabel">
          Не забыть поздравить
        </div>

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.additionalName"
            label="Имя того, кого поздравить"
            placeholder="Введите имя или солнышко, зайка 🥰"
        />

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.additionalBirthDate"
            type="date"
            label="Когда день рождения?"
        />

        <div :class="styles.userProfile__blockComment">
          Напомним за 3 дня, чтобы вы успели подготовиться 🎁
        </div>
      </div>

      <div :class="styles.userProfile__block">
        <div :class="styles.userProfile__blockLabel">
          На всякий случай, чтобы не забыть как зовут 🤭
        </div>

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.rememberedPersonTitle"
            label="Кто это?"
            placeholder="Тёща, Тесть, Невестка, Начальник..."
        />

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.rememberedPersonName"
            label="Как зовут?"
            placeholder="Лучше имя, и не прозвище 😅"
        />

        <div :class="styles.userProfile__blockComment">
          Чтобы не «э-э-э...» в ответственный момент 🥶
        </div>
      </div>

      <AppVersion />
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
