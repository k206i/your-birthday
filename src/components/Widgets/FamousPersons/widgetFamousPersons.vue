<script setup lang="ts">
import styles from './widgetFamousPersons.module.scss';
import { appVars } from '@/configApp';
import type { TFamousPersonData } from '@/api/getFamousNames';

const props = defineProps<{
  persons?: TFamousPersonData[],
  color: string,
}>();

const formatDate = ( date: string | null ): string => {
  if ( !date ) return '';
  const [ day, month, year ] = date.split( '-' );
  return `${ day }.${ month }.${ year }`;
};
</script>

<template>
  <div :class="styles.widgetFamousPersons"
       :style="{
        backgroundColor: `color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix })`,
       }"
  >
    <div :class="styles.widgetFamousPersons__contentWrapper">
      <div :class="styles.widgetFamousPersons__title">
        Знаменитости 🌟
      </div>

      <ul v-if="props.persons?.length"
          :class="styles.widgetFamousPersons__list"
      >
        <li v-for="(item, index) in props.persons" :key="item.name + index"
            :class="styles.widgetFamousPersons__item"
        >
          <div :class="styles.widgetFamousPersons__date">
            {{ formatDate( item.date_birth ) }}
          </div>

          <div :class="styles.widgetFamousPersons__name">
            {{ item.name }}
          </div>

          <div :class="styles.widgetFamousPersons__comment">
            {{ item.category }}
          </div>

          <div v-if="item.note"
               :class="styles.widgetFamousPersons__comment"
          >
            {{ item.note }}
          </div>
        </li>
      </ul>

      <div v-else :class="styles.widgetFamousPersons__empty">
        Этот день не связан со знаменитыми деятелями искусств&nbsp;😔
      </div>
    </div>

    <div :class="styles.widgetFamousPersons__art"></div>
  </div>
</template>
