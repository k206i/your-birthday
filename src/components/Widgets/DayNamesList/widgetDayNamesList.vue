<script setup lang="ts">
import styles from './widgetDayNamesList.module.scss';
import {appVars} from '@/configApp';
const props = defineProps<{
  nameDateMale?: string[],
  nameDateFemale?: string[],
  color: string,
}>();
</script>

<template>
  <div :class="styles.widgetDayNamesList"
       :style="`
        background-color: color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix });
      `"
  >
    <div :class="styles.widgetDayNamesList__title">
      🎀 Именины
    </div>

    <div :class="styles.widgetDayNamesList__subTitle">
      Мужские имена:
    </div>

    <ul v-if="props.nameDateMale"
        :class="styles.widgetDayNamesList__list"
    >
      <li v-for="(item, index) in nameDateMale" :key="item + index"
          :class="styles.widgetDayNamesList__item"
      >
        {{ item }}
      </li>
    </ul>
    <div v-else>
      В этот день мужских именин нет 😔
    </div>

    <div :class="styles.widgetDayNamesList__subTitle">
      Женские имена:
    </div>

    <ul v-if="props.nameDateFemale"
        :class="styles.widgetDayNamesList__list"
    >
      <li v-for="(item, index) in nameDateFemale" :key="item + index"
          :class="styles.widgetDayNamesList__item"
      >
        {{ item }}
      </li>
    </ul>
    <div v-else>
      В этот день женских именин нет 😔
    </div>
  </div>
</template>