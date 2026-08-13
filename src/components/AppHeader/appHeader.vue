<script setup lang="ts">
import {IonHeader, IonToolbar, IonButtons, IonBackButton } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { useRoute } from 'vue-router';
import styles from './appHeader.module.scss';
import AvatarShort from '@/components/Avatar/Short/avatarShort.vue';
import {getTitleImage} from '@/composables/getTitleImage';

const route = useRoute();
const props = defineProps<{
  pageName?: string,
}>();

const titleImage: string = getTitleImage();
</script>

<template>
  <ion-header :class="styles.appHeader" class="translucent-bar">
    <ion-toolbar>
      <ion-buttons slot="start" :class="styles.appHeader__leftPlaceholder">
        <ion-back-button
            v-if="route.path !== '/home'"
            text="" defaultHref="/" :icon="arrowBack"
        ></ion-back-button>
        <img v-else src="@/assets/img/webp/icon-logo.webp" alt="" />
      </ion-buttons>

      <div :class="styles.appHeader__title">
          <div v-if="props.pageName"
               v-html="props.pageName"
          />
          <img v-else
               :class="styles.appHeader__titleImg"
               :src="titleImage"
               alt="День рождения"
          />
      </div>
      <ion-buttons :collapse="true" slot="end">
        <AvatarShort :class="styles.appHeader__avatar" />
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>