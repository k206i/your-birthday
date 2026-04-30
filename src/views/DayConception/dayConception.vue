<script setup lang="ts">
import styles from './dayConception.module.scss';
import {IonContent, IonPage, IonIcon, IonDatetime} from '@ionic/vue';
import Header from '@/components/Header/header.vue';
import { logoIonic } from 'ionicons/icons';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {ref, computed, watch} from 'vue';
import {getHolidaysNames} from '@/api/getHolidaysNames';

const selectedDate = ref();
const formattedDate = computed(() => {
  if ( !selectedDate.value ) {
    return '';
  }
  return selectedDate.value.split('T')[0];
});


watch(formattedDate, () => {
  getHolidaysNames( new Date( selectedDate.value ));
  console.log('change!')
});
</script>

<template>
  <ion-page :class="styles.dayConception">
    <Header>
      День вашего зачатия
    </Header>

    <ion-content :fullscreen="true" class="ion-padding">

      <ion-icon :icon="logoIonic"></ion-icon>

      <h1>День, когда вас зачали</h1>
      <p>Какой был праздник в день вашего зачатия?</p>

      <ion-datetime
          v-model="selectedDate"
          locale="ru-RU"
          presentation="date"
          :show-default-buttons="true"
          done-text="Готово" cancel-text="Не, отмена"
      ></ion-datetime>

      {{ formattedDate }}

    </ion-content>

    <AppFooter />
  </ion-page>
</template>