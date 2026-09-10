<script setup lang="ts">
import styles from './giftCardPage.module.scss';
import {IonContent, IonIcon, IonPage} from '@ionic/vue';
import { computed, ref } from 'vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import GiftCard from '@/components/GiftCard/giftCard.vue';
import UiInput from '@/components/Ui/Input/uiInput.vue';
import { appVars } from '@/configApp';
import { generateGiftCard, renderGiftCard } from '@/api/generateGiftCard';
import type { TGiftCard } from '@/api/generateGiftCard';
import { getModalBottomArt } from '@/composables/getModalBottomArt';
import { shareElementAsImage } from '@/composables/shareElementAsImage';
import {refreshOutline, copyOutline, shareOutline} from 'ionicons/icons';


const name = ref< string >( '' );
const giftCard = ref< TGiftCard >( generateGiftCard() );
const art = ref< string >( getModalBottomArt() );
const shareRoot = ref< HTMLElement >();

const content = computed(() => renderGiftCard( giftCard.value, name.value ));

const onRegenerate = (): void => {
  giftCard.value = generateGiftCard();
  art.value = getModalBottomArt();
};

const onCopy = (): void => {
  navigator.clipboard.writeText( `${ content.value.header }\n${ content.value.text }` );
};

const onShare = (): void => {
  shareElementAsImage( shareRoot.value, 'gift-card.png' );
};
</script>

<template>
  <ion-page :class="styles.giftCardPage"
            :style="{
              '--brd-custom-theme-color': appVars.colors.giftCard,
            }"
  >
    <AppHeader page-name="Ваша <span class='accent-theme'>открытка</span>" />

    <ion-content :fullscreen="true" class="ion-padding">
      <UiInput
          :class="styles.giftCardPage__block"
          v-model="name"
          label="Кого поздравляем?"
          placeholder="Имя — или оставьте пустым"
      />

      <div :class="styles.giftCardPage__block"
           ref="shareRoot"
      >
        <GiftCard
            :header="content.header"
            :text="content.text"
            :art="art"
        />
      </div>

      <div :class="styles.giftCardPage__actions">
        <div :class="styles.giftCardPage__action"
             @click="onRegenerate"
        >
          <ion-icon :icon="refreshOutline"
                    :class="styles.giftCardPage__actionIcon"
          ></ion-icon>

          <span>Ещё вариант</span>
        </div>

        <div :class="styles.giftCardPage__actionsDivider"></div>

        <div :class="styles.giftCardPage__action"
             @click="onCopy"
        >
          <ion-icon :icon="copyOutline"
                    :class="styles.giftCardPage__actionIcon"
          ></ion-icon>

          <span>Скопировать текст</span>
        </div>
      </div>

      <div :class="styles.giftCardPage__button"
           @click="onShare"
      >
        <ion-icon :icon="shareOutline" :class="styles.giftCardPage__buttonIcon" ></ion-icon>

        <span>Отправить</span>
      </div>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
