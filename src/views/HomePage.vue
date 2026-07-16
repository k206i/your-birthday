<script setup lang="ts">
import styles from './homePage.module.scss';
import { IonContent, IonPage } from '@ionic/vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import WidgetPageLink from '@/components/Widgets/PageLink/widgetPageLink.vue';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {appVars} from '@/configApp';
import {appStore} from '@/store/appStore';
import {computed} from 'vue';
import {parseLocalDate} from '@/composables/localDate';
import {declineDays} from '@/composables/declineDays';
import {currentDate} from '@/store/currentDate';

const daysToBirthday = computed(() => {
  if ( !appStore.userBirthDate ) {
    return null;
  }

  const birth: Date = parseLocalDate( appStore.userBirthDate );
  const today: Date = parseLocalDate( currentDate.value );

  const nextBirthday: Date = new Date( birth );
  nextBirthday.setFullYear( today.getFullYear() );

  if ( nextBirthday < today ) {
    nextBirthday.setFullYear( today.getFullYear() + 1 );
  }

  const MS_PER_DAY: number = 24 * 60 * 60 * 1000;

  return Math.round(( nextBirthday.getTime() - today.getTime() ) / MS_PER_DAY );
});

const birthdayLead = computed(() => {
  if ( daysToBirthday.value === 0 ) {
    return 'Сегодня ваш день рождения! 🎉';
  }

  return `До вашего ДР: ${ daysToBirthday.value }&nbsp;${ declineDays( daysToBirthday.value ?? 0 ) } ✨`;
});
</script>

<template>
  <ion-page :class="styles.homePage">
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container">
        <WidgetPageTitle
            :class="styles.homePage__titleWidget"
            bg-image="dog-1_art"
            color="#a876ec"
            :title="`Здравствуйте${ appStore.userName ? ', ' + appStore.userName : '' }!`"
            :lead="daysToBirthday !== null ? birthdayLead : ''"
            comment="Все важные даты в одном месте 💜"
        >
          <template #lead>
            <template v-if="daysToBirthday === null">
              Укажите дату рождения <router-link to="/userProfile">в&nbsp;профиле</router-link> ✨
            </template>
          </template>
        </WidgetPageTitle>

        <ul :class="styles.homePage__servicesList">
          <li>
            <WidgetPageLink
                link="/dayConception"
                title="День зачатия"
                comment="Что было в тот день?"
                bg-image="dog-2_art"
                :color="appVars.colors.dayConception"
            />
          </li>

          <li>
            <WidgetPageLink
                link="/childBirthday"
                title="Планируете ребёнка?"
                comment="Выбираем дату рождения"
                bg-image="penguin_art"
                :color="appVars.colors.childBirthday"
            />
          </li>

          <li>
            <WidgetPageLink
                link="/mensCalendar"
                title="Планирование для мужиков"
                comment="Чо, как?"
                bg-image="dog-4"
                :color="appVars.colors.mensCalendar"
            />
          </li>

          <li>
            <WidgetPageLink
                link="/womensCalendar"
                title="Планирование для девушек"
                comment="Поищем идеальный день&nbsp;❤️"
                bg-image="cat-1_art"
                :color="appVars.colors.womensCalendar"
            />
          </li>

          <li>
            <WidgetPageLink
                link="/lifeProgress"
                title="🎮 Жизненный прогресс"
                comment="███████░░░░░"
                bg-image="cat-1_art"
                :color="appVars.colors.lifeProgress"
            />
          </li>
        </ul>


        <p>
          📈 XP жизненного опыта

          Каждая прожитая неделя приносит немного опыта.

          Посмотрим, сколько XP вы уже заработали.

          🏅 Сравните свой уровень с другими игроками.
        </p>
      </div>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>