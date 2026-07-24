<script setup lang="ts">
import styles from './achievementImage.module.scss';
const props = defineProps<{
  id: string,
}>();
</script>

<template>
  <div :class="styles.achievementImage">
    🎀
  </div>
</template>