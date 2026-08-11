<script setup lang="ts">
import styles from './achievementsPage.module.scss';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {IonContent, IonPage} from '@ionic/vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {appVars} from '@/configApp';
import WidgetAddBirthday from '@/components/Widgets/AddBirthday/widgetAddBirthday.vue';
import {appStore} from '@/store/appStore';
import AchievementFull from '@/components/Achievement/Full/achievementFull.vue';
</script>

<template>
  <ion-page :class="styles.achievementsPage"
            :style="{
              '--brd-custom-theme-color': appVars.colors.achievements,
            }"
  >
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <template v-if="!appStore.userBirthDate">
        <WidgetAddBirthday />
      </template>
      <template v-else>
        <div :class="styles.achievementsPage__lastLabel">
          Последнее достижение 🎉
        </div>

        <AchievementFull
            v-if="appStore.lastAchievement"
            :achievement="appStore.lastAchievement"
        />


      </template>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>