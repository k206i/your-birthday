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
import {declineUnit} from '@/composables/declineUnit';
import {getDaysToDate} from '@/composables/getDaysToDate';
import {currentDate} from '@/store/currentDate';
import AchievementShort from '@/components/Achievement/Short/achievementShort.vue';

const daysToBirthday = computed(() => {
  if ( !appStore.userBirthDate ) {
    return null;
  }

  return getDaysToDate( appStore.userBirthDate, currentDate.value );
});

const daysToAdditionalBirthday = computed(() => {
  if ( !appStore.additionalName || !appStore.additionalBirthDate  ) {
    return null;
  }

  return getDaysToDate( appStore.additionalBirthDate, currentDate.value );
});

const isBirthdayLead = computed(() => daysToBirthday.value === 0 );
const isAdditionalBirthdayLead = computed(() => daysToAdditionalBirthday.value === 0 );

const isAdditionalBirthdaySoon = computed(() => {
  return daysToAdditionalBirthday.value !== null
      && daysToAdditionalBirthday.value > 0
      && daysToAdditionalBirthday.value <= appVars.birthdaySoonDays;
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
            link="/userProfile"
            :title="`Здравствуйте${ appStore.userName ? ', ' + appStore.userName : '' }!`"
        >
          <template #lead>
            <div v-if="daysToBirthday === null"
                 :class="styles.homePage__mainLead"
            >
              <span>
                Укажите дату рождения <router-link to="/userProfile">в&nbsp;профиле</router-link> ✨
              </span>
            </div>
            <div v-else-if="isBirthdayLead"
                 :class="[
                     styles.homePage__mainLead,
                     styles.homePage__mainLead_accent
                 ]"
            >
              Сегодня ваш день рождения!&nbsp;🎉
            </div>
            <div v-else
                 :class="styles.homePage__mainLead"
            >
              <div :class="styles.homePage__mainDate">
                {{ daysToBirthday }}
              </div>

              <div>
                <div :class="styles.homePage__mainDateName">
                  {{ declineUnit( daysToBirthday ?? 0 ) }}
                </div>

                <div :class="styles.homePage__mainDateComment">
                  до вашего дня рождения&nbsp;✨
                </div>
              </div>
            </div>

            <template v-if="daysToAdditionalBirthday !== null">
              <div v-if="isAdditionalBirthdayLead"
                   :class="styles.homePage__leadBlock"
                   class="accent"
              >
                Сегодня {{ appStore.additionalName }} празднует свой день рождения!&nbsp;🎉
              </div>
              <div v-else-if="isAdditionalBirthdaySoon"
                   :class="styles.homePage__leadBlock"
              >
                🚨🚨🚨 <br />{{ appStore.additionalName }} уже репетирует задувание свечей — {{ daysToAdditionalBirthday === 1 ? 'остался' : 'осталось' }} <span class="accent">{{ daysToAdditionalBirthday }}</span>&nbsp;{{ declineUnit( daysToAdditionalBirthday ?? 0 ) }} 🎂
              </div>
              <div v-else
                   :class="styles.homePage__leadBlock"
              >
                {{ appStore.additionalName }} ждёт поздравлений через <span class="accent">{{ daysToAdditionalBirthday }}</span>&nbsp;{{ declineUnit( daysToAdditionalBirthday ?? 0 ) }} 🎁
              </div>
            </template>
          </template>

          <template #comment>
            <template v-if="appStore.rememberedPersonTitle && appStore.rememberedPersonName">
              P.S. {{ appStore.rememberedPersonTitle }} — <span class="accent">{{ appStore.rememberedPersonName }}</span>
            </template>
            <template v-else>
              Всё спланируем, всё рассчитаем 💜
            </template>
          </template>
        </WidgetPageTitle>

        <AchievementShort
            v-if="appStore.lastAchievement"
            :class="styles.homePage__block"
            :achievement="appStore.lastAchievement"
            is-last
        />

        <ul :class="styles.homePage__servicesList">
          <li>
            <WidgetPageLink
                link="/dayConception"
                title="Когда был день зачатия?"
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
                link="/maleCalendar"
                title="Планирование для мужиков"
                comment="Чо, как?"
                bg-image="dog-4"
                :color="appVars.colors.maleCalendar"
            />
          </li>

          <li>
            <WidgetPageLink
                link="/femaleCalendar"
                title="Планирование для девушек"
                comment="Поищем идеальный день&nbsp;❤️"
                bg-image="cat-1_art"
                :color="appVars.colors.femaleCalendar"
            />
          </li>

          <li>
            <WidgetPageLink
                link="/lifeProgress"
                title="🎮 Жизненный прогресс"
                comment="███████░░░░░"
                bg-image="otter_art"
                :color="appVars.colors.lifeProgress"
            />
          </li>

          <li>
            <WidgetPageLink
                link="/achievementsPage"
                title="🎮 Достижения"
                comment="Ачивки!"
                bg-image="otter_art"
                :color="appVars.colors.achievements"
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