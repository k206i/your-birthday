<script setup lang="ts">
import styles from './uiProgressBar.module.scss';
import { computed } from 'vue';

const props = defineProps<{
  total: number,
  value: number | null,
}>();

const percent = computed(() => {
  if ( !props.total || props.total <= 0 || props.value === null ) {
    return 0;
  }

  const ratio: number = props.value / props.total * 100;

  return Math.min( 100, Math.max( 0, ratio ));
});
</script>

<template>
  <div :class="styles.uiProgressBar">
    <div :class="styles.uiProgressBar__fill"
         :style="{ width: percent + '%' }"
    ></div>
  </div>
</template>
