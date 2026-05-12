<script setup lang="ts">
import styles from './childBirthday.module.scss';
import {IonContent, IonPage} from '@ionic/vue';
import Header from '@/components/Header/header.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';

</script>

<template>
  <ion-page :class="styles.dayConception">
    <Header />

    <ion-content :fullscreen="true" class="ion-padding">

      <WidgetPageTitle bg-image="cat-1" color="#548fd6">
        Вы собираетесь завести ребёнка?

        <template #lead>
          Давайте спланируем примерный день зачатия! ☀️
        </template>

        <template #comment>
          Но помните, лучший советчик &mdash; ваш лечащий врач&nbsp;💖
        </template>
      </WidgetPageTitle>

    </ion-content>

    <AppFooter />
  </ion-page>
</template>