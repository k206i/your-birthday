<script setup lang="ts">
import styles from './achievementsPage.module.scss';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {IonContent, IonPage, onIonViewWillEnter} from '@ionic/vue';
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
import dietData from '@/jsons/achievements_diet.json';
import sportData from '@/jsons/achievements_sport.json';
import {TAchievementCombined} from '@/api/getAchievementById';
import {getStreakDays, isAchievementReceived, setStreakStart, TStreakName} from '@/api/getAchievementDate';
import {getAchievementsProgress} from '@/api/getAchievementsProgress';
import {declineUnit} from '@/composables/declineUnit';
import {currentDate} from '@/store/currentDate';
import {formatLocalDate, parseLocalDate} from '@/composables/localDate';
import ModalAchievement from '@/components/Modals/Achievement/modalAchievement.vue';
import {ref, computed} from 'vue';
import UiProgressBar from '@/components/Ui/ProgressBar/uiProgressBar.vue';

type TAchievementGroup = {
  id: string,
  icon: string,
  title: string,
  achievements: TAchievementCombined[],
  streakName?: TStreakName,
}

const groups: TAchievementGroup[] = [
  { id: 'age', icon: '🎂', title: 'Возраст', achievements: ageData as TAchievementCombined[] },
  { id: 'famous', icon: '🤘', title: 'Знаменитости', achievements: famousData as TAchievementCombined[] },
  { id: 'beard', icon: '🧙‍♂️', title: 'Борода', achievements: beardData as TAchievementCombined[], streakName: 'beard' },
  { id: 'diet', icon: '🍎', title: 'Диета', achievements: dietData as TAchievementCombined[], streakName: 'diet' },
  { id: 'sport', icon: '🏃', title: 'Спорт', achievements: sportData as TAchievementCombined[], streakName: 'sport' },
];

const getGroupIdByLastAchievement = (): string => {
  const lastId: string | undefined = appStore.lastAchievement?.id;
  const groupId: string = lastId ? lastId.split( '_' )[ 0 ] : '';

  return groups.some( item => item.id === groupId ) ? groupId : groups[ 0 ].id;
};

const selectedGroupId = ref< string >( getGroupIdByLastAchievement() );

const selectedGroup = computed(() => groups.find( item => item.id === selectedGroupId.value ) ?? groups[ 0 ] );

const onSelectGroup = ( id: string ) => {
  selectedGroupId.value = id;
};

const isReceived = ( achievement: TAchievementCombined ): boolean => {
  return isAchievementReceived( achievement );
};

// Пройденные дни стрика выбранной группы; null — стрик не запущен или у группы его нет
const streakDays = computed(() => {
  const streakName: TStreakName | undefined = selectedGroup.value.streakName;

  return streakName ? getStreakDays( streakName ) : null;
});

const progress = computed(() => getAchievementsProgress( selectedGroup.value.achievements ));

const onStartStreak = ( streakName: TStreakName ) => {
  setStreakStart( streakName, currentDate.value );
};

const onResetStreak = ( streakName: TStreakName ) => {
  setStreakStart( streakName, '' );
};

const maxDate = computed(() => currentDate.value );

const minDate = computed(() => {
  const date: Date = parseLocalDate( currentDate.value );
  date.setFullYear( date.getFullYear() - 10 );

  return formatLocalDate( date );
});

const onStreakDateChange = ( event: Event, streakName: TStreakName ) => {
  const value: string = ( event.target as HTMLInputElement ).value;

  if ( value ) {
    setStreakStart( streakName, value );
  }
};

const isAchievementModalOpen = ref( false );
const selectedAchievement = ref< TAchievementCombined | null >( null );

const onSelectAchievement = ( achievement: TAchievementCombined ) => {
  selectedAchievement.value = achievement;
  isAchievementModalOpen.value = true;
};

onIonViewWillEnter(() => {
  selectedGroupId.value = getGroupIdByLastAchievement();
});
</script>

<template>
  <ion-page :class="styles.achievementsPage"
            :style="{
              '--brd-custom-theme-color': appVars.colors.achievements,
            }"
  >
    <AppHeader page-name="Ваши <span class='accent-theme'>достижения</span>" />

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
            :class="styles.achievementsPage__block"
        />

        <div :class="[
              stylesOverflowSection.overflowSection,
              styles.achievementsPage__block
            ]"
        >
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

        <div v-if="selectedGroup.streakName">
          <template v-if="streakDays !== null">
            <div :class="styles.achievementsPage__streakInfo">
              <div>
                <span :class="styles.achievementsPage__streakInfoDays">
                  {{ streakDays }}
                </span>

                {{ declineUnit( streakDays, 'day' ) }}

                <span v-if="selectedGroup.streakName === 'diet'">
                  на диете
                </span>
                <span v-else-if="selectedGroup.streakName === 'beard'">
                  без бритвы
                </span>
                <span v-else>
                  терпения и труда
                </span>
              </div>

              <div :class="styles.achievementsPage__streakReset"
                   @click="onResetStreak( selectedGroup.streakName )"
              >
                Сбросить
              </div>
            </div>
          </template>
          <template v-else>
            <div :class="styles.achievementsPage__lightButton"
                 @click="onStartStreak( selectedGroup.streakName )"
            >
              {{selectedGroup.icon}}

              <template v-if="selectedGroup.streakName === 'diet'">
                Начать соблюдать диету!
              </template>
              <template v-else-if="selectedGroup.streakName === 'beard'">
                Принять бородатый вызов!
              </template>
              <template v-else-if="selectedGroup.streakName === 'sport'">
                Начать заниматься спортом!
              </template>
              <template v-else>
                Принять вызов!
              </template>
            </div>

            <div :class="styles.achievementsPage__shartDivider">
              или
            </div>

            <div :class="styles.achievementsPage__streakDateWrap">
              <div :class="styles.achievementsPage__streakAddDate">
                📅 Укажите дату, если уже начали
              </div>

              <input
                  :class="styles.achievementsPage__nativeDate"
                  type="date"
                  :min="minDate"
                  :max="maxDate"
                  @change="onStreakDateChange( $event, selectedGroup.streakName )"
              />
            </div>
          </template>
        </div>

        <div v-if="progress.daysFromLast !== null && progress.daysToNext"
             :class="styles.achievementsPage__progressBar"
        >
          <div :class="styles.achievementsPage__progressBarTitleWrapper">
            <div :class="styles.achievementsPage__progressBarTitle">
              До следующего достижения
            </div>

            <div :class="styles.achievementsPage__progressBarDays">
              {{ progress.daysToNext }}

              {{ declineUnit( progress.daysToNext, 'day' )}}
            </div>
          </div>

          <UiProgressBar
              :class="styles.achievementsPage__progressBarBar"
              :total="progress.daysFromLast + progress.daysToNext"
              :value="progress.daysFromLast"
          />
        </div>
        <div v-else-if="progress.daysFromLast !== null">
          Всё пройдено
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