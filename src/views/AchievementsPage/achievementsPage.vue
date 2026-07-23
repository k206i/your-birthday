<script setup lang="ts">
import styles from './achievementsPage.module.scss';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {IonContent, IonPage} from '@ionic/vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {appVars} from '@/configApp';
</script>

<template>
  <ion-page :class="styles.achievementsPage"
            :style="{
              '--brd-custom-theme-color': appVars.colors.lifeProgress,
            }"
  >
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      Страница ачивок. Тут будут отображаться все возможные ачивки
    </ion-content>

    <AppFooter />
  </ion-page>
</template>