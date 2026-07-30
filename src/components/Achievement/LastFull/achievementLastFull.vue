<script setup lang="ts">
import styles from './achievementLastFull.module.scss';
import {appStore} from '@/store/appStore';
import AchievementImage from '@/components/Achievement/Image/achievementImage.vue';
import {appVars} from '@/configApp';
import {computed} from 'vue';
import AchievementRarityLabel from '@/components/Achievement/RarityLabel/achievementRarityLabel.vue';

const rarityLabel = computed(() => {
  const rarity = appStore.lastAchievement?.rarity;

  if ( !rarity ) {
    return '';
  }

  return ( appVars.achievementTranslates as Record< string, string > )[ rarity ] ?? '';
});

const rarityColor = computed(() => {
  const rarity = appStore.lastAchievement?.rarity;

  if ( !rarity ) {
    return '';
  }

  return ( appVars.achievementColors as Record< string, string > )[ rarity ] ?? '';
});
</script>

<template>
  <div :class="styles.achievementLastFull" v-if="appStore.lastAchievement"
       :style="{
              '--brd-achievement-rarity-color': rarityColor,
            }"
  >
    <div :class="styles.achievementLastFull__bg"></div>

    <div :class="styles.achievementLastFull__label">
      Последнее достижение 🎉
    </div>

    <AchievementImage
        :class="styles.achievementLastFull__image"
        :achievement="appStore.lastAchievement"
        is-animate
    />

    <div :class="styles.achievementLastFull__title">
      {{ appStore.lastAchievement?.name }}
    </div>

    <div :class="styles.achievementLastFull__comment">
      {{ appStore.lastAchievement.comment }}
    </div>

    <AchievementRarityLabel :achievement="appStore.lastAchievement" />

    <div v-if="appStore.lastAchievement.person && appStore.lastAchievement.wiki"
         :class="styles.achievementLastFull__subComment"
    >
      {{ appStore.lastAchievement.person }} на <a :href="appStore.lastAchievement.wiki">Википедии</a>
    </div>
  </div>
</template>