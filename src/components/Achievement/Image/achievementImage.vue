<script setup lang="ts">
import styles from './achievementImage.module.scss';
import {TAchievementCombined} from '@/api/getAchievementById';
import {getAchievementImage} from '@/composables/getAchievementImage';
import {computed} from 'vue';
import {appVars} from '@/configApp';

const props = defineProps<{
  achievement: TAchievementCombined,
  isAnimate?: boolean,
  isSimple?: boolean
}>();

const imageUrl = computed(() => {
  if ( !props.achievement.image ) {
    return undefined;
  }

  return getAchievementImage( props.achievement.image );
});

const rarityColor = computed(() => {
  const rarity = props.achievement?.rarity;

  if ( !rarity ) {
    return '';
  }

  return ( appVars.achievementColors as Record< string, string > )[ rarity ] ?? '';
});
</script>

<template>
  <div :class="styles.achievementImage">
    <div v-if="!props.isSimple"
         :class="[
           styles.achievementImage__frame,
           styles[ 'achievementImage__frame_' + props.achievement.rarity ]
        ]"
    ></div>

    <div :class="
            props.isSimple
              ? styles.achievementImage__frameBorder
              : styles.achievementImage__framePadding
          "
         :style="{
          borderColor: rarityColor,
         }"
    >
      <div :class="styles.achievementImage__wrapper">
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

        <div v-if="props.isAnimate" :class="styles.achievementImage__innerShine"></div>
      </div>
    </div>
  </div>
</template>