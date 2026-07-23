<script setup lang="ts">
import styles from './achievementsPage.module.scss';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {IonContent, IonPage} from '@ionic/vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {appVars} from '@/configApp';
import WidgetAddBirthday from '@/components/Widgets/AddBirthday/widgetAddBirthday.vue';
</script>

<template>
  <ion-page :class="styles.achievementsPage"
            :style="{
              '--brd-custom-theme-color': appVars.colors.achievements,
            }"
  >
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <WidgetAddBirthday />
    </ion-content>

    <AppFooter />
  </ion-page>
</template>