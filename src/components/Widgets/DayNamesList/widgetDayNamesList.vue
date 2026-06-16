<script setup lang="ts">
import styles from './widgetDayNamesList.module.scss';

const props = defineProps<{
  nameDateMale?: string[],
  nameDateFemale?: string[],
}>();
</script>

<template>
  <div :class="styles.widgetDayNamesList">
    <div :class="styles.widgetDayNamesList__contentWrapper">
      <div :class="styles.widgetDayNamesList__title">
        🎀 Именины
      </div>

      <div :class="styles.widgetDayNamesList__subTitle">
        Мужские имена:
      </div>

      <ul v-if="props.nameDateMale?.length"
          :class="styles.widgetDayNamesList__list"
      >
        <li v-for="(item, index) in nameDateMale" :key="item + index"
            :class="[
                styles.widgetDayNamesList__item,
                styles.widgetDayNamesList__item_male
              ]"
        >
          {{ item }}
        </li>
      </ul>
      <div v-else
           :class="[
                styles.widgetDayNamesList__item,
                styles.widgetDayNamesList__item_male
              ]"
      >
        В этот день мужских именин нет 😔
      </div>

      <div :class="styles.widgetDayNamesList__subTitle">
        Женские имена:
      </div>

      <ul v-if="props.nameDateFemale?.length"
          :class="styles.widgetDayNamesList__list"
      >
        <li v-for="(item, index) in nameDateFemale" :key="item + index"
            :class="styles.widgetDayNamesList__item"
        >
          {{ item }}
        </li>
      </ul>
      <div v-else :class="styles.widgetDayNamesList__item">
        В этот день женских именин нет&nbsp;😔
      </div>
    </div>

    <div :class="styles.widgetDayNamesList__art"></div>
  </div>
</template>