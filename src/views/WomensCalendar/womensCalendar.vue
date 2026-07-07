<script setup lang="ts">
import styles from './womensCalendar.module.scss';
import stylesArtButton from '@/assets/styles/artButton.module.scss';
import stylesOverflowSection from '@/assets/styles/overflowSection.module.scss';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {IonContent, IonPage, IonIcon, IonModal, IonDatetime, IonButton, IonPicker, IonPickerColumn, IonPickerColumnOption} from '@ionic/vue';
import { chevronForwardCircleOutline } from 'ionicons/icons';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import WidgetTipInfo from '@/components/Widgets/TipInfo/widgetTipInfo.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import UiDayCard from '@/components/Ui/DayCard/uiDayCard.vue';
import {ref, onMounted, computed} from 'vue';
import {appVars} from '@/configApp';
import {parseLocalDate, formatLocalDate, formatDisplayDate} from '@/composables/localDate';
import WidgetArtButton from '@/components/Widgets/ArtButton/widgetArtButton.vue';
import penguinArt from '@/assets/img/animals/penguin_art.webp';

const SUB_THEME_COLOR = appVars.colors.womensCalendar;

const isPeriodDateModalOpen = ref( false );
const selectedPeriodDate = ref();
const isCycleModalOpen = ref( false );
const cycleLength = ref< number >( appVars.ovulation.cycleDefault );
const maxDate = ref();

const cycleOptions: number[] = [];

for ( let i = appVars.ovulation.cycleMin; i <= appVars.ovulation.cycleMax; i++ ) {
  cycleOptions.push( i );
}

const openPeriodDateModal = () => {
  isPeriodDateModalOpen.value = true;
};

const openCycleModal = () => {
  isCycleModalOpen.value = true;
};

onMounted(() => {
  maxDate.value = formatLocalDate( new Date() ) + 'T23:59:59';
});

const lastPeriodDate = computed(() => {
  if ( !selectedPeriodDate.value ) {
    return '';
  }

  return selectedPeriodDate.value.split('T')[0];
});

const onCycleChange = ( event: CustomEvent ) => {
  cycleLength.value = Number( event.detail.value );
};

const ovulationDates = computed(() => {
  if ( !selectedPeriodDate.value ) {
    return null;
  }

  const periodStart: Date = parseLocalDate( selectedPeriodDate.value.split('T')[0] );
  const today: Date = new Date();
  today.setHours( 0, 0, 0, 0 );

  // Овуляция = начало последних месячных + длина цикла - лютеиновая фаза
  const ovulationDate: Date = new Date( periodStart );
  ovulationDate.setDate( ovulationDate.getDate() + cycleLength.value - appVars.ovulation.lutealPhase );

  // Если овуляция уже прошла — прогнозируем следующий цикл
  while ( ovulationDate < today ) {
    ovulationDate.setDate( ovulationDate.getDate() + cycleLength.value );
  }

  const early: string[] = [];
  const peak: string[] = [];
  const after: string[] = [];
  const inappropriate: string[] = [];

  // Фертильное окно (только будущие дни), прошедшие дни в начале отсекаются
  for ( let i = -appVars.ovulation.fertileDaysBefore; i <= appVars.ovulation.fertileDaysAfter; i++ ) {
    const d: Date = new Date( ovulationDate );
    d.setDate( d.getDate() + i );

    if ( d < today ) {
      continue;
    }

    const dateStr: string = formatLocalDate( d );

    if ( i < -appVars.ovulation.peakDaysBefore ) {
      early.push( dateStr );
    } else if ( i <= 0 ) {
      peak.push( dateStr );
    } else {
      after.push( dateStr );
    }
  }

  // Добираем красными днями после окна, пока не наберётся totalDays карточек
  const shownCount: number = early.length + peak.length + after.length;

  for ( let i = 1; i <= appVars.ovulation.totalDays - shownCount; i++ ) {
    const d: Date = new Date( ovulationDate );
    d.setDate( d.getDate() + appVars.ovulation.fertileDaysAfter + i );
    inappropriate.push( formatLocalDate( d ) );
  }

  // Дата рождения при зачатии в день овуляции — для перехода на страницу дня рождения
  const birthDate: Date = new Date( ovulationDate );
  birthDate.setDate( birthDate.getDate() + appVars.pregnancyDuration );

  return {
    early,
    peak,
    after,
    inappropriate,
    birthDate: formatLocalDate( birthDate ),
  };
});
</script>

