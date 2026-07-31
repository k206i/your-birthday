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
    <template v-if="!props.isSimple">
      <div :class="[
             styles.achievementImage__frame,
             styles[ 'achievementImage__frame_' + props.achievement.rarity ]
          ]"
      ></div>

      <template v-if="
        achievement.rarity === 'epic'
        || achievement.rarity === 'legendary'
        || achievement.rarity === 'mythic'
      ">
        <!-- орбита 1: по часовой, 9s -->
        <div :class="styles.achievementImage__orbit_1">
          <div :class="styles.achievementImage__orbit_1__inner_1"></div>
          <div :class="styles.achievementImage__orbit_1__inner_2"></div>
          <div :class="styles.achievementImage__orbit_1__inner_3"></div>
        </div>

        <!-- орбита 2: против часовой, 14s, ближе к медали -->
        <div :class="styles.achievementImage__orbit_2">
          <div :class="styles.achievementImage__orbit_2__inner_1"></div>
          <div :class="styles.achievementImage__orbit_2__inner_2"></div>
        </div>
      </template>

      <div v-if="
        achievement.rarity === 'rare'
        || achievement.rarity === 'epic'
        "
          :class="styles.achievementImage__outerGlow1"
      >
        <div :class="styles.achievementImage__outerGlow1__inner_1"></div>
      </div>

      <div v-if="achievement.rarity === 'legendary'"
           :class="styles.achievementImage__outerGlow2"
      >
        <!-- 1. дыхание -->
        <div :class="styles.achievementImage__outerGlow2__inner_1"></div>

        <!-- 2. клубы, по часовой 11s -->
        <div :class="styles.achievementImage__outerGlow2__inner_2"></div>

        <!-- 3. контр-слой, против часовой 17s -->
        <div :class="styles.achievementImage__outerGlow2__inner_3"></div>
      </div>

      <div v-if="achievement.rarity === 'mythic'"
           :class="styles.achievementImage__outerGlow3"
      >

        <!-- 1. дыхание -->
        <div :class="styles.achievementImage__outerGlow3__inner_1"></div>

        <!-- 2. клубы на 4 оттенка, по часовой 13s -->
        <div :class="styles.achievementImage__outerGlow3__inner_2"></div>

        <!-- 3. контр-слой, против часовой 19s -->
        <div :class="styles.achievementImage__outerGlow3__inner_3"></div>
      </div>
    </template>

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