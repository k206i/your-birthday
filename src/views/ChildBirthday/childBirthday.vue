<script setup lang="ts">
import styles from './childBirthday.module.scss';
import {IonContent, IonDatetime, IonPage} from '@ionic/vue';
import Header from '@/components/Header/header.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import {computed, onMounted, ref, watch} from 'vue';
import {getHolidaysNames, TGetHolidaysNamesResponse} from '@/api/getHolidaysNames';
import {getNamesDays, TGetNamesDaysResponse} from '@/api/getDayNames';
import {appVars} from '@/configApp';
import WidgetDayNamesList from '@/components/Widgets/DayNamesList/widgetDayNamesList.vue';
import WidgetPrimaryDate from '@/components/Widgets/PrimaryDate/widgetPrimaryDate.vue';


const SUB_THEME_COLOR = "#548fd6";

const selectedDate = ref();
const birthDay = ref();
const minDate = ref();
const conceptionDay = ref();
const holidaysNames = ref< TGetHolidaysNamesResponse >();
const namesDays = ref< TGetNamesDaysResponse >();

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
    <Header />

    <ion-content :fullscreen="true" class="ion-padding">

      <WidgetPageTitle bg-image="cat-1" :color="SUB_THEME_COLOR">
        Хотите родить ребёнка в определённый день?

        <template #lead>
          Давайте спланируем примерный день зачатия! ☀️
        </template>

        <template #comment>
          Но помните, лучший советчик &mdash; ваш лечащий врач&nbsp;💖
        </template>
      </WidgetPageTitle>

      <p>Выберите дату, когда хотите родить:</p>

      <ion-datetime
          v-model="selectedDate"
          locale="ru-RU"
          presentation="date"
          :show-default-buttons="true"
          done-text="Готово" cancel-text="Не, отмена"
          :min="minDate" max="2050-01-01T23:59:59"
      ></ion-datetime>

      <Transition name="brd-fade">
        <WidgetPrimaryDate
            v-if="formattedDate"
            title="Примерная дата зачатия"
            comment="Примерно 280 дней, акушерский срок 👀"
            :date="conceptionDay"
            :color="SUB_THEME_COLOR"
        />
      </Transition>

      <Transition name="brd-fade">
        <div v-if="conceptionDay">
          <h1>
            В выбранный день рождения будет
          </h1>

          <h3>
            Праздники
          </h3>
          <p v-if="!holidaysNames?.datesNow.length">
            Праздников нет
          </p>
          <ul v-else :class="styles.dayConception__daysList">
            <li :class="styles.dayConception__dayItem"
                v-for="(item, index) in holidaysNames?.datesNow" :key="item.date + index"
            >
              <div :class="styles.dayConception__subTitle">
                {{ item.name }}
              </div>
              <div :class="styles.dayConception__note">
                {{ item.note }}
              </div>
            </li>
          </ul>

          <WidgetDayNamesList
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