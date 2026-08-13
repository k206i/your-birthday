<script setup lang="ts">
import styles from './dayConception.module.scss';
import {IonContent, IonPage, IonButton} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {ref, computed, watch} from 'vue';
import {getHolidaysNames, TGetHolidaysNamesResponse} from '@/api/getHolidaysNames';
import {getNamesDays, TGetNamesDaysResponse} from '@/api/getDayNames';
import {getZodiacName, TGetZodiacNameResponse} from '@/api/getZodiacName';
import {getFamousNames, TGetFamousNamesResponse} from '@/api/getFamousNames';
import {getFamousPolitics, TGetFamousPoliticsResponse} from '@/api/getFamousPolitics';
import {appVars} from '@/configApp';
import {formatDisplayDate, formatLocalDate, parseLocalDate} from '@/composables/localDate';
import {currentDate} from '@/store/currentDate';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import WidgetPrimaryDate from '@/components/Widgets/PrimaryDate/widgetPrimaryDate.vue';
import WidgetArtTitle from '@/components/Widgets/ArtTitle/widgetArtTitle.vue';
import WidgetDayNamesList from '@/components/Widgets/DayNamesList/widgetDayNamesList.vue';
import WidgetZodiacNames from '@/components/Widgets/ZodiacNames/widgetZodiacNames.vue';
import WidgetHolidaysList from '@/components/Widgets/HolidaysList/widgetHolidaysList.vue';
import WidgetFamousPersons from '@/components/Widgets/FamousPersons/widgetFamousPersons.vue';
import WidgetFamousPolitics from '@/components/Widgets/FamousPolitics/widgetFamousPolitics.vue';
import WidgetTipInfo from '@/components/Widgets/TipInfo/widgetTipInfo.vue';
import WidgetDatesLists from '@/components/Widgets/DatesLists/widgetDatesLists.vue';
import {appStore} from '@/store/appStore';

const SUB_THEME_COLOR = appVars.colors.dayConception;

// Нативный календарь принимает границы в формате YYYY-MM-DD, без времени
const maxDate = computed(() => currentDate.value );

const minDate = computed(() => {
  const date: Date = parseLocalDate( currentDate.value );
  date.setFullYear( date.getFullYear() - 120 );

  return formatLocalDate( date );
});

const selectedDate = ref();

const onNativeDateChange = ( event: Event ) => {
  const value: string = ( event.target as HTMLInputElement ).value;

  if ( value ) {
    selectedDate.value = value;
  }
};

// Расчёт по дате рождения из профиля
const showOwnDate = () => {
  selectedDate.value = appStore.userBirthDate;
};
const holidaysNames = ref< TGetHolidaysNamesResponse >();
const namesDays = ref< TGetNamesDaysResponse >();
const zodiacNames = ref< TGetZodiacNameResponse >();
const famousNames = ref< TGetFamousNamesResponse >();
const famousPolitics = ref< TGetFamousPoliticsResponse >();
const conceptionDay = ref();
const birthDay = ref();

const formattedDate = computed(() => {
  if ( !selectedDate.value ) {
    return '';
  }
  return selectedDate.value.split('T')[0];
});


watch(formattedDate, async () => {
  const datePayload: Date = new Date( selectedDate.value );
  datePayload.setDate( datePayload.getDate() - appVars.pregnancyDuration );

  conceptionDay.value = formatDisplayDate( datePayload );
  birthDay.value = formatDisplayDate( new Date( formattedDate.value ));

  holidaysNames.value = await getHolidaysNames( datePayload );
  namesDays.value = await getNamesDays( datePayload );
  zodiacNames.value = await getZodiacName( datePayload );
  famousNames.value = await getFamousNames( datePayload );
  famousPolitics.value = await getFamousPolitics( datePayload );
});
</script>

<template>
  <ion-page :class="styles.dayConception"
            :style="{
              '--brd-custom-theme-color': SUB_THEME_COLOR,
            }"
  >
    <AppHeader page-name="Дата <span class='accent-theme'>зачатия</span>" />

    <ion-content :fullscreen="true" class="ion-padding">

      <WidgetPageTitle
          :class="styles.dayConception__titleBlock"
          bg-image="dog-2"
          title="Вы знаете дату рождения?"
          lead="Давайте посчитаем примерную дату зачатия 💫"
          comment="И посмотрим, какое событие было в этот день 🤭"
      />

      <div :class="styles.dayConception__dateButtonWrap">
        <ion-button
            :class="styles.dayConception__dateButton"
            expand="block"
        >
          {{ birthDay ? `📅 ${birthDay}` : 'Указать дату рождения' }}
        </ion-button>

        <input
            :class="styles.dayConception__nativeDate"
            type="date"
            :value="formattedDate"
            :min="minDate"
            :max="maxDate"
            @change="onNativeDateChange"
        />
      </div>


      <div v-if="!conceptionDay && appStore.userBirthDate"
           :class="styles.dayConception__standaloneLink"
      >
        <a href="#" @click.prevent="showOwnDate">
          Узнать про себя
        </a>
      </div>

      <Transition name="brd-fade">
        <WidgetPrimaryDate
            v-if="conceptionDay"
            :class="styles.dayConception__block"
            title="Зачатие было примерно"
            comment="Примерно 280 дней, акушерский срок 👀"
            :date="conceptionDay"
            bg-image="dog-3_art"
        />
      </Transition>

      <Transition name="brd-fade">
        <div v-if="conceptionDay">
          <WidgetArtTitle :class="styles.dayConception__artTitle">
            Что особенного было
            <span :style="{color: SUB_THEME_COLOR}">в день зачатия</span>?
          </WidgetArtTitle>

          <WidgetDayNamesList
              :class="styles.dayConception__block"
              :name-date-male="namesDays?.nameDayNow[0]?.male_names"
              :name-date-female="namesDays?.nameDayNow[0]?.female_names"
          />

          <WidgetZodiacNames
              :class="styles.dayConception__block"
              :signs="zodiacNames?.exact"
          />

          <WidgetHolidaysList
              :class="styles.dayConception__block"
              :holidays="holidaysNames?.datesNow"
          />

          <WidgetFamousPersons
              :class="styles.dayConception__block"
              :famous-names="famousNames"
          />

          <WidgetFamousPolitics
              :class="styles.dayConception__block"
              :famous-politics="famousPolitics"
          />

          <WidgetTipInfo>
            Точную дату зачатия знает только календарь... и то не факт 😄 При нормальном течении беременности всё могло случиться <span :style="{color: SUB_THEME_COLOR}">на несколько дней раньше или позже</span> расчётной даты зачатия. Поэтому давайте посмотрим, какие события происходили в период <span :style="{color: SUB_THEME_COLOR}">наиболее вероятного зачатия</span>.
          </WidgetTipInfo>

          <WidgetDatesLists
              :holidays-names="holidaysNames"
              :names-days="namesDays"
              :famous-names="famousNames"
              :famous-politics="famousPolitics"
          />
        </div>
      </Transition>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>