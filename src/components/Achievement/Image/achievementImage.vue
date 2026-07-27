<script setup lang="ts">
import styles from './achievementImage.module.scss';
import {TAchievementCombined} from '@/api/getAchievementById';
import {getAchievementImage} from '@/composables/getAchievementImage';
import {computed} from 'vue';

const props = defineProps<{
  achievement: TAchievementCombined,
}>();

const imageUrl = computed(() => {
  if ( !props.achievement.image ) {
    return undefined;
  }

  return getAchievementImage( props.achievement.image );
});
</script>

<template>
  <div :class="styles.achievementImage">
    <div :class="[
       styles.achievementImage__frame,
       styles[ 'achievementImage__frame_' + props.achievement.rarity ]
    ]"></div>

    <img v-if="imageUrl"
         :class="styles.achievementImage__img"
         :src="imageUrl"
         :alt="props.achievement.name"
    />
    <template v-else-if="props.achievement.icon">
      {{ props.achievement.icon }}
    </template>
    <template v-else>
      🧙‍♂️
    </template>
  </div>
</template>