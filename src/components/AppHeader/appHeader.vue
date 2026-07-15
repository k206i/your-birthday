<script setup lang="ts">
import {IonHeader, IonToolbar, IonButtons, IonBackButton } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import { useRoute } from 'vue-router';
import styles from './appHeader.module.scss';
import UserAvatar from '@/components/UserAvatar/userAvatar.vue';

const route = useRoute();
</script>

<template>
  <ion-header :class="styles.appHeader" :translucent="true">
    <ion-toolbar>
      <ion-buttons slot="start" class="ion-padding">
        <ion-back-button :style="{
          visibility: route.path === '/home' ? 'hidden' : 'visible',
        }" text="" defaultHref="/" :icon="arrowBack" ></ion-back-button>
      </ion-buttons>

      <div :class="styles.appHeader__title">
        <div>
          <slot>
            День <span class="accent">рождения</span>
          </slot>
        </div>
      </div>
      <ion-buttons :collapse="true" slot="end">
        <UserAvatar />
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>