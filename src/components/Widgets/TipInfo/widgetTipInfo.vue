<script setup lang="ts">
import styles from './widgetTipInfo.module.scss';
import {appVars} from '@/configApp';

const props = defineProps<{
  color: string,
}>();
</script>

<template>
  <div :class="styles.widgetTipInfo"
       :style="{
        backgroundColor: `color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix })`,
        borderColor: props.color,
       }"
  >
    <slot />
  </div>
</template>