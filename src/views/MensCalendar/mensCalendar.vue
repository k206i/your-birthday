<script setup lang="ts">
import styles from './mensCalendar.module.scss';
import stylesArtButton from '@/assets/styles/artButton.module.scss';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {IonContent, IonPage, IonIcon} from '@ionic/vue';
import { chevronForwardCircleOutline } from 'ionicons/icons';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';

const SUB_THEME_COLOR = "#548fd6";
</script>

<template>
  <ion-page :class="styles.mensCalendar"
            :style="{
              '--brd-custom-theme-color': SUB_THEME_COLOR,
            }"
  >
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <WidgetPageTitle
          :class="styles.mensCalendar__titleBlock"
          bg-image="cat-4"
          title="Вы тоже можете планировать!"
          lead="Давайте рассчитаем оптимальный день, когда ваши сперматозоиды будут полны сил! 😎"
          comment="Но помните, лучший советчик &mdash; ваш лечащий врач&nbsp; 🤙"
      />

      <div :class="stylesArtButton.artButton">
        <div :class="stylesArtButton.artButton__art">
          <img src="@/assets/img/png/icon-bottle.png" alt="" />
        </div>

        <div :class="stylesArtButton.artButton__content">
          <div :class="stylesArtButton.artButton__title">
            Когда последний раз употреб&shy;ляли алкоголь?
          </div>

          <div :class="stylesArtButton.artButton__comment">
            Честность = точность расчётов
          </div>
        </div>

        <div :class="stylesArtButton.artButton__art">
          <ion-icon :icon="chevronForwardCircleOutline" size="large"></ion-icon>
        </div>
      </div>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>