<script setup lang="ts">
import styles from "./donationsPage.module.scss";
import {IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonModal, IonPage, IonToolbar} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {appVars} from '@/configApp';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import {closeCircle} from 'ionicons/icons';
import {Browser} from '@capacitor/browser';
import donatorsData from '@/jsons/donators.json';
import {ref} from 'vue';

const isDonationModalOpen = ref( false );

const openOnceDonation = async (): Promise< void > => {
  await Browser.open({ url: appVars.donations.onceUrl });
};

const openSubscribeDonation = async (): Promise< void > => {
  await Browser.open({ url: appVars.donations.subscribeDonation });
};
</script>

<template>
  <ion-page :class="styles.donationsPage"
            :style="{
              '--brd-custom-theme-color': appVars.colors.donations,
            }"
  >
    <AppHeader page-name="Ваша <span class='accent-theme'>помощь</span>" />

    <ion-content :fullscreen="true" class="ion-padding">
      <WidgetPageTitle
          :class="styles.donationsPage__block"
          bg-image="panda_art"
          title="Спасибо этим людям"
          lead="Благодаря вам проект живёт и&nbsp;развивается ✨"
          comment="С благодарностью каждому ❤️"
      />

      <div :class="[
              styles.donationsPage__button,
              styles.donationsPage__block
            ]"
            @click="isDonationModalOpen = true"
      >
        🎀 Тоже хочу помочь
      </div>

      <ul :class="styles.donationsPage__donatorsList">
        <li v-for="(donator, index) in donatorsData"
            :key="index + donator.name"
            :class="styles.donationsPage__donator"
        >
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

      <ion-content
          class="ion-padding"
          :style="{
              '--brd-custom-theme-color': appVars.colors.donations,
            }"
      >
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
        </div>
      </ion-content>

      <ion-footer :class="styles.donationsPage__modalFooter">
        <div :class="styles.donationsPage__modalButtonWrapper">
          <a :class="styles.donationsPage__button"
             :href="appVars.donations.onceUrl"
             @click.prevent="openOnceDonation"
          >
            Разово
          </a>

          <a :class="styles.donationsPage__button"
             :href="appVars.donations.subscribeDonation"
             @click.prevent="openSubscribeDonation"
          >
            Каждый месяц
          </a>
        </div>
      </ion-footer>
    </ion-modal>
  </ion-page>
</template>