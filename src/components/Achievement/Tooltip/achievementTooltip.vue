<script setup lang="ts">
import styles from './achievementTooltip.module.scss';

const props = defineProps<{
  title: string,
  lead?: string,
  comment?: string,
  icon?: string,
}>();
</script>

<template>
  <div :class="styles.achievementTooltip">

    {{ props.title }}

    <div v-if="props.lead">
      {{ props.lead }}
    </div>

    <div v-if="props.comment">
      {{ props.comment }}
    </div>

    <div v-if="props.icon">
      {{ props.icon }}
    </div>
  </div>
</template>