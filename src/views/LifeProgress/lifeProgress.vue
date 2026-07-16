<script setup lang="ts">

import styles from './lifeProgress.module.scss';
import {IonContent, IonPage, IonButton, IonModal, IonDatetime} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import {appVars} from '@/configApp';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {ref, computed, watch} from 'vue';
import {formatDisplayDate, parseLocalDate} from '@/composables/localDate';
import {appStore} from '@/store/appStore';
import {currentDate} from '@/store/currentDate';

const isDateModalOpen = ref( false );
const selectedDate = ref();

const openDateModal = () => {
  isDateModalOpen.value = true;
};

const maxDate = computed(() => currentDate.value + 'T23:59:59');

// Предзаполнение из профиля и обновление при его изменении
watch(() => appStore.userBirthDate, ( value ) => {
  selectedDate.value = value || undefined;
}, { immediate: true });

// Выбор даты на этой странице обновляет профиль
watch( selectedDate, () => {
  if ( selectedDate.value ) {
    appStore.userBirthDate = selectedDate.value.split('T')[0];
  }
});

const birthDay = computed(() => {
  if ( !selectedDate.value ) {
    return '';
  }

  return formatDisplayDate( new Date( selectedDate.value.split('T')[0] ));
});

const lifeWeeks = computed(() => {
  if ( !selectedDate.value ) {
    return null;
  }

  const birth: Date = parseLocalDate( selectedDate.value.split('T')[0] );
  const today: Date = parseLocalDate( currentDate.value );

  // Возраст в полных годах
  let yearsLived: number = today.getFullYear() - birth.getFullYear();
  const lastBirthday: Date = new Date( birth );
  lastBirthday.setFullYear( birth.getFullYear() + yearsLived );

  if ( lastBirthday > today ) {
    yearsLived--;
    lastBirthday.setFullYear( birth.getFullYear() + yearsLived );
  }

  // Неделя внутри текущего года жизни (0-51, 53-я неделя прижимается к 52-й)
  const MS_PER_WEEK: number = 7 * 24 * 60 * 60 * 1000;
  const weeksSinceBirthday: number = Math.min( 51, Math.floor(( today.getTime() - lastBirthday.getTime() ) / MS_PER_WEEK ));

  return {
    currentWeekIndex: yearsLived * 52 + weeksSinceBirthday,
  };
});

const lifeDecades = computed(() => {
  const decades = [];
  const totalWeeks: number = appVars.lifeExpectancyWeeks;
  const weeksPerDecade: number = 10 * 52;

  for ( let d = 0; d < Math.ceil( totalWeeks / weeksPerDecade ); d++ ) {
    decades.push({
      label: d * 10,
      startWeek: d * weeksPerDecade,
      weeksCount: Math.min( weeksPerDecade, totalWeeks - d * weeksPerDecade ),
    });
  }

  return decades;
});
</script>

<template>
  <ion-page :class="styles.lifeProgress"
            :style="{
              '--brd-custom-theme-color': appVars.colors.lifeProgress,
            }"
  >
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <WidgetPageTitle
          :class="styles.lifeProgress__titleBlock"
          bg-image="cat-5"
          title="Загрузка жизненного пути 🎮"
          lead="Узнайте, на сколько процентов уже загружена ваша жизненная карта, и посмотрите, сколько уровней ещё впереди."
          comment="Посоревнуйтесь с друзьями, знаменитостями и рекордсменами-долгожителями 📊"
      />

      <ion-button
          :class="styles.lifeProgress__dateButton"
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

            <img :class="styles.lifeProgress__modalArt" src="@/assets/img/animals/cat-3_art.png" alt="" />
          </div>
        </ion-content>
      </ion-modal>

      <div v-if="lifeWeeks" :class="styles.lifeProgress__weeksGrid">
        <div v-for="decade in lifeDecades" :key="decade.label" :class="styles.lifeProgress__decade">
          <div :class="styles.lifeProgress__decadeLabel">{{ decade.label }}</div>

          <div :class="styles.lifeProgress__decadeCells">
            <div v-for="week in decade.weeksCount"
                 :key="week"
                 :class="[
                    styles.lifeProgress__week,
                    decade.startWeek + week - 1 < lifeWeeks.currentWeekIndex && styles.lifeProgress__week_past,
                    decade.startWeek + week - 1 === lifeWeeks.currentWeekIndex && styles.lifeProgress__week_current
                 ]"
            ></div>
          </div>
        </div>
      </div>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
