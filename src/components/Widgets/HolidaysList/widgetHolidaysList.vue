<script setup lang="ts">
import styles from './widgetHolidaysList.module.scss';
import { appVars } from '@/configApp';
import type { THolidayData } from '@/api/getHolidaysNames';

const props = defineProps<{
  holidays?: THolidayData[],
  color: string,
}>();
</script>

<template>
  <div :class="styles.widgetHolidaysList"
       :style="`
        background-color: color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix });
      `"
  >
    <div :class="styles.widgetHolidaysList__contentWrapper">
      <div :class="styles.widgetHolidaysList__title">
        🎉 Праздники
      </div>

      <ul v-if="props.holidays?.length"
          :class="styles.widgetHolidaysList__list"
      >
        <li v-for="(item, index) in props.holidays" :key="item.date + index"
            :class="styles.widgetHolidaysList__item"
        >
          <div :class="styles.widgetHolidaysList__date">
            {{ item.date.split( '-' ).join( '.' ) }}
          </div>
          <div :class="styles.widgetHolidaysList__name">
            {{ item.name }}
          </div>
        </li>
      </ul>

      <div v-else :class="styles.widgetHolidaysList__empty">
        В этот день праздников нет&nbsp;😔
      </div>
    </div>

    <div :class="styles.widgetHolidaysList__art"></div>
  </div>
</template>
