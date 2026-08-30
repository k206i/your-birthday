<script setup lang="ts">
import styles from './appVersion.module.scss';
import {appStore} from '@/store/appStore';
import {closeCircleOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
import {appVars} from '@/configApp';
import {ref} from 'vue';
import {grantSpecialAchievement} from '@/api/grantSpecialAchievement';
import {TAchievementCombined} from '@/api/getAchievementById';
import FloatingAlert from '@/components/Ui/FloatingAlert/floatingAlert.vue';
import AchievementShort from '@/components/Achievement/Short/achievementShort.vue';
import {setLastAchievement} from '@/api/setLastAchievement';

const appVersion: string = __APP_VERSION__;

// Считаем тапы вручную: на тач-устройствах нативного тройного клика нет
const isKeysShown = ref( false );

let tapCount: number = 0;
let lastTapTime: number = 0;

const alertAchievement = ref< TAchievementCombined | null >( null );
const isAlertOpen = ref( false );

const onVersionTap = () => {
  const tapTime: number = performance.now();

  tapCount = tapTime - lastTapTime < appVars.multiTapDelay ? tapCount + 1 : 1;
  lastTapTime = tapTime;

  if ( tapCount === 3 ) {
    isKeysShown.value = !isKeysShown.value;
    tapCount = 0;

    const granted: TAchievementCombined | null = grantSpecialAchievement( 'special_dev' );

    if ( granted ) {
      alertAchievement.value = granted;
      isAlertOpen.value = true;
    }
  }
};

// lastAchievement — сохранённый снимок, без пересчёта стёртая особая ачивка осталась бы в нём
const onClearSpecialAchievements = () => {
  appStore.specialAchievements = {};
  setLastAchievement();
};

const onClearResetedStreaks = () => {
  appStore.resetedStreaks = [];
};

const onClearDismissedAlerts = () => {
  appStore.dismissedAlerts = [];
};

const onClearBirthdayGreeted = () => {
  appStore.lastBirthdayGreetedDate = '';
};
</script>

<template>
  <div :class="styles.appVersion">
    <div :class="styles.appVersion__version" @click="onVersionTap">
      v{{ appVersion }}
    </div>

    <ul v-if="isKeysShown" :class="styles.appVersion__keysList">
      <li :class="styles.appVersion__key">
        specialAchievements
        {{ appStore.specialAchievements }}
        <ion-icon
            :icon="closeCircleOutline"
            @click="onClearSpecialAchievements"
            :class="styles.appVersion__resetIcon"
        ></ion-icon>
      </li>

      <li :class="styles.appVersion__key">
        resetedStreaks
        {{ appStore.resetedStreaks }}
        <ion-icon
            :icon="closeCircleOutline"
            @click="onClearResetedStreaks"
            :class="styles.appVersion__resetIcon"
        ></ion-icon>
      </li>

      <li :class="styles.appVersion__key">
        dismissedAlerts
        {{ appStore.dismissedAlerts }}
        <ion-icon
            :icon="closeCircleOutline"
            @click="onClearDismissedAlerts"
            :class="styles.appVersion__resetIcon"
        ></ion-icon>
      </li>

      <li :class="styles.appVersion__key">
        lastBirthdayGreetedDate
        {{ appStore.lastBirthdayGreetedDate }}
        <ion-icon
            :icon="closeCircleOutline"
            @click="onClearBirthdayGreeted"
            :class="styles.appVersion__resetIcon"
        ></ion-icon>
      </li>
    </ul>

    <FloatingAlert v-model:is-open="isAlertOpen">
      <AchievementShort v-if="alertAchievement" :achievement="alertAchievement" is-last />
    </FloatingAlert>
  </div>
</template>