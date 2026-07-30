<script setup lang="ts">
import styles from './achievementRarityLabel.module.scss';
import {TAchievementCombined} from '@/api/getAchievementById';
import {computed} from 'vue';
import {appVars} from '@/configApp';

const props = defineProps<{
  achievement: TAchievementCombined,
  isCompact?: boolean
}>();

const rarityLabel = computed(() => {
  const rarity = props.achievement.rarity;

  if ( !rarity ) {
    return '';
  }

  return ( appVars.achievementTranslates as Record< string, string > )[ rarity ] ?? '';
});

const rarityColor = computed(() => {
  const rarity = props.achievement.rarity;

  if ( !rarity ) {
    return '';
  }

  return ( appVars.achievementColors as Record< string, string > )[ rarity ] ?? '';
});
</script>

<template>
  <div :class="[
          styles.achievementRarityLabel,
          props.isCompact && styles.achievementRarityLabel_compact
        ]"
       :style="{
          color: rarityColor,
          backgroundColor: `color-mix( in srgb, ${ rarityColor }, black var( --brd-color-mix-bg ))`
       }"
  >
    {{ rarityLabel }}
  </div>
</template>