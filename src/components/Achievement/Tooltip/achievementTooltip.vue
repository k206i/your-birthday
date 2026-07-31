<script setup lang="ts">
import styles from './achievementTooltip.module.scss';
import {TAchievementCombined} from '@/api/getAchievementById';
import AchievementImage from '@/components/Achievement/Image/achievementImage.vue';

const props = defineProps<{
  achievement: TAchievementCombined,
}>();
</script>

<template>
  <div :class="styles.achievementTooltip">
    <div v-if="props.achievement.icon"
         :class="styles.achievementTooltip__icon"
    >
      <AchievementImage :achievement="props.achievement" is-simple />
    </div>

    <div>
      <div v-if="achievement.ageText"
           :class="styles.achievementTooltip__ageText">
        {{ achievement.ageText }}
      </div>

      <div :class="styles.achievementTooltip__title">
        {{ props.achievement.name }}
      </div>

      <div v-if="props.achievement.comment"
           :class="styles.achievementTooltip__comment"
      >
        {{ props.achievement.comment }}
      </div>
    </div>
  </div>
</template>