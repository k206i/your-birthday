<script setup lang="ts">
import styles from './widgetFamousPolitics.module.scss';
import { appVars } from '@/configApp';
import { computed } from 'vue';
import type { TFamousPoliticData, TGetFamousPoliticsResponse } from '@/api/getFamousPolitics';

type TFamousPoliticEntry = {
  person: TFamousPoliticData,
  type: 'birth' | 'death',
}

const props = defineProps<{
  famousPolitics?: TGetFamousPoliticsResponse,
}>();

const persons = computed<TFamousPoliticEntry[]>(() => [
  ...( props.famousPolitics?.birthNow ?? [] ).map( p => ({ person: p, type: 'birth' as const }) ),
  ...( props.famousPolitics?.deathNow ?? [] ).map( p => ({ person: p, type: 'death' as const }) ),
]);

const formatDate = ( date: string | null ): string => {
  if ( !date ) return '';
  const [ day, month, year ] = date.split( '-' );
  return `${ day }.${ month }.${ year }`;
};
</script>

<template>
  <div :class="styles.widgetFamousPolitics">
    <div :class="styles.widgetFamousPolitics__contentWrapper">
      <div :class="styles.widgetFamousPolitics__title">
        🏛️ Политики
      </div>

      <ul v-if="persons.length"
          :class="styles.widgetFamousPolitics__list"
      >
        <li v-for="(item, index) in persons" :key="item.person.name + index"
            :class="styles.widgetFamousPolitics__item"
        >
          <div :class="styles.widgetFamousPolitics__date">
            {{ formatDate( item.type === 'birth' ? item.person.date_birth : item.person.date_death ) }}
            {{ item.type === 'birth' ? 'д. р.' : 'д. с.' }}
          </div>

          <div :class="styles.widgetFamousPolitics__name">
            {{ item.person.name }}
          </div>

          <div :class="styles.widgetFamousPolitics__comment">
            {{ item.person.category }}
          </div>

          <div v-if="item.person.note"
               :class="styles.widgetFamousPolitics__comment"
          >
            {{ item.person.note }}
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
