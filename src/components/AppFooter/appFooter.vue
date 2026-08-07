<script setup lang="ts">
import styles from './appFooter.module.scss';
import {IonFooter, IonTitle, IonToolbar} from '@ionic/vue';
</script>

<template>
  <ion-footer :class="styles.appFooter" :translucent="true">
    <ion-toolbar>
      💜
      <a :class="styles.appFooter__link"
         href="https://pay.cloudtips.ru/p/460b7ab7"
         target="_blank"
      >
        Приложение держится на этих людях — и на вас
      </a>
    </ion-toolbar>
  </ion-footer>
</template>