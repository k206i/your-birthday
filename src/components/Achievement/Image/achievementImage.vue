<script setup lang="ts">
import styles from './achievementImage.module.scss';
import {TAchievementCombined} from '@/api/getAchievementById';

const props = defineProps<{
  achievement: TAchievementCombined,
}>();
</script>

<template>
  <div :class="styles.achievementImage">
    <template v-if="props.achievement.image">
      {{ props.achievement.image }}
    </template>
    <template v-else-if="props.achievement.icon">
      {{ props.achievement.icon }}
    </template>
    <template v-else>
      🧙‍♂️
    </template>
  </div>
</template>