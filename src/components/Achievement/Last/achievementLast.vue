<script setup lang="ts">
import styles from './achievementLast.module.scss';
import {arrowForwardOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
import {appVars} from '@/configApp';
import {appStore} from '@/store/appStore';
import AchievementImage from '@/components/Achievement/Image/achievementImage.vue';
import AchievementRarityLabel from '@/components/Achievement/RarityLabel/achievementRarityLabel.vue';

</script>

<template>
  <div :class="styles.achievementLast"
       v-if="appStore.lastAchievement"
       :style="{
              '--brd-last-achievement-theme-color': appVars.colors.achievements,
            }"
  >
    <AchievementImage
        :class="styles.achievementLast__icon"
        :achievement="appStore.lastAchievement"
        is-simple
    />

    <div :class="styles.achievementLast__contentWrapper">
      <div :class="styles.achievementLast__label">
        Последнее достижение
      </div>

      <div :class="styles.achievementLast__title">
        {{ appStore.lastAchievement?.name }}
      </div>

      <div :class="styles.achievementLast__comment">
        <AchievementRarityLabel
            v-if="appStore.lastAchievement"
            :achievement="appStore.lastAchievement"
            is-compact
        />
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