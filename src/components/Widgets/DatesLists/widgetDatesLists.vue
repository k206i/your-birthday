<script setup lang="ts">
import styles from './widgetDatesLists.module.scss';
import {IonAccordion, IonAccordionGroup, IonItem, IonLabel} from '@ionic/vue';
import type {TGetFamousNamesResponse} from '@/api/getFamousNames';
import {TGetHolidaysNamesResponse} from '@/api/getHolidaysNames';
import {TGetNamesDaysResponse} from '@/api/getDayNames';
import {TGetFamousPoliticsResponse} from '@/api/getFamousPolitics';
import {appVars} from '@/configApp';

const props = defineProps<{
  famousNames?: TGetFamousNamesResponse,
  famousPolitics?: TGetFamousPoliticsResponse,
  holidaysNames?: TGetHolidaysNamesResponse,
  namesDays?: TGetNamesDaysResponse,
  color: string,
}>();
</script>

<template>
  <div :class="styles.widgetDatesLists"
       :style="{
          ['--brd-custom-theme-color']: `color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix })`,
      }"
  >
    <ion-accordion-group expand="inset" :multiple="true">
      <ion-accordion v-if="holidaysNames?.datesNormal" value="datesNormal">
        <ion-item slot="header" color="dark">
          <ion-label>
            Праздники
          </ion-label>
        </ion-item>
        <div :class="styles.widgetDatesLists__spoilerContent" slot="content">
          <ul :class="styles.widgetDatesLists__daysList">
            <li :class="styles.widgetDatesLists__dayItem"
                v-for="(item, index) in holidaysNames?.datesNormal" :key="item.date + index"
            >
              <div :class="styles.widgetDatesLists__date"
                   :style="{
                      color,
                   }"
              >
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
            Именины
          </ion-label>
        </ion-item>
        <div :class="styles.widgetDatesLists__spoilerContent" slot="content">
          <h4>
            Мужские имена
          </h4>
          <ul :class="styles.widgetDatesLists__daysList">
            <slot v-for="(item, index) in namesDays?.nameDayNormal"
                  :key="item.date + index"
            >
              <li v-if="item.male_names.length"
                  :class="styles.widgetDatesLists__dayItem"
              >
                <div :class="styles.widgetDatesLists__date">
                  {{ item.date.split( '-' ).join( '.' ) }}
                </div>
                <div :class="styles.widgetDatesLists__subTitle">
                  {{ item.male_names }}
                </div>
              </li>
            </slot>
          </ul>

          <h4>
            Женские имена
          </h4>
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
                <div :class="styles.widgetDatesLists__subTitle">
                  {{ item.female_names }}
                </div>
              </li>
            </slot>
          </ul>
        </div>
      </ion-accordion>
    </ion-accordion-group>
  </div>
</template>