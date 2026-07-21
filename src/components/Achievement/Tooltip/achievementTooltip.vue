<script setup lang="ts">
import styles from './achievementTooltip.module.scss';

const props = defineProps<{
  title: string,
  comment?: string,
  icon?: string,
}>();
</script>

<template>
  <div :class="styles.achievementTooltip">
    <div v-if="props.icon"
         :class="styles.achievementTooltip__icon"
    >
      {{ props.icon }}
    </div>

    <div>
      <div :class="styles.achievementTooltip__title">
        {{ props.title }}
      </div>

      <div v-if="props.comment"
           :class="styles.achievementTooltip__comment"
      >
        {{ props.comment }}
      </div>
    </div>
  </div>
</template>