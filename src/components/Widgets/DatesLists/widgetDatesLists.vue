<script setup lang="ts">
import styles from './widgetDatesLists.module.scss';
import { computed } from 'vue';
import {IonAccordion, IonAccordionGroup, IonItem, IonLabel} from '@ionic/vue';
import type {TGetFamousNamesResponse, TFamousPersonData} from '@/api/getFamousNames';
import {TGetHolidaysNamesResponse} from '@/api/getHolidaysNames';
import {TGetNamesDaysResponse} from '@/api/getDayNames';
import {TGetFamousPoliticsResponse, TFamousPoliticData} from '@/api/getFamousPolitics';

const props = defineProps<{
  famousNames?: TGetFamousNamesResponse,
  famousPolitics?: TGetFamousPoliticsResponse,
  holidaysNames?: TGetHolidaysNamesResponse,
  namesDays?: TGetNamesDaysResponse,
}>();

console.log( props.famousNames );

type TFamousEntry = { person: TFamousPersonData, type: 'birth' | 'death' };

const famousNormalList = computed<TFamousEntry[]>(() => [
  ...( props.famousNames?.birthNormal ?? [] ).map( p => ({ person: p, type: 'birth' as const }) ),
  ...( props.famousNames?.deathNormal ?? [] ).map( p => ({ person: p, type: 'death' as const }) ),
]);

type TPoliticEntry = { person: TFamousPoliticData, type: 'birth' | 'death' };

const politicsNormalList = computed<TPoliticEntry[]>(() => [
  ...( props.famousPolitics?.birthNormal ?? [] ).map( p => ({ person: p, type: 'birth' as const }) ),
  ...( props.famousPolitics?.deathNormal ?? [] ).map( p => ({ person: p, type: 'death' as const }) ),
]);
</script>

<template>
  <div :class="styles.widgetDatesLists">
    <ion-accordion-group expand="inset" :multiple="true">
      <ion-accordion v-if="holidaysNames?.datesNormal" value="datesNormal">
        <ion-item slot="header" color="dark">
          <ion-label>
            Праздники 🎉
          </ion-label>
        </ion-item>
        <div :class="styles.widgetDatesLists__spoilerContent" slot="content">
          <ul :class="styles.widgetDatesLists__daysList">
            <li :class="styles.widgetDatesLists__dayItem"
                v-for="(item, index) in holidaysNames?.datesNormal" :key="item.date + index"
            >
              <div :class="styles.widgetDatesLists__date">
                {{ item.date.split( '-' ).join( '.' ) }}
              </div>
              <div :class="styles.widgetDatesLists__subTitle">
                {{ item.name }}
              </div>
              <div :class="styles.widgetDatesLists__note">
                {{ item.note }}
              </div>
            </li>
          </ul>
        </div>
      </ion-accordion>

      <ion-accordion v-if="namesDays?.nameDayNormal" value="nameDayNormal">
        <ion-item slot="header" color="dark">
          <ion-label>
            Именины 🎀
          </ion-label>
        </ion-item>
        <div :class="styles.widgetDatesLists__spoilerContent" slot="content">
          <div :class="styles.widgetDatesLists__subTitle">
            Мужские имена
          </div>

          <ul :class="styles.widgetDatesLists__daysList">
            <slot v-for="(item, index) in namesDays?.nameDayNormal"
                  :key="item.date + index"
            >
              <li v-if="item.male_names.length"
                  :class="[
                      styles.widgetDatesLists__dayItem,
                      styles.widgetDatesLists__dayItem_names
                    ]"
              >
                <div :class="styles.widgetDatesLists__date">
                  {{ item.date.split( '-' ).join( '.' ) }}
                </div>

                <div :class="styles.widgetDatesLists__note">
                  {{ item.male_names.join( ', ' ) }}
                </div>
              </li>
            </slot>
          </ul>

          <div :class="styles.widgetDatesLists__subTitle">
            Женские имена
          </div>

          <ul :class="styles.widgetDatesLists__daysList">
            <slot v-for="(item, index) in namesDays?.nameDayNormal"
                  :key="item.date + index"
            >
              <li v-if="item.female_names.length"
                  :class="styles.widgetDatesLists__dayItem"
              >
                <div :class="styles.widgetDatesLists__date">
                  {{ item.date.split( '-' ).join( '.' ) }}
                </div>

                <div :class="styles.widgetDatesLists__note">
                  {{ item.female_names.join( ', ' ) }}
                </div>
              </li>
            </slot>
          </ul>
        </div>
      </ion-accordion>

      <ion-accordion v-if="famousNormalList.length" value="famousNormal">
        <ion-item slot="header" color="dark">
          <ion-label>
            Знаменитости 🌟
          </ion-label>
        </ion-item>
        <div :class="styles.widgetDatesLists__spoilerContent" slot="content">
          <ul :class="styles.widgetDatesLists__daysList">
            <li v-for="(entry, index) in famousNormalList" :key="entry.person.name + index"
                :class="styles.widgetDatesLists__dayItem"
            >
              <div :class="styles.widgetDatesLists__date">
                {{ ( entry.type === 'birth' ? entry.person.date_birth : entry.person.date_death )?.split( '-' ).join( '.' ) }}
                <span :class="styles.widgetDatesLists__note">
                  {{ entry.type === 'birth' ? 'д.р.' : 'д.с.' }}
                </span>
              </div>

              <div :class="styles.widgetDatesLists__subTitle">
                {{ entry.person.name }}
              </div>

              <div v-if="entry.person.category || entry.person.note"
                   :class="styles.widgetDatesLists__note"
              >
                {{ [ entry.person.category, entry.person.note ].filter( Boolean ).join( ' · ' ) }}
              </div>
            </li>
          </ul>
        </div>
      </ion-accordion>

      <ion-accordion v-if="politicsNormalList.length" value="politicsNormal">
        <ion-item slot="header" color="dark">
          <ion-label>
            Политики 🏛️
          </ion-label>
        </ion-item>
        <div :class="styles.widgetDatesLists__spoilerContent" slot="content">
          <ul :class="styles.widgetDatesLists__daysList">
            <li v-for="(entry, index) in politicsNormalList" :key="entry.person.name + index"
                :class="styles.widgetDatesLists__dayItem"
            >
              <div :class="styles.widgetDatesLists__date">
                {{ ( entry.type === 'birth' ? entry.person.date_birth : entry.person.date_death )?.split( '-' ).join( '.' ) }}
                <span :class="styles.widgetDatesLists__note">
                  {{ entry.type === 'birth' ? 'д.р.' : 'д.с.' }}
                </span>
              </div>

              <div :class="styles.widgetDatesLists__subTitle">
                {{ entry.person.name }}
              </div>

              <div v-if="entry.person.category || entry.person.note"
                   :class="styles.widgetDatesLists__note"
              >
                {{ [ entry.person.category, entry.person.note ].filter( Boolean ).join( ' · ' ) }}
              </div>
            </li>
          </ul>
        </div>
      </ion-accordion>

    </ion-accordion-group>
  </div>
</template>