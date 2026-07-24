<script setup lang="ts">
import styles from './widgetAddBirthday.module.scss';
import {IonButton, IonModal, IonDatetime, IonContent} from '@ionic/vue';
import {ref, computed, watch} from 'vue';
import {appStore} from '@/store/appStore';
import {currentDate} from '@/store/currentDate';
import {formatDisplayDate} from '@/composables/localDate';

const isDateModalOpen = ref( false );
const selectedDate = ref();

const openDateModal = () => {
  isDateModalOpen.value = true;
};

const maxDate = computed(() => currentDate.value + 'T23:59:59');

// Предзаполнение из профиля и обновление при его изменении
watch(() => appStore.userBirthDate, ( value ) => {
  selectedDate.value = value || undefined;
}, { immediate: true });

// Выбор даты обновляет профиль
watch( selectedDate, () => {
  if ( selectedDate.value ) {
    appStore.userBirthDate = selectedDate.value.split('T')[0];
  }
});

const birthDay = computed(() => {
  if ( !selectedDate.value ) {
    return '';
  }

  return formatDisplayDate( new Date( selectedDate.value.split('T')[0] ));
});
</script>

<template>
  <div :class="styles.widgetAddBirthday">
    <img :class="styles.widgetAddBirthday__art" src="@/assets/img/animals/cat-astro_art.png" alt="" />

    <div :class="styles.widgetAddBirthday__title">
      Здесь появятся ваши достижения
    </div>

    <div :class="styles.widgetAddBirthday__comment">
      Укажите дату рождения — и мы откроем ачивки по прожитым неделям: за возраст, эпоху и кумиров, которых вы обогнали ✨
    </div>

    <ion-button
        :class="styles.widgetAddBirthday__button"
        expand="block"
        @click="openDateModal"
    >
      {{ birthDay ? `📅 ${birthDay}` : 'Выбрать дату рождения' }}
    </ion-button>

    <ion-modal
        :is-open="isDateModalOpen"
        keep-contents-mounted="true"
        @did-dismiss="isDateModalOpen = false"
    >
      <ion-content>
        <div class="center-content">
          <ion-datetime
              v-model="selectedDate"
              locale="ru-RU"
              presentation="date"
              :show-default-buttons="true"
              done-text="Готово" cancel-text="Не, отмена"
              :max="maxDate"
              :first-day-of-week="1"
              @ionChange="isDateModalOpen = false"
              @ionCancel="isDateModalOpen = false"
          ></ion-datetime>

          <img :class="styles.widgetAddBirthday__modalArt" src="@/assets/img/animals/cat-astro_art.png" alt="" />
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>
