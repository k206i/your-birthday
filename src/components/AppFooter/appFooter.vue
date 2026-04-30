<script setup lang="ts">
import styles from './appFooter.module.scss';
import {IonFooter, IonTitle, IonToolbar} from '@ionic/vue';
</script>

<template>
  <ion-footer :class="styles.appFooter" :translucent="true">
    <ion-toolbar>
      <ion-title>Footer</ion-title>
    </ion-toolbar>
  </ion-footer>
</template>