<script setup lang="ts">
import styles from "./donationsPage.module.scss";
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonPage, IonToolbar} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {appVars} from '@/configApp';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import {closeCircle} from 'ionicons/icons';
import {Browser} from '@capacitor/browser';
import donatorsData from '@/jsons/donators.json';
import {ref} from 'vue';

const isDonationModalOpen = ref( true );

// Внешнюю ссылку открываю системным браузером, чтобы пользователь мог вернуться в приложение
const openOnceDonation = async (): Promise< void > => {
  await Browser.open({ url: appVars.donations.onceUrl });
};
</script>

<template>
  <ion-page :class="styles.donationsPage"
            :style="{
              '--brd-custom-theme-color': appVars.colors.donations,
            }"
  >
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <WidgetPageTitle
          :class="styles.donationsPage__block"
          bg-image="panda_art"
          title="Спасибо этим людям"
          lead="Благодаря вам проект живёт и развивается ✨"
          comment="С благодарностью каждому ❤️"
      />

      <ion-button
          :class="styles.donationsPage__block"
          expand="block"
          @click="isDonationModalOpen = true"
      >
        🎀 Тоже хочу помочь
      </ion-button>

      <ul :class="styles.donationsPage__donatorsList">
        <li v-for="(donator, index) in donatorsData" :key="index + donator.name">
          💜 {{ donator.name }}
        </li>
      </ul>

    </ion-content>

    <ion-modal
        :is-open="isDonationModalOpen"
        keep-contents-mounted="true"
        @did-dismiss="isDonationModalOpen = false"
    >
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="end">
            <ion-button @click="isDonationModalOpen = false">
              Закрыть&nbsp;&nbsp;
              <ion-icon :icon="closeCircle" size="large"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div :class="styles.donationsPage__modal">
          <div :class="styles.donationsPage__modalArtWrapper">
            <img :class="styles.donationsPage__modalArt"
                 src="@/assets/img/webp/donation-art.webp"
                 alt="With love"
            />
          </div>

          <div :class="styles.donationsPage__modalTitle">
            Поддержать проект
          </div>

          <div :class="styles.donationsPage__modalComment">
            Сумму выберете на следующем шаге — хомяк будет рад любой. Захотите подписать перевод именем — список благодарностей живёт внутри приложения, так что имя приедет с ближайшим обновлением.
          </div>

          <a :href="appVars.donations.onceUrl"
             @click.prevent="openOnceDonation"
          >
            Tips
          </a>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>