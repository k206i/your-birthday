<script setup lang="ts">
import styles from './cardPage.module.scss';
import { IonContent, IonPage } from '@ionic/vue';
import { computed, ref } from 'vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import BirthdayCard from '@/components/BirthdayCard/birthdayCard.vue';
import UiInput from '@/components/Ui/Input/uiInput.vue';
import { appVars } from '@/configApp';
import { generateCard, renderCard } from '@/api/generateCard';
import type { TCard } from '@/api/generateCard';
import { getModalBottomArt } from '@/composables/getModalBottomArt';
import { shareElementAsImage } from '@/composables/shareElementAsImage';

// Имя вводят под конкретного человека, между запусками запоминать нечего
const name = ref< string >( '' );
const card = ref< TCard >( generateCard() );
const art = ref< string >( getModalBottomArt() );
const shareRoot = ref< HTMLElement >();

const cardText = computed(() => renderCard( card.value, name.value ));

const onRegenerate = (): void => {
  card.value = generateCard();
  art.value = getModalBottomArt();
};

const onShare = (): void => {
  shareElementAsImage( shareRoot.value, 'birthday-card.png' );
};
</script>

<template>
  <ion-page :class="styles.cardPage"
            :style="{
              '--brd-custom-theme-color': appVars.colors.achievements,
            }"
  >
    <AppHeader page-name="Поздравить <span class='accent-theme'>кого-то</span>" />

    <ion-content :fullscreen="true" class="ion-padding">
      <UiInput
          :class="styles.cardPage__block"
          v-model="name"
          label="Кого поздравляем?"
          placeholder="Имя — или оставьте пустым"
      />

      <div :class="styles.cardPage__block"
           ref="shareRoot"
      >
        <BirthdayCard
            :text="cardText"
            :art="art"
        />
      </div>

      <div :class="styles.cardPage__buttons">
        <div :class="styles.cardPage__button"
             @click="onRegenerate"
        >
          🎲 Ещё вариант
        </div>

        <div :class="styles.cardPage__button"
             @click="onShare"
        >
          📤 Отправить
        </div>
      </div>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
