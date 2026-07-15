<script setup lang="ts">
import styles from './userAvatar.module.scss';
import {personOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
</script>

<template>
  <div :class="styles.userAvatar">
    <ion-icon :icon="personOutline"></ion-icon>

    <router-link to="/userProfile" :class="styles.userAvatar__link"></router-link>
  </div>
</template>