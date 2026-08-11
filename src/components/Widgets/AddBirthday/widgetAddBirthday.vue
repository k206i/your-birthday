<script setup lang="ts">
import styles from './widgetAddBirthday.module.scss';
import {IonButton} from '@ionic/vue';
import {ref, computed, watch} from 'vue';
import {appStore} from '@/store/appStore';
import {currentDate} from '@/store/currentDate';
import {formatDisplayDate, formatLocalDate, parseLocalDate} from '@/composables/localDate';

const selectedDate = ref();

const onNativeDateChange = ( event: Event ) => {
  const value: string = ( event.target as HTMLInputElement ).value;

  if ( value ) {
    selectedDate.value = value;
  }
};

// Нативный календарь принимает границы в формате YYYY-MM-DD, без времени
const maxDate = computed(() => currentDate.value );

const minDate = computed(() => {
  const date: Date = parseLocalDate( currentDate.value );
  date.setFullYear( date.getFullYear() - 120 );

  return formatLocalDate( date );
});

// Предзаполнение из профиля и обновление при его изменении
watch(() => appStore.userBirthDate, ( value ) => {
  selectedDate.value = value || undefined;
}, { immediate: true });

// Выбор даты обновляет профиль
watch( selectedDate, () => {
  if ( selectedDate.value ) {
    appStore.userBirthDate = selectedDate.value;
  }
});

const birthDay = computed(() => {
  if ( !selectedDate.value ) {
    return '';
  }

  return formatDisplayDate( parseLocalDate( selectedDate.value ));
});
</script>

<template>
  <div :class="styles.widgetAddBirthday">
    <img :class="styles.widgetAddBirthday__art" src="@/assets/img/animals/cat-astro_art.webp" alt="" />

    <div :class="styles.widgetAddBirthday__title">
      Здесь появятся ваши достижения
    </div>

    <div :class="styles.widgetAddBirthday__comment">
      Укажите дату рождения — и мы откроем ачивки по прожитым неделям: за возраст, эпоху и кумиров, которых вы обогнали ✨
    </div>

    <div :class="styles.widgetAddBirthday__dateButtonWrap">
      <ion-button
          :class="styles.widgetAddBirthday__button"
          expand="block"
      >
        {{ birthDay ? `📅 ${birthDay}` : 'Выбрать дату рождения' }}
      </ion-button>

      <input
          :class="styles.widgetAddBirthday__nativeDate"
          type="date"
          :value="selectedDate || ''"
          :min="minDate"
          :max="maxDate"
          @change="onNativeDateChange"
      />
    </div>
  </div>
</template>
