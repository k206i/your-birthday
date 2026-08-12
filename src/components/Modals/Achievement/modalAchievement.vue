<script setup lang="ts">
import styles from './modalAchievement.module.scss';
import {TAchievementCombined} from '@/api/getAchievementById';
import AchievementFull from '@/components/Achievement/Full/achievementFull.vue';
import {closeCircleOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';

// achievement необязателен: модалка смонтирована с самого начала и до первого открытия ачивки ещё нет — иначе Ionic не проигрывает анимацию первого показа
const props = defineProps<{
  isOpen: boolean,
  achievement?: TAchievementCombined | null,
}>();

const emit = defineEmits([ 'update:isOpen' ]);

const close = () => {
  emit( 'update:isOpen', false );
};
</script>

<template>
  <Transition name="brd-fade-scale">
    <div v-if="props.isOpen"
         :class="styles.modalAchievement"
    >
      <div :class="styles.modalAchievement__overlay"
           @click="close"
      ></div>

      <div :class="styles.modalAchievement__content">
        <ion-icon
            :class="styles.modalAchievement__close"
            :icon="closeCircleOutline"
            size="large"
            @click="close"
        ></ion-icon>

        <AchievementFull v-if="props.achievement" :achievement="props.achievement" />
      </div>
    </div>
  </Transition>
</template>