<template>
  <ion-page :class="styles.womensCalendar"
            :style="{
              '--brd-custom-theme-color': SUB_THEME_COLOR,
            }"
  >
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <WidgetPageTitle
          :class="styles.womensCalendar__titleBlock"
          bg-image="cat-1"
          title="Пора искать идеальное совпадение! ❤️"
          lead="Давайте рассчитаем день овуляции и период, когда вероятность оплодотворения яйцеклетки будет наиболее высокой. ✨"
          comment="Но помните: природа любит удивлять, а лучший советчик — ваш лечащий врач 👩‍⚕️"
      />

      <div :class="styles.womensCalendar__buttons">
        <div :class="stylesArtButton.artButton" @click="openPeriodDateModal">
          <div :class="stylesArtButton.artButton__art">
            <img src="@/assets/img/animals/cat-6_art.webp" alt="" />
          </div>

          <div :class="stylesArtButton.artButton__content">
            <div :class="stylesArtButton.artButton__title">
              Когда начались послед&shy;ние месячные?
            </div>

            <div :class="stylesArtButton.artButton__comment">
              {{ lastPeriodDate ? `📅 ${lastPeriodDate}` : 'Первый день последнего цикла' }}
            </div>
          </div>

          <div :class="stylesArtButton.artButton__art">
            <ion-icon :icon="chevronForwardCircleOutline" size="large"></ion-icon>
          </div>
        </div>

        <ion-modal
            :is-open="isPeriodDateModalOpen"
            keep-contents-mounted="true"
            @did-dismiss="isPeriodDateModalOpen = false"
        >
          <ion-content>
            <div class="center-content">
              <ion-datetime
                  v-model="selectedPeriodDate"
                  locale="ru-RU"
                  presentation="date"
                  :show-default-buttons="true"
                  done-text="Готово" cancel-text="Не, отмена"
                  :max="maxDate"
                  :first-day-of-week="1"
                  @ionChange="isPeriodDateModalOpen = false"
                  @ionCancel="isPeriodDateModalOpen = false"
              ></ion-datetime>

              <img :class="styles.womensCalendar__modalArt" src="@/assets/img/animals/cat-3_art.png" alt="" />
            </div>
          </ion-content>
        </ion-modal>

        <div :class="stylesArtButton.artButton" @click="openCycleModal">
          <div :class="stylesArtButton.artButton__art">
            <img src="@/assets/img/animals/hamster_art.webp" alt="" />
          </div>

          <div :class="stylesArtButton.artButton__content">
            <div :class="stylesArtButton.artButton__title">
              Средняя продолжи&shy;тельность цикла?
            </div>

            <div :class="stylesArtButton.artButton__comment">
              {{ `⏳ ${cycleLength} дн.` }}
            </div>
          </div>

          <div :class="stylesArtButton.artButton__art">
            <ion-icon :icon="chevronForwardCircleOutline" size="large"></ion-icon>
          </div>
        </div>

        <ion-modal
            :is-open="isCycleModalOpen"
            @did-dismiss="isCycleModalOpen = false"
        >
          <ion-content>
            <div class="center-content">
              <div>
              <ion-picker>
                <ion-picker-column :value="cycleLength" @ionChange="onCycleChange">
                  <ion-picker-column-option
                      v-for="option in cycleOptions"
                      :key="option"
                      :value="option"
                  >
                    {{ option }}
                  </ion-picker-column-option>
                </ion-picker-column>
              </ion-picker>

              <ion-button
                  expand="block"
                  fill="clear"
                  @click="isCycleModalOpen = false"
              >
                Готово
              </ion-button>
              </div>

              <img :class="styles.womensCalendar__modalArt" src="@/assets/img/animals/cat-3_art.png" alt="" />
            </div>
          </ion-content>
        </ion-modal>
      </div>

      <div v-if="ovulationDates"
           :class="styles.womensCalendar__block"
      >
        <WidgetTipInfo :color="SUB_THEME_COLOR">
          Календарный метод даёт <span :style="{color: SUB_THEME_COLOR}">оценку, а не гарантию</span>: при нерегулярном цикле погрешность растёт. Зелёные дни — <span :style="{color: SUB_THEME_COLOR}">наибольшая вероятность зачатия</span> (пик — за 1–2 дня до овуляции), жёлтые — остальное фертильное окно, а все дни до и после окна — красные, зачатие в них маловероятно 😉
        </WidgetTipInfo>

        <div :class="stylesOverflowSection.overflowSection">
          <div :class="[
              styles.womensCalendar__dates,
              stylesOverflowSection.overflowSection__overflowWrapper
          ]">
            <div v-for="date in ovulationDates.early" :key="date">
              <UiDayCard :date="parseLocalDate( date )" color="warning" />
            </div>

            <div v-for="date in ovulationDates.peak" :key="date">
              <UiDayCard :date="parseLocalDate( date )" color="success" />
            </div>

            <div v-for="date in ovulationDates.after" :key="date">
              <UiDayCard :date="parseLocalDate( date )" color="warning" />
            </div>

            <div v-for="date in ovulationDates.inappropriate" :key="date">
              <UiDayCard :date="parseLocalDate( date )" color="error" />
            </div>
          </div>
        </div>
      </div>

      <WidgetArtButton
          v-if="ovulationDates"
          :color="appVars.colors.childBirthday"
          :title="`Малыш может родиться примерно <span style='color: ${SUB_THEME_COLOR}'>${ formatDisplayDate( parseLocalDate( ovulationDates.birthDate )) }</span> Давайте посмотрми, что интересного будет в этот день? 🐣`"
          comment="Праздники, именины, знак зодиака и памятные даты"
          :link="`/childBirthday?birthDate=${ovulationDates.birthDate}`"
          :art-src="penguinArt"
      />
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
