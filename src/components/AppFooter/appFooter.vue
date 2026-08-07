<script setup lang="ts">
import styles from './appFooter.module.scss';
import {IonFooter, IonTitle, IonToolbar} from '@ionic/vue';
</script>

<template>
  <ion-footer :class="styles.appFooter" :translucent="true">
    <ion-toolbar>
      <a href="https://pay.cloudtips.ru/p/460b7ab7" target="_blank">Чаевые</a>
    </ion-toolbar>
  </ion-footer>
</template>