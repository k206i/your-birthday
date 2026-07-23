<script setup lang="ts">
import styles from './achievementLast.module.scss';
import {arrowForwardOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
import {appVars} from '@/configApp';
</script>

<template>
  <div :class="styles.achievementLast">
    <div :class="styles.achievementLast__icon">
      🧤
    </div>

    <div :class="styles.achievementLast__contentWrapper">
      <div :class="styles.achievementLast__label">
        Последнее достижение
      </div>

      <div :class="styles.achievementLast__title">
        Обуздал жизнь
      </div>

      <div :class="styles.achievementLast__comment">
        <span :class="styles.achievementLast__rarity">
          {{ appVars.achievementTranslates.mythic }}
        </span>
      </div>
    </div>

    <div :class="styles.achievementLast__linkButton">
      <ion-icon :icon="arrowForwardOutline"></ion-icon>
    </div>
  </div>
</template>