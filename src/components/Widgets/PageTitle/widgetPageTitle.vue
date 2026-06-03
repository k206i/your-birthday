<script setup lang="ts">
import styles from './widgetPageTitle.module.scss';
import {appVars} from '@/configApp';

const props = defineProps<{
  title: string,
  lead?: string,
  comment?: string,
  color?: string,
  bgImage?: string,
}>();

</script>

<template>
  <div :class="[
        styles.widgetPageTitle,
        props.bgImage
      ]"
       :style="{
        backgroundColor: `color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix })`,
       }"
  >
    <div :class="styles.widgetPageTitle__wrapper">
      <h2 :class="styles.widgetPageTitle__title"
          :style="`text-shadow: 1px 1px 6px color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix });`"
      >
        {{ props.title }}
      </h2>

      <div v-if="props.lead"
           :class="styles.widgetPageTitle__titleLead"
           :style="`color: ${ props.color };`"
      >
        {{ lead }}
      </div>

      <div v-if="props.comment" :class="styles.widgetPageTitle__titleComment">
        {{ comment }}
      </div>
    </div>
  </div>
</template>