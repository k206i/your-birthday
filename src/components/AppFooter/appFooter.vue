<script setup lang="ts">
import styles from './appFooter.module.scss';
import {IonFooter, IonTitle, IonToolbar} from '@ionic/vue';
</script>

<template>
  <ion-footer :class="styles.appFooter" class="translucent-bar">
    <ion-toolbar>
      💜
      <router-link to="/donationsPage" :class="styles.appFooter__link">
        Приложение держится на этих людях — и на вас
      </router-link>
    </ion-toolbar>
  </ion-footer>
</template>