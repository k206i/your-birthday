<script setup lang="ts">
import styles from './achievementsPage.module.scss';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {IonContent, IonPage} from '@ionic/vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {appVars} from '@/configApp';
import WidgetAddBirthday from '@/components/Widgets/AddBirthday/widgetAddBirthday.vue';
import {appStore} from '@/store/appStore';
import AchievementFull from '@/components/Achievement/Full/achievementFull.vue';
import stylesOverflowSection from '@/assets/styles/overflowSection.module.scss';
import AchievementImage from '@/components/Achievement/Image/achievementImage.vue';
import ageData from '@/jsons/achievements_age.json';
import famousData from '@/jsons/achievements_famous.json';
import beardData from '@/jsons/achievements_beard.json';
import {TAchievementCombined} from '@/api/getAchievementById';
import {getStreakDays, isAchievementReceived} from '@/api/getAchievementDate';
import {declineUnit} from '@/composables/declineUnit';
import {currentDate} from '@/store/currentDate';
import ModalAchievement from '@/components/Modals/Achievement/modalAchievement.vue';
import {ref, computed} from 'vue';

type TAchievementGroup = {
  id: string,
  icon: string,
  title: string,
  achievements: TAchievementCombined[],
}

const groups: TAchievementGroup[] = [
  { id: 'age', icon: '🎂', title: 'Возраст', achievements: ageData as TAchievementCombined[] },
  { id: 'famous', icon: '🤘', title: 'Знаменитости', achievements: famousData as TAchievementCombined[] },
  { id: 'beard', icon: '✂️', title: 'Борода', achievements: beardData as TAchievementCombined[] },
];

const selectedGroupId = ref< string >( groups[ 0 ].id );

const onSelectGroup = ( id: string ) => {
  selectedGroupId.value = id;
};

// Получена ли ачивка — считаем той же функцией, что и lastAchievement,
// иначе подсветка в списке и «последнее достижение» могли бы разойтись
const isReceived = ( achievement: TAchievementCombined ): boolean => {
  return isAchievementReceived( achievement );
};

// Пройденные дни стрика; null — стрик не запущен
const streakDays = computed(() => getStreakDays());

const onStartStreak = () => {
  appStore.beardStreakStart = currentDate.value;
};

const onResetStreak = () => {
  appStore.beardStreakStart = '';
};

const isAchievementModalOpen = ref( false );
const selectedAchievement = ref< TAchievementCombined | null >( null );

const onSelectAchievement = ( achievement: TAchievementCombined ) => {
  selectedAchievement.value = achievement;
  isAchievementModalOpen.value = true;
};
</script>

<template>
  <ion-page :class="styles.achievementsPage"
            :style="{
              '--brd-custom-theme-color': appVars.colors.achievements,
            }"
  >
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <template v-if="!appStore.userBirthDate">
        <WidgetAddBirthday />
      </template>
      <template v-else>
        <div :class="styles.achievementsPage__lastLabel">
          Последнее достижение 🎉
        </div>

        <AchievementFull
            v-if="appStore.lastAchievement"
            :achievement="appStore.lastAchievement"
        />

        <div :class="stylesOverflowSection.overflowSection">
          <ul :class="[
                stylesOverflowSection.overflowSection__overflowWrapper,
                styles.achievementsPage__tabsList
              ]"
          >
            <li v-for="group in groups"
                :key="group.id"
                :class="[
                  styles.achievementsPage__tabItem,
                  group.id === selectedGroupId && styles.achievementsPage__tabItem_selected
                ]"
                @click="onSelectGroup( group.id )"
            >
              <div :class="styles.achievementsPage__tabItemIcon">
                {{ group.icon }}
              </div>

              <div :class="styles.achievementsPage__tabItemText">
                {{ group.title }}
              </div>
            </li>
          </ul>
        </div>

        <div v-if="selectedGroupId === 'beard'">
          <template v-if="streakDays !== null">
            Стрик: {{ streakDays }} {{ declineUnit( streakDays, 'day' ) }}

            <div @click="onResetStreak">
              Сбросить стрик
            </div>
          </template>
          <template v-else>
            <div @click="onStartStreak">
              Начать стрик
            </div>
          </template>
        </div>

        <ul v-for="group in groups"
            v-show="group.id === selectedGroupId"
            :key="group.id"
            :class="styles.achievementsPage__achievementsList"
        >
          <li v-for="achievement in group.achievements"
              :key="achievement.id"
              :class="[
                styles.achievementsPage__achievementsListItem,
                isReceived( achievement ) && styles.achievementsPage__achievementsListItem_received
              ]"
              @click="onSelectAchievement( achievement )"
          >
            <AchievementImage
                :achievement="achievement"
                is-simple
            />
          </li>
        </ul>


      </template>
    </ion-content>

    <ModalAchievement
        v-model:is-open="isAchievementModalOpen"
        :achievement="selectedAchievement"
    />

    <AppFooter />
  </ion-page>
</template>