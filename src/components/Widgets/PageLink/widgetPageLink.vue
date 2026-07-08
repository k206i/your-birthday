<script setup lang="ts">
import styles from './widgetPageLink.module.scss';
import { IonIcon } from '@ionic/vue';
import { arrowForwardOutline } from 'ionicons/icons';

const props = defineProps<{
  title?: string,
  comment?: string,
  color: string,
  bgImage: string,
  link: string,
}>();

</script>

<template>
  <div
      :class="styles.widgetPageLink"
      :style="{
        backgroundColor: `color-mix( in srgb, ${ props.color }, black var( --brd-color-mix-bg ))`,
       }"
  >
    <div :class="styles.widgetPageLink__content">
      <div v-if="props.title"
           :class="styles.widgetPageLink__title"
      >
        {{ props.title }}
      </div>

      <div v-if="props.comment"
           :class="styles.widgetPageLink__comment"
           :style="`color: ${ props.color };`"
      >
        {{ props.comment }}
      </div>
    </div>

    <div :class="styles.widgetPageLink__arrow"
         :style="`background-color: ${ props.color };`"
    >
      <ion-icon :icon="arrowForwardOutline"></ion-icon>
    </div>

    <div :class="[
          styles.widgetPageLink__art,
          props.bgImage
        ]"
    >
      <div :class="styles.widgetPageLink__gradient"
           :style="`background: linear-gradient( to bottom, transparent 0%, color-mix( in srgb, ${ props.color }, black var( --brd-color-mix-bg )) 100%);`"
      ></div>
    </div>

    <router-link :to="props.link" :class="styles.widgetPageLink__link"></router-link>
  </div>
</template>