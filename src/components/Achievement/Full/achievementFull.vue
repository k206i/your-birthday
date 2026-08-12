<script setup lang="ts">
import styles from './achievementFull.module.scss';
import AchievementImage from '@/components/Achievement/Image/achievementImage.vue';
import {appVars} from '@/configApp';
import {computed} from 'vue';
import AchievementRarityLabel from '@/components/Achievement/RarityLabel/achievementRarityLabel.vue';
import {TAchievementCombined} from '@/api/getAchievementById';

const props = defineProps<{
  achievement: TAchievementCombined,
}>();

const rarityColor = computed(() => {
  const rarity = props.achievement?.rarity;

  if ( !rarity ) {
    return '';
  }

  return ( appVars.achievementColors as Record< string, string > )[ rarity ] ?? '';
});
</script>

<template>
  <div :class="styles.achievementFull" v-if="props.achievement"
       :style="{
              '--brd-achievement-rarity-color': rarityColor,
            }"
  >
    <div :class="styles.achievementFull__bg"></div>

    <div :class="styles.achievementFull__contentWrapper">
      <AchievementImage
          :class="styles.achievementFull__image"
          :achievement="props.achievement"
          is-animate
      />

      <div :class="styles.achievementFull__title">
        {{ props.achievement?.name }}
      </div>

      <div :class="styles.achievementFull__comment">
        {{ props.achievement.comment }}
      </div>

      <div v-if="props.achievement.ageText"
           :class="styles.achievementFull__ageText"
      >
        {{ props.achievement.ageText }}
      </div>

      <AchievementRarityLabel
          :class="styles.achievementFull__block"
          :achievement="props.achievement"
      />

      <div v-if="props.achievement.person && props.achievement.wiki"
           :class="styles.achievementFull__subComment"
      >
        {{ props.achievement.person }} на <a :href="props.achievement.wiki">Википедии</a>
      </div>
    </div>
  </div>
</template>