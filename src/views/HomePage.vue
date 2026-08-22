<script setup lang="ts">
import styles from './homePage.module.scss';
import {IonContent, IonPage,} from '@ionic/vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import WidgetPageLink from '@/components/Widgets/PageLink/widgetPageLink.vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {appVars} from '@/configApp';
import {appStore} from '@/store/appStore';
import {computed, ref, watch} from 'vue';
import {declineUnit} from '@/composables/declineUnit';
import {getDaysToDate} from '@/composables/getDaysToDate';
import {currentDate} from '@/store/currentDate';
import AchievementShort from '@/components/Achievement/Short/achievementShort.vue';
import ModalBirthday from '@/components/Modals/Birthday/modalBirthday.vue';
import UiProgressBar from '@/components/Ui/ProgressBar/uiProgressBar.vue';
import {getCurrentWeekIndex} from '@/composables/getCurrentWeekIndex';
import WidgetPageTitleHome from '@/components/Widgets/PageTitleHome/widgetPageTitleHome.vue';

const isBirthdayWishOpen = ref( false );
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

// Прожитые недели для прогресс-бара жизни; null, пока не задана дата рождения
const livedWeeks = computed(() => getCurrentWeekIndex( appStore.userBirthDate, currentDate.value ));

const isBirthdayToday = computed(() => daysToBirthday.value === 0 );
const isAdditionalBirthdayLead = computed(() => daysToAdditionalBirthday.value === 0 );

const isAdditionalBirthdaySoon = computed(() => {
  return daysToAdditionalBirthday.value !== null
      && daysToAdditionalBirthday.value > 0
      && daysToAdditionalBirthday.value <= appVars.birthdaySoonDays;
});

// Автопоказ поздравления один раз, в день рождения
watch( isBirthdayToday, ( value ) => {
  if ( value && appStore.lastBirthdayGreetedDate !== currentDate.value ) {
    isBirthdayWishOpen.value = true;
    appStore.lastBirthdayGreetedDate = currentDate.value;
  }
}, { immediate: true });

</script>

<template>
  <ion-page :class="styles.homePage">
    <AppHeader is-home-page />

    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container">
        <WidgetPageTitleHome
            :class="styles.homePage__titleWidget"
            bg-image="dog-1_art"
            color="#a876ec"
            link="/userProfile"
            :title="`Здравствуйте${ appStore.userName ? `, ${ appStore.userName }` : '' }!`"
        >
          <template #lead>
            <div v-if="daysToBirthday === null"
                 :class="styles.homePage__mainLead"
            >
              <span>
                Укажите дату рождения <router-link to="/userProfile">в&nbsp;профиле</router-link> ✨
              </span>
            </div>
            <div v-else-if="isBirthdayToday"
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
        </WidgetPageTitleHome>

        <div :class="[
              styles.homePage__silentButton,
              isBirthdayToday && styles.homePage__silentButton_birthdayToday
            ]"
             @click.prevent = "isBirthdayWishOpen = true"
        >
          <template v-if="isBirthdayToday">
            🎂 Хочу ещё одно поздравление!
          </template>
          <template v-else>
            🎉 Не хочу ждать ДР, поздравьте сейчас!
          </template>
        </div>

        <AchievementShort
            v-if="appStore.lastAchievement"
            :class="styles.homePage__block"
            :achievement="appStore.lastAchievement"
            is-last
        />

        <ul :class="styles.homePage__servicesList">
          <li>
            <WidgetPageLink
                link="/lifeProgress"
                title="🎮 Жизненный прогресс"
                comment="Укажите дату рождения"
                bg-image="otter_art"
                :color="appVars.colors.lifeProgress"
            >
              <template v-if="livedWeeks !== null" #comment>
                <div :class="styles.homePage__lifeProgress">
                  <UiProgressBar
                      :total="appVars.lifeExpectancyWeeks"
                      :value="livedWeeks"
                  />
                </div>
              </template>
            </WidgetPageLink>
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
                link="/dayConception"
                title="Когда был день зачатия?"
                comment="Что было в тот день?"
                bg-image="dog-2_art"
                :color="appVars.colors.dayConception"
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


      </div>
    </ion-content>

    <ModalBirthday v-model:is-open="isBirthdayWishOpen" />

    <AppFooter />
  </ion-page>
</template>