<script setup lang="ts">
import styles from './dayConception.module.scss';
import {IonContent, IonPage, IonDatetime, IonModal, IonButton} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {ref, computed, watch, onMounted} from 'vue';
import {getHolidaysNames, TGetHolidaysNamesResponse} from '@/api/getHolidaysNames';
import {getNamesDays, TGetNamesDaysResponse} from '@/api/getDayNames';
import {getZodiacName, TGetZodiacNameResponse} from '@/api/getZodiacName';
import {getFamousNames, TGetFamousNamesResponse} from '@/api/getFamousNames';
import {getFamousPolitics, TGetFamousPoliticsResponse} from '@/api/getFamousPolitics';
import {appVars} from '@/configApp';
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

const SUB_THEME_COLOR = "#a876ec";

const isDateModalOpen = ref( false );
const maxDate = ref();

const openDateModal = () => {
  isDateModalOpen.value = true;
};

const selectedDate = ref();
const holidaysNames = ref< TGetHolidaysNamesResponse >();
const namesDays = ref< TGetNamesDaysResponse >();
const zodiacNames = ref< TGetZodiacNameResponse >();
const famousNames = ref< TGetFamousNamesResponse >();
const famousPolitics = ref< TGetFamousPoliticsResponse >();
const conceptionDay = ref();
const birthDay = ref();

onMounted(() => {
  maxDate.value = new Date().toISOString();
});

const formattedDate = computed(() => {
  if ( !selectedDate.value ) {
    return '';
  }
  return selectedDate.value.split('T')[0];
});


watch(formattedDate, async () => {
  const datePayload: Date = new Date( selectedDate.value );
  datePayload.setDate( datePayload.getDate() - appVars.pregnancyDuration );

  conceptionDay.value = datePayload.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  birthDay.value = new Date( formattedDate.value ).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

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
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">

      <WidgetPageTitle
          :class="styles.dayConception__titleBlock"
          bg-image="dog-2"
          title="Вы знаете дату рождения?"
          lead="Давайте посчитаем примерную дату зачатия 💫"
          comment="И посмотрим, какое событие было в этот день 🤭"
      />

      <ion-button
          :class="styles.dayConception__dateButton"
          expand="block"
          @click="openDateModal"
      >
        {{ birthDay ? `📅 ${birthDay}` : 'Выбрать дату рождения' }}
      </ion-button>

      <ion-modal
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
                :max="maxDate"
                :first-day-of-week="1"
                @ionChange="isDateModalOpen = false"
                @ionCancel="isDateModalOpen = false"
            ></ion-datetime>
            <img :class="styles.dayConception__modalArt" src="@/assets/img/animals/cat-3_art.png" alt="" />
          </div>
        </ion-content>
      </ion-modal>

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
              :name-date-male="namesDays?.nameDayNow[0].male_names"
              :name-date-female="namesDays?.nameDayNow[0].female_names"
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