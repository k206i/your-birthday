<script setup lang="ts">
import styles from './childBirthday.module.scss';
import { IonContent, IonDatetime, IonPage, IonModal, IonButton, onIonViewDidEnter } from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import {computed, ref, watch} from 'vue';
import {useRoute} from 'vue-router';
import {formatDisplayDate, formatLocalDate, parseLocalDate} from '@/composables/localDate';
import {currentDate} from '@/store/currentDate';
import {appStore} from '@/store/appStore';
import {declineUnit} from '@/composables/declineUnit';
import {splitDuration} from '@/composables/splitDuration';
import {getHolidaysNames, TGetHolidaysNamesResponse} from '@/api/getHolidaysNames';
import {getNamesDays, TGetNamesDaysResponse} from '@/api/getDayNames';
import {appVars} from '@/configApp';
import WidgetDayNamesList from '@/components/Widgets/DayNamesList/widgetDayNamesList.vue';
import WidgetPrimaryDate from '@/components/Widgets/PrimaryDate/widgetPrimaryDate.vue';
import WidgetHolidaysList from '@/components/Widgets/HolidaysList/widgetHolidaysList.vue';
import {getZodiacName, TGetZodiacNameResponse} from '@/api/getZodiacName';
import WidgetZodiacNames from '@/components/Widgets/ZodiacNames/widgetZodiacNames.vue';
import WidgetArtTitle from '@/components/Widgets/ArtTitle/widgetArtTitle.vue';
import { getFamousNames, TGetFamousNamesResponse } from '@/api/getFamousNames';
import WidgetFamousPersons from '@/components/Widgets/FamousPersons/widgetFamousPersons.vue';
import { getFamousPolitics, TGetFamousPoliticsResponse } from '@/api/getFamousPolitics';
import WidgetFamousPolitics from '@/components/Widgets/FamousPolitics/widgetFamousPolitics.vue';
import WidgetTipInfo from '@/components/Widgets/TipInfo/widgetTipInfo.vue';
import WidgetDatesLists from '@/components/Widgets/DatesLists/widgetDatesLists.vue';


const SUB_THEME_COLOR = appVars.colors.childBirthday;

const route = useRoute();
const isDateModalOpen = ref( false );
const isDateConfirmed = ref( false );
const loadedDate = ref( '' );

const openDateModal = () => {
  if ( !selectedDate.value ) {
    setTimeout(() => {
      selectedDate.value = minDate.value;
    }, 200)
  }
  isDateModalOpen.value = true;
};
const selectedDate = ref();
const birthDay = ref();
const minDate = computed(() => {
  const date: Date = parseLocalDate( currentDate.value );
  date.setDate( date.getDate() + appVars.pregnancyDuration );

  return formatLocalDate( date ) + 'T00:00:00';
});
const conceptionDay = ref();
const holidaysNames = ref< TGetHolidaysNamesResponse >();
const namesDays = ref< TGetNamesDaysResponse >();
const zodiacNames = ref< TGetZodiacNameResponse >();
const famousNames = ref< TGetFamousNamesResponse >();
const famousPolitics = ref< TGetFamousPoliticsResponse >();

const formattedDate = computed(() => {
  if ( !selectedDate.value ) {
    return '';
  }
  return selectedDate.value.split('T')[0];
});

const loadData = async () => {
  if ( !formattedDate.value || formattedDate.value === loadedDate.value ) {
    return;
  }

  loadedDate.value = formattedDate.value;
  const datePayload: Date = new Date( selectedDate.value );

  birthDay.value = formatDisplayDate( new Date( formattedDate.value ));

  holidaysNames.value = await getHolidaysNames( datePayload );
  namesDays.value = await getNamesDays( datePayload );
  zodiacNames.value = await getZodiacName( datePayload );
  famousNames.value = await getFamousNames( datePayload );
  famousPolitics.value = await getFamousPolitics( datePayload );

  conceptionDay.value = formatDisplayDate( new Date( datePayload.setDate( datePayload.getDate() - appVars.pregnancyDuration )));
};

// Данные грузим только после явного подтверждения даты,
// чтобы предустановка minDate при открытии модалки не запускала загрузку
watch( formattedDate, () => {
  if ( isDateConfirmed.value ) {
    loadData();
  }
});

const onDateConfirm = () => {
  isDateConfirmed.value = true;
  isDateModalOpen.value = false;
  loadData();
};

