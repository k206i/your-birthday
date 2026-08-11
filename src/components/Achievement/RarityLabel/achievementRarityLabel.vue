<script setup lang="ts">
import styles from './achievementRarityLabel.module.scss';
import {TAchievementCombined} from '@/api/getAchievementById';
import {computed} from 'vue';
import {appVars} from '@/configApp';
import {getAchievementImage} from '@/composables/getAchievementImage';

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

const rarityIcon = computed(() => {
  const rarity = props.achievement.rarity;

  if ( !rarity ) {
    return undefined;
  }

  return getAchievementImage( `icon-${ rarity }.webp` );
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
    <img v-if="rarityIcon"
         :class="styles.achievementRarityLabel__icon"
         :src="rarityIcon"
         :alt="rarityLabel"
    />

    {{ rarityLabel }}
  </div>
</template>