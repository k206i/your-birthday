<script setup lang="ts">
import styles from './achievementFull.module.scss';
import AchievementImage from '@/components/Achievement/Image/achievementImage.vue';
import {appVars} from '@/configApp';
import {shareElementAsImage} from '@/composables/shareElementAsImage';
import {computed, ref} from 'vue';
import AchievementRarityLabel from '@/components/Achievement/RarityLabel/achievementRarityLabel.vue';
import {TAchievementCombined} from '@/api/getAchievementById';
import {isAchievementReceived} from '@/api/getAchievementDate';
import {lockClosedOutline, shareSocial} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
import {Browser} from '@capacitor/browser';

const props = defineProps<{
  achievement: TAchievementCombined,
}>();

const rarityColor = computed(() => {
  const rarity = props.achievement?.rarity;

  if ( !rarity ) {
    return '';
  }

  return ( appVars.achievementColors as Record< string, string > )[ rarity ] ?? '';
});

const openLink = async ( url: string ): Promise< void > => {
  await Browser.open({ url });
};

const shareRoot = ref< HTMLElement >();

// Селекторы берём из styles: CSS Modules хеширует имена, руками их не собрать
const onShare = () => {
  shareElementAsImage(
    shareRoot.value,
    `achievement-${ props.achievement.id }.png`,
    [ `.${ styles.achievementFull__share }`, `.${ styles.achievementFull__subComment }` ]
  );
};
</script>

<template>
  <div :class="styles.achievementFull" v-if="props.achievement"
       ref="shareRoot"
       :style="{
              '--brd-achievement-rarity-color': rarityColor,
            }"
  >
    <div :class="styles.achievementFull__bg"></div>

    <div :class="styles.achievementFull__contentWrapper">
      <AchievementImage
          :class="styles.achievementFull__image"
          :achievement="props.achievement"
          is-animate
      />

      <div v-if="!isAchievementReceived( props.achievement )"
           :class="styles.achievementFull__notReceived"
      >
        <ion-icon :icon="lockClosedOutline"></ion-icon>
        Не получена
      </div>

      <div :class="styles.achievementFull__title">
        {{ props.achievement?.name }}
      </div>

      <div :class="styles.achievementFull__comment">
        {{ props.achievement.comment }}
      </div>

      <div v-if="props.achievement.ageText"
           :class="styles.achievementFull__ageText"
      >
        {{ props.achievement.ageText }}
      </div>

      <div :class="styles.achievementFull__shareWrapper">
        <AchievementRarityLabel
            :class="styles.achievementFull__rarityLabel"
            :achievement="props.achievement"
        />

        <div :class="styles.achievementFull__share"
             @click="onShare"
        >
          <ion-icon :icon="shareSocial"></ion-icon>
        </div>
      </div>

      <div v-if="props.achievement.person && props.achievement.wiki"
           :class="styles.achievementFull__subComment"
      >
        {{ props.achievement.person }} на <a :href="props.achievement.wiki" @click.prevent="openLink( props.achievement.wiki )">Википедии</a>
      </div>
    </div>
  </div>
</template>