const ageOnDate = computed(() => {
  if ( !appStore.userBirthDate || !formattedDate.value ) {
    return null;
  }

  return splitDuration( parseLocalDate( appStore.userBirthDate ), parseLocalDate( formattedDate.value ));
});

const primaryDateRef = ref< InstanceType< typeof WidgetPrimaryDate > >();
let shouldScrollToDate: boolean = false;

// Дата рождения может прийти в урле — ведём себя так, как будто пользователь выбрал её сам.
watch(() => route.query.birthDate, ( value ) => {
  if ( typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test( value )) {
    return;
  }

  selectedDate.value = value;
  isDateConfirmed.value = true;
  shouldScrollToDate = true;
  loadData();
}, { immediate: true });

onIonViewDidEnter(() => {
  if ( !shouldScrollToDate ) {
    return;
  }

  shouldScrollToDate = false;
  primaryDateRef.value?.$el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

</script>

<template>
  <ion-page :class="styles.dayConception"
            :style="{
              '--brd-custom-theme-color': SUB_THEME_COLOR,
            }"
  >
    <AppHeader page-name="Планирование <span class='accent-theme'>рождения</span>" />

    <ion-content :fullscreen="true" class="ion-padding">

      <WidgetPageTitle
          :class="styles.dayConception__titleBlock"
          bg-image="penguin_art"
          title="Хотите родить ребёнка в определённый день?"
          lead="Давайте спланируем примерный день зачатия! ☀️"
          comment="Но помните, лучший советчик &mdash; ваш лечащий врач&nbsp;💖"
      />

      <ion-button
          :class="styles.dayConception__dateButton"
          expand="block"
          @click="openDateModal"
      >
        {{ birthDay ? `📅 ${birthDay}` : 'Выбрать дату рождения' }}
      </ion-button>

      <ion-modal
          class="picker-modal"
          :is-open="isDateModalOpen"
          keep-contents-mounted="true"
          @did-dismiss="isDateModalOpen = false"
      >
        <ion-content>
          <div class="center-content">
            <ion-datetime
                v-model="selectedDate"
                locale="ru-RU"
                presentation="date"
                :show-default-buttons="true"
                done-text="Готово" cancel-text="Не, отмена"
                :min="minDate" max="2050-01-01T23:59:59"
                :first-day-of-week="1"
                @ionChange="onDateConfirm"
                @ionCancel="isDateModalOpen = false"
            ></ion-datetime>

            <img :class="styles.dayConception__modalArt" src="@/assets/img/animals/mouse_art.webp" alt="" />
          </div>
        </ion-content>
      </ion-modal>

      <Transition name="brd-fade">
        <WidgetPrimaryDate
            v-if="conceptionDay"
            ref="primaryDateRef"
            :class="styles.dayConception__block"
            title="Примерная дата зачатия"
            comment="Примерно 280 дней, акушерский срок 👀"
            :date="conceptionDay"
            bgImage="alpaka"
        />
      </Transition>

      <Transition name="brd-fade">
        <div v-if="conceptionDay">
          <WidgetArtTitle :class="styles.dayConception__artTitle">
            Что особенного будет
            <span :style="{color: SUB_THEME_COLOR}">в день рождения</span>?
          </WidgetArtTitle>

          <div v-if="ageOnDate"
               :class="styles.dayConception__tipBlock"
          >
            <div :class="styles.dayConception__tipBlockTitle">
              В этот день вам будет

              <span :class="styles.dayConception__accentDate">
                {{ ageOnDate.years }} {{ declineUnit( ageOnDate.years, 'year' ) }}
                {{ ageOnDate.months }} {{ declineUnit( ageOnDate.months, 'month' ) }}
                {{ ageOnDate.weeks }} {{ declineUnit( ageOnDate.weeks, 'week' ) }}
              </span>
            </div>

            <div :class="styles.dayConception__tipBlockComment">
              {{ conceptionDay }} · малышу — первый день
            </div>
          </div>

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

          <WidgetTipInfo :color="SUB_THEME_COLOR">
            Малыши редко рождаются <span :style="{color: SUB_THEME_COLOR}">точно по расписанию</span> 😊 Они могут появиться на свет в любой из дней рядом с предполагаемой датой родов. Поэтому давайте посмотрим, какие интересные события приходятся на период наибольшей вероятности рождения — <span :style="{color: SUB_THEME_COLOR}">36 дней</span> при нормальном течении беременности. Ребёнок может родиться в любой из этих дней ❤️
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