<script setup lang="ts">
import styles from './widgetLifeTime.module.scss';
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {appStore} from '@/store/appStore';
import {appVars} from '@/configApp';
import {parseLocalDate} from '@/composables/localDate';
import {declineUnit} from '@/composables/declineUnit';

const now = ref( Date.now() );
let timerId: ReturnType< typeof setInterval > | null = null;

// Пасхалка: по двойному тапу переключаемся между прожитым временем и остатком.
// Считаем тапы вручную — на тач-устройствах нативный dblclick срабатывает нестабильно
const isRestShown = ref( false );
let lastTapTime: number = 0;

const onTap = () => {
  const tapTime: number = performance.now();

  if ( tapTime - lastTapTime < 300 ) {
    isRestShown.value = !isRestShown.value;
  }

  lastTapTime = tapTime;
};

onMounted(() => {
  timerId = setInterval(() => {
    now.value = Date.now();
  }, 1000 );
});

onUnmounted(() => {
  if ( timerId !== null ) {
    clearInterval( timerId );
  }
});

type TDuration = {
  years: number,
  months: number,
  weeks: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

// Разбивка интервала: календарные годы и месяцы, остаток — недели, дни и время
const splitDuration = ( from: Date, to: Date ): TDuration => {
  // Полные годы
  let years: number = to.getFullYear() - from.getFullYear();
  const yearMark: Date = new Date( from );
  yearMark.setFullYear( from.getFullYear() + years );

  if ( yearMark > to ) {
    years--;
    yearMark.setFullYear( from.getFullYear() + years );
  }

  // Полные месяцы после последней годовщины
  let months: number = 0;
  const monthMark: Date = new Date( yearMark );
  const nextMonth: Date = new Date( monthMark );
  nextMonth.setMonth( nextMonth.getMonth() + 1 );

  while ( nextMonth <= to ) {
    monthMark.setTime( nextMonth.getTime() );
    months++;
    nextMonth.setMonth( nextMonth.getMonth() + 1 );
  }

  // Остаток переводим в недели, дни, часы, минуты и секунды
  const MS_PER_SECOND: number = 1000;
  const MS_PER_MINUTE: number = 60 * MS_PER_SECOND;
  const MS_PER_HOUR: number = 60 * MS_PER_MINUTE;
  const MS_PER_DAY: number = 24 * MS_PER_HOUR;
  const MS_PER_WEEK: number = 7 * MS_PER_DAY;

  let rest: number = to.getTime() - monthMark.getTime();

  const weeks: number = Math.floor( rest / MS_PER_WEEK );
  rest -= weeks * MS_PER_WEEK;

  const days: number = Math.floor( rest / MS_PER_DAY );
  rest -= days * MS_PER_DAY;

  const hours: number = Math.floor( rest / MS_PER_HOUR );
  rest -= hours * MS_PER_HOUR;

  const minutes: number = Math.floor( rest / MS_PER_MINUTE );
  rest -= minutes * MS_PER_MINUTE;

  const seconds: number = Math.floor( rest / MS_PER_SECOND );

  return { years, months, weeks, days, hours, minutes, seconds };
}

// Прожитое время от полуночи даты рождения
const lifeTime = computed(() => {
  if ( !appStore.userBirthDate ) {
    return null;
  }

  return splitDuration( parseLocalDate( appStore.userBirthDate ), new Date( now.value ));
});

// Остаток до расчётного предела жизни (lifeExpectancyWeeks от даты рождения)
const restTime = computed(() => {
  if ( !appStore.userBirthDate ) {
    return null;
  }

  const endDate: Date = parseLocalDate( appStore.userBirthDate );
  endDate.setDate( endDate.getDate() + appVars.lifeExpectancyWeeks * 7 );

  const current: Date = new Date( now.value );

  // Расчётный предел уже позади — счётчик не показываем
  if ( endDate <= current ) {
    return null;
  }

  return splitDuration( current, endDate );
});
</script>

<template>
  <div v-if="lifeTime" :class="styles.widgetLifeTime" @click="onTap">
    <template v-if="!isRestShown">
      <div :class="styles.widgetLifeTime__title">
        Вы живёте уже
      </div>

      <div :class="styles.widgetLifeTime__accentText">
        <span :class="styles.widgetLifeTime__accentNum">
          {{ lifeTime.years }}
        </span>
        {{ declineUnit( lifeTime.years, 'year') }}
        &nbsp;

        <span :class="styles.widgetLifeTime__accentNum">
          {{ lifeTime.months }}
        </span>
        {{ declineUnit( lifeTime.months, 'month') }}
        &nbsp;

        <span :class="styles.widgetLifeTime__accentNum">
          {{ lifeTime.weeks }}
        </span>
        {{ declineUnit( lifeTime.weeks, 'week') }}
        &nbsp;

        <span :class="styles.widgetLifeTime__accentNum">
          {{ lifeTime.days }}
        </span>
        {{ declineUnit( lifeTime.days, 'day') }}
      </div>

      <div :class="styles.widgetLifeTime__divider"></div>

      <div :class="styles.widgetLifeTime__subText">
        <span :class="styles.widgetLifeTime__subNum">
          {{ lifeTime.hours }}
        </span>
        {{ declineUnit( lifeTime.hours, 'hour') }}
        &nbsp;

        <span :class="styles.widgetLifeTime__subNum">
          {{ lifeTime.minutes }}
        </span>
        {{ declineUnit( lifeTime.minutes, 'minute') }}
        &nbsp;

        <span :class="styles.widgetLifeTime__subNum">
          {{ lifeTime.seconds }}
        </span>
        {{ declineUnit( lifeTime.seconds, 'second') }}
        &nbsp;
      </div>

      <div :class="styles.widgetLifeTime__comment">
        Точно, как в аптеке 🤭
      </div>
    </template>
    <template v-else>
      <div v-if="restTime" :class="styles.widgetLifeTime__counter">
        <div :class="styles.widgetLifeTime__title">
          Осталось прожить
        </div>

        <div :class="styles.widgetLifeTime__accentText">
          <span :class="styles.widgetLifeTime__accentNum">
            {{ restTime.years }}
          </span>
          {{ declineUnit( restTime.years, 'year') }}
          &nbsp;

          <span :class="styles.widgetLifeTime__accentNum">
            {{ restTime.months }}
          </span>
          {{ declineUnit( restTime.months, 'month') }}
          &nbsp;

          <span :class="styles.widgetLifeTime__accentNum">
            {{ restTime.weeks }}
          </span>
          {{ declineUnit( restTime.weeks, 'week') }}
          &nbsp;

          <span :class="styles.widgetLifeTime__accentNum">
            {{ restTime.days }}
          </span>
          {{ declineUnit( restTime.days, 'day') }}
        </div>

        <div :class="styles.widgetLifeTime__divider"></div>

        <div :class="styles.widgetLifeTime__subText">
          <span :class="styles.widgetLifeTime__subNum">
            {{ restTime.hours }}
          </span>
          {{ declineUnit( restTime.hours, 'hour') }}
          &nbsp;

          <span :class="styles.widgetLifeTime__subNum">
            {{ restTime.minutes }}
          </span>
          {{ declineUnit( restTime.minutes, 'minute') }}
          &nbsp;

          <span :class="styles.widgetLifeTime__subNum">
            {{ restTime.seconds }}
          </span>
          {{ declineUnit( restTime.seconds, 'second') }}
          &nbsp;
        </div>

        <div :class="styles.widgetLifeTime__comment">
          Поздравляем! Ваша любознательность позволила увидеть спрятанное 🤭
        </div>
      </div>

      <div v-else :class="styles.widgetLifeTime__accentText">
        🎉 Вы превзошли расчётный лимит!<br />
        <span style="color: var( --brd-custom-theme-color )">Вы открыли новую главу в долголетии!!!</span>
      </div>
    </template>
  </div>
</template>
