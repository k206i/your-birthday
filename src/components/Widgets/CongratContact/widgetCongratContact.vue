<script setup lang="ts">
import styles from './widgetCongratContact.module.scss';
import AvatarContact from '@/components/Avatar/Contact/avatarContact.vue';
import {declineUnit} from '@/composables/declineUnit';
import {formatDayMonth, parseLocalDate} from '@/composables/localDate';
import {appVars} from '@/configApp';
import {appStore} from '@/store/appStore';
import {currentDate} from '@/store/currentDate';
import type {TContactBirthday} from '@/store/contactsStore';
import {computed} from 'vue';
import {useRouter} from 'vue-router';

const props = defineProps<{
  contact: TContactBirthday,
}>();

const router = useRouter();

const today = computed(() => parseLocalDate( currentDate.value ));

const age = computed(() => props.contact.year ? today.value.getFullYear() - props.contact.year : 0 );

const onCongratulate = (): void => {
  router.push({ path: '/giftCardPage', query: { name: props.contact.name } });
};

const onCongratulated = (): void => {
  appStore.congratulatedContacts[ props.contact.id ] = currentDate.value;
};
</script>

<template>
  <div :class="styles.widgetCongratContact"
       :style="{
              '--brd-contacts-birthdays-theme-color': appVars.colors.contactsBirthdays,
            }"
  >
    <div :class="styles.widgetCongratContact__meta">
      <AvatarContact :class="styles.widgetCongratContact__contactImg"
                     :contact="props.contact"
      />

      <div :class="styles.widgetCongratContact__content">
        <div :class="styles.widgetCongratContact__title">
          Сегодня день рождения празднует
        </div>

        <div :class="styles.widgetCongratContact__contactName">
          {{ props.contact.name }}
        </div>

        <div :class="styles.widgetCongratContact__userComment">
          {{ formatDayMonth( today, true ) }}

          <template v-if="age > 0">
            · исполнилось {{ age }} {{ declineUnit( age, 'year' ) }}
          </template>
        </div>

        <div :class="styles.widgetCongratContact__buttons">
          <div :class="[
            styles.widgetCongratContact__button,
            styles.widgetCongratContact__button_light
          ]"
               @click="onCongratulated"
          >
            Уже поздравили
          </div>

          <div :class="styles.widgetCongratContact__button"
               @click="onCongratulate"
          >
            Поздравить
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
