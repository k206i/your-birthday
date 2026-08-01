<script setup lang="ts">

import styles from './lifeProgress.module.scss';
import {IonContent, IonPage, IonButton, IonModal, IonDatetime} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import {appVars} from '@/configApp';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {ref, computed, watch} from 'vue';
import {formatDisplayDate} from '@/composables/localDate';
import {getCurrentWeekIndex} from '@/composables/getCurrentWeekIndex';
import {appStore} from '@/store/appStore';
import {currentDate} from '@/store/currentDate';
import {shareElementAsImage} from '@/composables/shareElementAsImage';
import famousData from '@/jsons/achievements_famous.json';
import AchievementTooltip from '@/components/Achievement/Tooltip/achievementTooltip.vue';
import {TAchievementCombined} from '@/api/getAchievementById';
import AchievementShort from '@/components/Achievement/Short/achievementShort.vue';
import WidgetLifeTime from '@/components/Widgets/LifeTime/widgetLifeTime.vue';

// Неделя жизни → ачивка. Пока только знаменитости, в будущем сюда могут лечь другие ачивки
const achievementByWeek: Map< number, TAchievementCombined > = new Map(
  ( famousData as TAchievementCombined[] ).map( item => [ item.weeks as number, item ] )
);

const isDateModalOpen = ref( false );
const selectedDate = ref();
const weeksGridRef = ref< HTMLElement >();
const hoveredAchievement = ref< TAchievementCombined | null >( null );
const tooltipStyle = ref< Record< string, string > >( {} );

let lastTouchTime: number = 0;
const TOUCH_HIT_RADIUS: number = 28; // px — радиус привязки пальца к ближайшей жёлтой клетке

const showForCell = ( cell: Element ) => {
  if ( !weeksGridRef.value ) {
    return;
  }

  const achievement: TAchievementCombined | undefined = achievementByWeek.get( Number(( cell as HTMLElement ).dataset.week ));

  if ( !achievement ) {
    return;
  }

  const gridRect: DOMRect = weeksGridRef.value.getBoundingClientRect();
  const cellRect: DOMRect = cell.getBoundingClientRect();

  tooltipStyle.value = {
    position: 'absolute',
    left: '50vw',
    top: ( cellRect.top - gridRect.top - 40 ) + 'px', // 40px - чтобы палец загораживал подсказку
    width: '70vw',
    transform: 'translate( -50%, -100% )',
    pointerEvents: 'none',
  };
  hoveredAchievement.value = achievement;
};

const hideTooltip = () => {
  hoveredAchievement.value = null;
};

const onGridOver = ( event: MouseEvent ) => {
  // После касания браузер шлёт эмулированные mouse-события — игнорируем, чтобы тултип не залипал
  if ( performance.now() - lastTouchTime < 700 ) {
    return;
  }

  const cell = ( event.target as HTMLElement ).closest( '[data-week]' );

  if ( cell ) {
    showForCell( cell );
  }
};

const onGridOut = () => {
  if ( performance.now() - lastTouchTime < 700 ) {
    return;
  }

  hideTooltip();
};

// Привязка к ближайшей жёлтой клетке в радиусе — точное попадание пальцем почти невозможно
const showNearest = ( clientX: number, clientY: number ) => {
  if ( !weeksGridRef.value ) {
    return;
  }

  const cells: NodeListOf< Element > = weeksGridRef.value.querySelectorAll( '[data-week]' );
  let bestCell: Element | null = null;
  let bestDist: number = Infinity;

  cells.forEach(( cell ) => {
    const rect: DOMRect = cell.getBoundingClientRect();
    const cx: number = rect.left + rect.width / 2;
    const cy: number = rect.top + rect.height / 2;
    const dist: number = ( clientX - cx ) ** 2 + ( clientY - cy ) ** 2;

    if ( dist < bestDist ) {
      bestDist = dist;
      bestCell = cell;
    }
  });

  if ( bestCell && bestDist <= TOUCH_HIT_RADIUS ** 2 ) {
    showForCell( bestCell );
  } else {
    hideTooltip();
  }
};

