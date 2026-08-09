<script setup lang="ts">
import styles from './avatarShort.module.scss';
import {personOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
</script>

<template>
  <div :class="styles.avatarShort">
    <ion-icon :icon="personOutline"></ion-icon>

    <div :class="styles.avatarShort__artClip">
      <img :class="styles.avatarShort__art" src="@/assets/img/animals/panda_art.webp" alt="" />
    </div>

    <img :class="[ styles.avatarShort__art, styles.avatarShort__art_top ]"
         src="@/assets/img/animals/panda_art.webp"
         alt=""
    />

    <router-link to="/userProfile" :class="styles.avatarShort__link"></router-link>
  </div>
</template>