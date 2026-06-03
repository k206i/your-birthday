<script setup lang="ts">
import styles from './childBirthday.module.scss';
import { IonContent, IonDatetime, IonPage, IonModal, IonButton } from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import {computed, onMounted, ref, watch} from 'vue';
import {getHolidaysNames, TGetHolidaysNamesResponse} from '@/api/getHolidaysNames';
import {getNamesDays, TGetNamesDaysResponse} from '@/api/getDayNames';
import {appVars} from '@/configApp';
import WidgetDayNamesList from '@/components/Widgets/DayNamesList/widgetDayNamesList.vue';
import WidgetPrimaryDate from '@/components/Widgets/PrimaryDate/widgetPrimaryDate.vue';
import WidgetHolidaysList from '@/components/Widgets/HolidaysList/widgetHolidaysList.vue';
import {getZodiacName, TGetZodiacNameResponse} from '@/api/getZodiacName';
import WidgetZodiacNames from '@/components/Widgets/ZodiacNames/widgetZodiacNames.vue';


const SUB_THEME_COLOR = "#548fd6";

const isDateModalOpen = ref( false );
const selectedDate = ref();
const birthDay = ref();
const minDate = ref();
const conceptionDay = ref();
const holidaysNames = ref< TGetHolidaysNamesResponse >();
const namesDays = ref< TGetNamesDaysResponse >();
const zodiacNames = ref< TGetZodiacNameResponse >();

const formattedDate = computed(() => {
  if ( !selectedDate.value ) {
    return '';
  }
  return selectedDate.value.split('T')[0];
});

watch( formattedDate, async () => {
  const datePayload: Date = new Date( selectedDate.value );

  birthDay.value = new Date( formattedDate.value ).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  holidaysNames.value = await getHolidaysNames( datePayload );
  namesDays.value = await getNamesDays( datePayload );
  zodiacNames.value = await getZodiacName( datePayload );

  console.log( zodiacNames )

  conceptionDay.value = new Date( datePayload.setDate( datePayload.getDate() - appVars.pregnancyDuration)).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
});

onMounted(() => {
  minDate.value = new Date();
  minDate.value.setDate( minDate.value.getDate() + appVars.pregnancyDuration);
  minDate.value = minDate.value.toISOString();
});

</script>

<template>
  <ion-page :class="styles.dayConception">
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">

      <WidgetPageTitle
          :class="styles.dayConception__titleBlock"
          bg-image="cat-1"
          :color="SUB_THEME_COLOR"
          title="Хотите родить ребёнка в определённый день?"
          lead="Давайте спланируем примерный день зачатия! ☀️"
          comment="Но помните, лучший советчик &mdash; ваш лечащий врач&nbsp;💖"
      />

      <ion-button
          :class="styles.dayConception__dateButton"
          expand="block"
          @click="isDateModalOpen = true"
      >
        {{ birthDay ? `📅 ${birthDay}` : 'Выбрать дату рождения' }}
      </ion-button>

      <ion-modal
          :is-open="isDateModalOpen"
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
                @ionChange="isDateModalOpen = false"
                @ionCancel="isDateModalOpen = false"
            ></ion-datetime>
          </div>
        </ion-content>
      </ion-modal>

      <Transition name="brd-fade">
        <WidgetPrimaryDate
            v-if="formattedDate"
            :class="styles.dayConception__block"
            title="Примерная дата зачатия"
            comment="Примерно 280 дней, акушерский срок 👀"
            :date="conceptionDay"
            :color="SUB_THEME_COLOR"
        />
      </Transition>

      <Transition name="brd-fade">
        <div v-if="conceptionDay">
          <h1>
            В выбранный день рождения будут:
          </h1>

          <WidgetHolidaysList
              :class="styles.dayConception__block"
              :holidays="holidaysNames?.datesNow"
              :color="SUB_THEME_COLOR"
          />

          <WidgetZodiacNames
              :class="styles.dayConception__block"
              :signs="zodiacNames?.exact"
              :color="SUB_THEME_COLOR"
          />

          <WidgetDayNamesList
              :class="styles.dayConception__block"
              :name-date-male="namesDays?.nameDayNow[0].male_names"
              :name-date-female="namesDays?.nameDayNow[0].female_names"
              :color="SUB_THEME_COLOR"
          />
        </div>
      </Transition>

    </ion-content>

    <AppFooter />
  </ion-page>
</template>