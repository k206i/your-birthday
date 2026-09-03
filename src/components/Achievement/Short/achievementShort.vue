<script setup lang="ts">
import styles from './achievementShort.module.scss';
import {arrowForwardOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
import {appVars} from '@/configApp';
import AchievementImage from '@/components/Achievement/Image/achievementImage.vue';
import AchievementRarityLabel from '@/components/Achievement/RarityLabel/achievementRarityLabel.vue';
import {TAchievementCombined} from '@/api/getAchievementById';
import {computed} from 'vue';

const props = defineProps<{
  achievement: TAchievementCombined,
  isLast?: boolean,
  isAlert?: boolean,
}>();

// Контракт id: [группа]_[номер] — тот же, по которому собраны группы на странице достижений
const groupId = computed(() => props.achievement.id.split( '_' )[ 0 ] );

const rarityColor = computed(() => {
  const rarity = props.achievement?.rarity;

  if ( !rarity ) {
    return '';
  }

  return ( appVars.achievementColors as Record< string, string > )[ rarity ] ?? '';
});

</script>

<template>
  <div :class="styles.achievementShort"
       :style="{
              '--brd-achievement-theme-color': appVars.colors.achievements,
              backgroundColor: `color-mix( in srgb, ${ rarityColor }, black var( --brd-color-mix-bg ))`,
            }"
  >
    <AchievementImage
        :class="styles.achievementShort__icon"
        :achievement="props.achievement"
        is-simple
    />

    <div :class="styles.achievementShort__contentWrapper">
      <div v-if="props.isLast" :class="styles.achievementShort__label">
        Последнее достижение
      </div>
      <div v-if="props.isAlert" :class="styles.achievementShort__label">
        Вы получили достижение
      </div>

      <div :class="styles.achievementShort__title">
        {{ props.achievement.name }}
      </div>

      <div :class="styles.achievementShort__comment">
        <AchievementRarityLabel
            :achievement="props.achievement"
            is-compact
        />
      </div>
    </div>

    <div v-if="props.isLast"
         :class="styles.achievementShort__linkButton"
    >
      <ion-icon :icon="arrowForwardOutline"></ion-icon>
    </div>

    <router-link
        v-if="props.isLast"
        :to="{ path: '/achievementsPage', query: { group: groupId }}"
        :class="styles.achievementShort__link">
    </router-link>
  </div>
</template>