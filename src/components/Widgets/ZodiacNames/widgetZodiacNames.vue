<script setup lang="ts">
import styles from './widgetZodiacNames.module.scss';
import { appVars } from '@/configApp';
import type { TZodiacSign } from '@/api/getZodiacName';

const props = defineProps<{
  signs?: TZodiacSign[],
  color: string,
}>();
</script>

<template>
  <div :class="styles.widgetZodiacNames"
       :style="{
        backgroundColor: `color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix })`,
       }"
  >
    <div :class="styles.widgetZodiacNames__contentWrapper">
      <div :class="styles.widgetZodiacNames__title">
        Знак зодиака ✨
      </div>

      <ul v-if="props.signs?.length"
          :class="styles.widgetZodiacNames__list"
      >
        <li v-for="(item, index) in props.signs" :key="item.name_en + index"
            :class="styles.widgetZodiacNames__item"
        >
          <div :class="styles.widgetZodiacNames__symbol">
            {{ item.symbol }}
          </div>

          <div :class="styles.widgetZodiacNames__body">
            <div :class="styles.widgetZodiacNames__main">
              {{ item.name }}&nbsp;({{ item.name_en }}) ·&nbsp;{{ item.element }} ·&nbsp;{{ item.planet }}
            </div>
            <div :class="styles.widgetZodiacNames__comment">
              {{ item.traits }}&nbsp;·&nbsp;{{ item.modality }}
            </div>
            <div v-if="item.note"
                 :class="styles.widgetZodiacNames__comment"
            >
              {{ item.note }}
            </div>
          </div>
        </li>
      </ul>

      <div v-else :class="styles.widgetZodiacNames__empty">
        Знак зодиака не определён&nbsp;😔
      </div>
    </div>

    <div :class="styles.widgetZodiacNames__art"></div>
  </div>
</template>
