<script setup lang="ts">
import styles from './achievementLast.module.scss';
import {arrowForwardOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
import {appVars} from '@/configApp';
import {appStore} from '@/store/appStore';
import {computed} from 'vue';
import AchievementImage from '@/components/Achievement/Image/achievementImage.vue';

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
  <div :class="styles.achievementLast"
       v-if="appStore.lastAchievement"
       :style="{
              '--brd-achievement-theme-color': appVars.colors.achievements,
            }"
  >
    <AchievementImage
        :class="styles.achievementLast__icon"
        :achievement="appStore.lastAchievement"
    />

    <div :class="styles.achievementLast__contentWrapper">
      <div :class="styles.achievementLast__label">
        Последнее достижение
      </div>

      <div :class="styles.achievementLast__title">
        {{ appStore.lastAchievement?.name }}
      </div>

      <div :class="styles.achievementLast__comment">
        <span :class="styles.achievementLast__rarity"
              :style="{ color: rarityColor }"
        >
          {{ rarityLabel }}
        </span>
      </div>
    </div>

    <div :class="styles.achievementLast__linkButton">
      <ion-icon :icon="arrowForwardOutline"></ion-icon>
    </div>

    <router-link to="/achievementsPage"
                 :class="styles.achievementLast__link">
    </router-link>
  </div>
</template>