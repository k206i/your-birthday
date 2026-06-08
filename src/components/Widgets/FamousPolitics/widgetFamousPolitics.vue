<script setup lang="ts">
import styles from './widgetFamousPolitics.module.scss';
import { appVars } from '@/configApp';
import type { TFamousPoliticData } from '@/api/getFamousPolitics';

const props = defineProps<{
  persons?: TFamousPoliticData[],
  color: string,
}>();

const formatDate = ( date: string | null ): string => {
  if ( !date ) return '';
  const [ day, month, year ] = date.split( '-' );
  return `${ day }.${ month }.${ year }`;
};
</script>

<template>
  <div :class="styles.widgetFamousPolitics"
       :style="{
        backgroundColor: `color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix })`,
       }"
  >
    <div :class="styles.widgetFamousPolitics__contentWrapper">
      <div :class="styles.widgetFamousPolitics__title">
        🏛️ Политики
      </div>

      <ul v-if="props.persons?.length"
          :class="styles.widgetFamousPolitics__list"
      >
        <li v-for="(item, index) in props.persons" :key="item.name + index"
            :class="styles.widgetFamousPolitics__item"
        >
          <div :class="styles.widgetFamousPolitics__date">
            {{ formatDate( item.date_birth ) }}
          </div>

          <div :class="styles.widgetFamousPolitics__name">
            {{ item.name }}
          </div>

          <div :class="styles.widgetFamousPolitics__comment">
            {{ item.category }}
          </div>

          <div v-if="item.note"
               :class="styles.widgetFamousPolitics__comment"
          >
            {{ item.note }}
          </div>
        </li>
      </ul>

      <div v-else :class="styles.widgetFamousPolitics__empty">
        Этот день не связан с политиками 😔
      </div>
    </div>

    <div :class="styles.widgetFamousPolitics__art"></div>
  </div>
</template>
