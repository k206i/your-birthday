<script setup lang="ts">
import styles from './homePage.module.scss';
import {IonContent, IonIcon, IonModal, IonPage,} from '@ionic/vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import WidgetPageLink from '@/components/Widgets/PageLink/widgetPageLink.vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {appVars} from '@/configApp';
import {appStore} from '@/store/appStore';
import {computed, defineAsyncComponent, ref, watch} from 'vue';
import {declineUnit} from '@/composables/declineUnit';
import {getDaysToDate} from '@/composables/getDaysToDate';
import {currentDate} from '@/store/currentDate';
import AchievementShort from '@/components/Achievement/Short/achievementShort.vue';
import ModalBirthday from '@/components/Modals/Birthday/modalBirthday.vue';
import UiProgressBar from '@/components/Ui/ProgressBar/uiProgressBar.vue';
import {getCurrentWeekIndex} from '@/composables/getCurrentWeekIndex';
import WidgetPageTitleHome from '@/components/Widgets/PageTitleHome/widgetPageTitleHome.vue';
import WidgetReelsOnboarding from '@/components/Widgets/ReelsOnboarding/widgetReelsOnboarding.vue';
import WidgetPageLinkWide from '@/components/Widgets/PageLink/widgetPageLinkWide.vue';
import {Browser} from '@capacitor/browser';
import {logoTwitch} from 'ionicons/icons';

// динамический импорт выпадает из графа и в магазинную сборку не попадает
const WidgetUpdate = __UPDATE_CHECK__
    ? defineAsyncComponent(() => import( '@/components/Widgets/Update/widgetUpdate.vue' ))
    : null;

const isOnboardingOpen = ref( !appStore.isOnboardingShown );

if ( isOnboardingOpen.value ) {
  appStore.isOnboardingShown = true;
}

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

const openSocial = async ( url: string ): Promise< void > => {
  await Browser.open({ url });
};

</script>

<template>
  <ion-page :class="styles.homePage">
    <AppHeader is-home-page />

    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container">
        <ion-modal
            :is-open="isOnboardingOpen"
            keep-contents-mounted="true"
            @did-dismiss="isOnboardingOpen = false"
        >
          <WidgetReelsOnboarding
              show-progress
              show-skip
              @finish="isOnboardingOpen = false"
              @skip="isOnboardingOpen = false"
          />
        </ion-modal>

        <component :is="WidgetUpdate" v-if="WidgetUpdate" />

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

          <li :class="styles.homePage__serviceWide">
            <WidgetPageLinkWide
                link="/giftCardPage"
                title="Надо кого-то поздравить?"
                comment="Придумаем поздравление за вас"
                bg-image="cat-7_art"
                :color="appVars.colors.giftCard"
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
                link="/achievementsPage"
                title="🎮 Достижения"
                comment="Ачивки!"
                bg-image="lama_art"
                :color="appVars.colors.achievements"
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
        </ul>

        <div :class="styles.homePage__socials">
          <div :class="styles.homePage__socialsTitle">
            Кто ещё родился сегодня?
          </div>

          <ul :class="styles.homePage__socialsList">
            <li>
              <a
                  :class="styles.homePage__socialButton"
                  :style="{ '--social-color': appVars.socials.twitch.color }"
                  :href="appVars.socials.twitch.url"
                  aria-label="Twitch"
                  @click.prevent="openSocial( appVars.socials.twitch.url )"
              >
                <ion-icon :icon="logoTwitch"></ion-icon>
              </a>
            </li>

            <li>
              <a
                  :class="styles.homePage__socialButton"
                  :style="{ '--social-color': appVars.socials.telegram.color }"
                  :href="appVars.socials.telegram.url"
                  aria-label="Telegram"
                  @click.prevent="openSocial( appVars.socials.telegram.url )"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M23.91 3.79 20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56-.72 0-.6-.27-.84-.95L6.3 13.7l-5.45-1.7c-1.18-.35-1.19-1.16.26-1.75l21.26-8.2c.97-.43 1.9.24 1.53 1.73z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>

      </div>
    </ion-content>

    <ModalBirthday v-model:is-open="isBirthdayWishOpen" />

    <AppFooter />
  </ion-page>
</template>