<script setup lang="ts">
import styles from './appFooter.module.scss';
import {IonFooter, IonToolbar} from '@ionic/vue';
</script>

<template>
  <ion-footer :class="styles.appFooter" class="translucent-bar">
    <ion-toolbar>
      💜
      <router-link to="/donationsPage" :class="styles.appFooter__link">
        Спасибо всем, кто поддерживает приложение
      </router-link>
    </ion-toolbar>
  </ion-footer>
</template>