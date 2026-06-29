<script setup lang="ts">
import styles from './mensCalendar.module.scss';
import stylesArtButton from '@/assets/styles/artButton.module.scss';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {IonContent, IonPage, IonIcon, IonModal, IonDatetime} from '@ionic/vue';
import { chevronForwardCircleOutline } from 'ionicons/icons';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {ref, watch, onMounted, computed} from 'vue';
import {appVars} from '@/configApp';

const SUB_THEME_COLOR = "#548fd6";

const lastAlcoholDate = ref();
const lastEjaculationDate = ref();

const isAlcoholDateModalOpen = ref(false);
const selectedAlcoholDate = ref();
const isEjaculationDateModalOpen = ref(false);
const selectedEjaculationDate = ref();
const maxDate = ref();

const openAlcoholDateModal = () => {
  isAlcoholDateModalOpen.value = true;
};

const openEjaculationDateModal = () => {
  isEjaculationDateModalOpen.value = true;
};

onMounted(() => {
  maxDate.value = new Date().toISOString();
});

watch(selectedAlcoholDate, () => {
  if (selectedAlcoholDate.value) {
    lastAlcoholDate.value = selectedAlcoholDate.value.split('T')[0];
  }
});

watch(selectedEjaculationDate, () => {
  if (selectedEjaculationDate.value) {
    lastEjaculationDate.value = selectedEjaculationDate.value.split('T')[0];
  }
});

const optimalDates = computed(() => {
  if ( !selectedAlcoholDate.value || !selectedEjaculationDate.value ) {
    return null;
  }

  const alcDate: Date = new Date( selectedAlcoholDate.value.split('T')[0] );
  const ejacDate: Date = new Date( selectedEjaculationDate.value.split('T')[0] );
  const today: Date = new Date();
  today.setHours( 0, 0, 0, 0 );

  const readyDate: Date = new Date( alcDate );
  readyDate.setDate( readyDate.getDate() + appVars.abstinenceAlcoholDuration.normal );

  const base: Date = readyDate > today ? readyDate : ejacDate;
  const tooShort: string[] = [];
  const optimal: string[] = [];
  const tooLong: string[] = [];
  const inappropriate: string[] = [];
  let missing: number = 0;

  for ( let i = appVars.abstinenceEjaculationDuration.short; i <= appVars.abstinenceEjaculationDuration.long; i++ ) {
    const d: Date = new Date( base );
    d.setDate( d.getDate() + i );

    if ( d < today ) {
      missing++;
      continue;
    }

    const dateStr: string = d.toISOString().split('T')[0];

    if ( i <= appVars.abstinenceEjaculationDuration.short ) {
      tooShort.push( dateStr );
    } else if ( i <= appVars.abstinenceEjaculationDuration.normal ) {
      optimal.push( dateStr );
    } else {
      tooLong.push( dateStr );
    }
  }

  for ( let j = 1; j <= missing; j++ ) {
    const d: Date = new Date( base );
    d.setDate( d.getDate() + appVars.abstinenceEjaculationDuration.long + j );
    inappropriate.push( d.toISOString().split('T')[0] );
  }

  return { tooShort, optimal, tooLong, inappropriate };
});
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

      <div :class="styles.mensCalendar__buttons">
        <div :class="stylesArtButton.artButton" @click="openAlcoholDateModal">
          <div :class="stylesArtButton.artButton__art">
            <img src="@/assets/img/png/icon-bottle.png" alt="" />
          </div>

          <div :class="stylesArtButton.artButton__content">
            <div :class="stylesArtButton.artButton__title">
              Когда последний раз употреб&shy;ляли алкоголь?
            </div>

            <div :class="stylesArtButton.artButton__comment">
              {{ lastAlcoholDate ? `📅 ${lastAlcoholDate}` : 'Честность = точность расчётов' }}
            </div>
          </div>

          <div :class="stylesArtButton.artButton__art">
            <ion-icon :icon="chevronForwardCircleOutline" size="large"></ion-icon>
          </div>
        </div>

        <ion-modal
            :is-open="isAlcoholDateModalOpen"
            keep-contents-mounted="true"
            @did-dismiss="isAlcoholDateModalOpen = false"
        >
          <ion-content>
            <div class="center-content">
              <ion-datetime
                  v-model="selectedAlcoholDate"
                  locale="ru-RU"
                  presentation="date"
                  :show-default-buttons="true"
                  done-text="Готово" cancel-text="Не, отмена"
                  :max="maxDate"
                  :first-day-of-week="1"
                  @ionChange="isAlcoholDateModalOpen = false"
                  @ionCancel="isAlcoholDateModalOpen = false"
              ></ion-datetime>

              <img :class="styles.mensCalendar__modalArt" src="@/assets/img/animals/cat-3_art.png" alt="" />
            </div>
          </ion-content>
        </ion-modal>

        <div :class="stylesArtButton.artButton" @click="openEjaculationDateModal">
          <div :class="stylesArtButton.artButton__art">
            <img src="@/assets/img/png/icon-bottle.png" alt="" />
          </div>

          <div :class="stylesArtButton.artButton__content">
            <div :class="stylesArtButton.artButton__title">
              Когда была послед&shy;няя эякуляция?
            </div>

            <div :class="stylesArtButton.artButton__comment">
              {{ lastEjaculationDate ? `📅 ${lastEjaculationDate}` : 'Неважно, каким способом 🤭' }}
            </div>
          </div>

          <div :class="stylesArtButton.artButton__art">
            <ion-icon :icon="chevronForwardCircleOutline" size="large"></ion-icon>
          </div>
        </div>

        <ion-modal
            :is-open="isEjaculationDateModalOpen"
            keep-contents-mounted="true"
            @did-dismiss="isEjaculationDateModalOpen = false"
        >
          <ion-content>
            <div class="center-content">
              <ion-datetime
                  v-model="selectedEjaculationDate"
                  locale="ru-RU"
                  presentation="date"
                  :show-default-buttons="true"
                  done-text="Готово" cancel-text="Не, отмена"
                  :max="maxDate"
                  :first-day-of-week="1"
                  @ionChange="isEjaculationDateModalOpen = false"
                  @ionCancel="isEjaculationDateModalOpen = false"
              ></ion-datetime>

              <img :class="styles.mensCalendar__modalArt" src="@/assets/img/animals/cat-3_art.png" alt="" />
            </div>
          </ion-content>
        </ion-modal>
      </div>

      <div v-if="optimalDates">
        short
        <div v-for="date in optimalDates.tooShort" :key="date">{{ date }}</div>
        normal
        <div v-for="date in optimalDates.optimal" :key="date">{{ date }}</div>
        long
        <div v-for="date in optimalDates.tooLong" :key="date">{{ date }}</div>
        inappropriate
        <div v-for="date in optimalDates.inappropriate" :key="date">{{ date }}</div>
      </div>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