const onGridTouch = ( event: TouchEvent ) => {
  lastTouchTime = performance.now();

  const touch: Touch | undefined = event.touches[0];

  if ( !touch ) {
    return;
  }

  showNearest( touch.clientX, touch.clientY );
};

const onGridTouchEnd = () => {
  lastTouchTime = performance.now();
  hideTooltip();
};

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

  const currentWeekIndex: number | null = getCurrentWeekIndex( selectedDate.value.split('T')[0], currentDate.value );

  if ( currentWeekIndex === null ) {
    return null;
  }

  return {
    currentWeekIndex,
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
          bg-image="otter_art"
          title="Визуализация жизненного пути 🎮"
          lead="Посмотрите свой пройденный путь, получайте ачивки, стройте планы и живите!"
          comment="Попробуйте получить мифическую ачивку&nbsp;🧙‍♂️"
      />

      <template v-if="appStore.userBirthDate">
        <WidgetLifeTime />
      </template>
      <template v-else>
        <ion-button
            :class="styles.lifeProgress__dateButton"
            expand="block"
            @click="openDateModal"
        >
          {{ birthDay ? `📅 ${birthDay}` : 'Указать дату рождения' }}
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
      </template>

      <div v-if="lifeWeeks" :class="styles.lifeProgress__weekComment">
        Каждый квадратик &mdash; неделя.
        Каждая строка &mdash; год.<br />
      </div>

      <div v-if="lifeWeeks" :class="styles.lifeProgress__weekComment">
        <span :class="[styles.lifeProgress__weekLegendItem, styles.lifeProgress__weekLegendItem_past]"></span>&nbsp;прожито
        &nbsp;&nbsp;&nbsp;
        <span :class="[styles.lifeProgress__weekLegendItem, styles.lifeProgress__weekLegendItem_current]"></span>&nbsp;сейчас
        &nbsp;&nbsp;&nbsp;
        <span :class="[styles.lifeProgress__weekLegendItem, styles.lifeProgress__weekLegendItem_achievement]"></span>&nbsp;чей-то финал (нажмите, чтобы посмотреть)
      </div>

      <div v-if="lifeWeeks"
           ref="weeksGridRef"
           :class="styles.lifeProgress__weeksGrid"
           @mouseover="onGridOver"
           @mouseout="onGridOut"
           @touchstart.passive="onGridTouch"
           @touchmove.passive="onGridTouch"
           @touchend="onGridTouchEnd"
           @touchcancel="onGridTouchEnd"
      >
        <div v-for="decade in lifeDecades" :key="decade.label" :class="styles.lifeProgress__decade">
          <div :class="styles.lifeProgress__decadeLabel">{{ decade.label }}</div>

          <div :class="styles.lifeProgress__decadeCells">
            <div v-for="week in decade.weeksCount"
                 :key="week"
                 :data-week="achievementByWeek.has( decade.startWeek + week - 1 ) ? decade.startWeek + week - 1 : undefined"
                 :class="[
                    styles.lifeProgress__week,
                    decade.startWeek + week - 1 < lifeWeeks.currentWeekIndex && styles.lifeProgress__week_past,
                    achievementByWeek.has( decade.startWeek + week - 1 ) && styles.lifeProgress__week_achievement,
                    decade.startWeek + week - 1 === lifeWeeks.currentWeekIndex && styles.lifeProgress__week_current,
                    hoveredAchievement?.weeks === ( decade.startWeek + week - 1 ) && styles.lifeProgress__week_hovered
                 ]"
            ></div>
          </div>
        </div>

        <AchievementTooltip
            v-if="hoveredAchievement"
            :style="tooltipStyle"
            :achievement="hoveredAchievement"
            :title="hoveredAchievement.name"
            :comment="hoveredAchievement.comment"
            :icon="hoveredAchievement.icon"
        />
      </div>

      <ion-button
          v-if="lifeWeeks"
          expand="block"
          @click="shareElementAsImage( weeksGridRef, 'life-progress.png' )"
      >
        Поделиться прогрессом 📤
      </ion-button>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
