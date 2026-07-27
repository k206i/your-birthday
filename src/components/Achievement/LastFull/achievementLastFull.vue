<script setup lang="ts">
import styles from './achievementLastFull.module.scss';
import {appStore} from '@/store/appStore';
import AchievementImage from '@/components/Achievement/Image/achievementImage.vue';
</script>

<template>
  <div :class="styles.achievementLastFull" v-if="appStore.lastAchievement">
    <div :class="styles.achievementLastFull__bg"></div>

    <div>
      Последнее достижение 🎉
    </div>

    <AchievementImage
        :class="styles.achievementLastFull__image"
        :achievement="appStore.lastAchievement"
    />

    -{{ appStore.lastAchievement?.image }}-<br />

    {{ appStore.lastAchievement?.name }}

    {{ appStore.lastAchievement.comment }}

    {{ appStore.lastAchievement?.rarity }}
  </div>
</template>