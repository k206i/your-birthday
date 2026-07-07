<script setup lang="ts">
import styles from './widgetArtButton.module.scss';
import {IonIcon} from '@ionic/vue';
import { arrowForwardOutline } from 'ionicons/icons';
import penguinArt from '@/assets/img/animals/penguin.webp';

const props = defineProps<{
  title?: string,
  comment?: string,
  color: string,
  artSrc?: string,
  link?: string,
}>();
</script>

<template>
  <div :class="styles.widgetArtButton"
       :style="{
          backgroundColor: `color-mix( in srgb, ${ props.color }, black var( --brd-color-mix-bg ))`,
       }"
  >
    <div :class="styles.widgetArtButton__art">
      <img :src="props.artSrc || penguinArt" alt="" />
    </div>

    <div :class="styles.widgetArtButton__content">
      <div v-if="props.title"
           v-html="props.title"
           :class="styles.widgetArtButton__title">
      </div>

      <div v-if="props.comment"
           :class="styles.widgetArtButton__comment"
           :style="{
              color: props.color,
            }"
      >
        {{props.comment}}
      </div>
    </div>

    <div :class="styles.widgetArtButton__arrow"
         :style="{
            backgroundColor: props.color
         }"
    >
      <ion-icon :icon="arrowForwardOutline"></ion-icon>
    </div>

    <router-link v-if="props.link"
                 :to="props.link"
                 :class="styles.widgetArtButton__link">
    </router-link>
  </div>
</template>