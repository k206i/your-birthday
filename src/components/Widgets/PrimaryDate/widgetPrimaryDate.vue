<script setup lang="ts">
import styles from './widgetPrimaryDate.module.scss';
import {appVars} from '@/configApp';

const props = defineProps<{
  title: string
  date: string,
  comment?: string,
  color: string,
}>();
</script>
<template>
  <div :class="styles.widgetPrimaryDate"
       :style="{
        backgroundColor: `color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix })`,
       }"
  >
    <div :class="styles.widgetPrimaryDate__contentWrapper">
      <div :class="styles.widgetPrimaryDate__title">
        {{ title }}
      </div>

      <div :class="styles.widgetPrimaryDate__date"
           :style="{
              color: props.color,
            }"
      >
        {{ date }}
      </div>

      <div v-if="comment" :class="styles.widgetPrimaryDate__comment">
        {{ comment }}
      </div>
    </div>

    <div :class="styles.widgetPrimaryDate__art"></div>
  </div>
</template>