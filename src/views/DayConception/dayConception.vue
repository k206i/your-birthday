<script setup lang="ts">
import styles from './dayConception.module.scss';
import {IonContent, IonPage, IonDatetime, IonAccordion, IonAccordionGroup, IonItem, IonLabel} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {ref, computed, watch} from 'vue';
import {getHolidaysNames, TGetHolidaysNamesResponse} from '@/api/getHolidaysNames';
import {getNamesDays, TGetNamesDaysResponse} from '@/api/getDayNames';
import {appVars} from '@/configApp';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';

const selectedDate = ref();
const holidaysNames = ref< TGetHolidaysNamesResponse >();
const namesDays = ref< TGetNamesDaysResponse >();
const conceptionDay = ref();
const birthDay = ref();

const formattedDate = computed(() => {
  if ( !selectedDate.value ) {
    return '';
  }
  return selectedDate.value.split('T')[0];
});


watch(formattedDate, async () => {
  const datePayload: Date = new Date( selectedDate.value );
  datePayload.setDate( datePayload.getDate() - appVars.pregnancyDuration );

  conceptionDay.value = datePayload.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  birthDay.value = new Date( formattedDate.value ).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  holidaysNames.value = await getHolidaysNames( datePayload );
  namesDays.value = await getNamesDays( datePayload );
});
</script>

<template>
  <ion-page :class="styles.dayConception">
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">

      <WidgetPageTitle
          bg-image="dog-2"
          color="#a876ec"
          title="Вы знаете дату рождения?"
          lead="Давайте посчитаем примерную дату зачатия 💫"
          comment="И посмотрим, какое событие было в этот день 🤭"
      />

      <p>Выберите дату рождения:</p>

      <ion-datetime
          v-model="selectedDate"
          locale="ru-RU"
          presentation="date"
          :show-default-buttons="true"
          done-text="Готово" cancel-text="Не, отмена"
      ></ion-datetime>
      <Transition name="brd-fade">
        <h3 v-if="formattedDate">
          Выбранный день рождения: <span class="accent">{{ birthDay }}</span>
        </h3>
      </Transition>

      <Transition name="brd-fade">
        <div v-if="conceptionDay">
          <h3>
            Расчётная дата зачатия: <span class="accent">{{ conceptionDay }}</span>
          </h3>
          <p>
            Праздники в расчётный день:
          </p>
          <p v-if="!holidaysNames?.datesNow.length">
            Праздников в этот день нет
          </p>
          <ul v-else :class="styles.dayConception__daysList">
            <li :class="styles.dayConception__dayItem"
                v-for="(item, index) in holidaysNames?.datesNow" :key="item.date + index"
            >
              <div :class="styles.dayConception__date">
                {{ item.date.split( '-' ).join( '.' ) }}
              </div>
              <div :class="styles.dayConception__subTitle">
                {{ item.name }}
              </div>
              <div :class="styles.dayConception__note">
                {{ item.note }}
              </div>
            </li>
          </ul>
          <p>
            Именины в расчётный день: <br />
            {{ namesDays?.nameDayNow }}
          </p>
        </div>
      </Transition>

      <Transition name="brd-fade">
        <div v-if="holidaysNames?.datesNormal"
             :class="styles.dayConception__spoilersGroup"
        >
          <h4>
            При нормальном сроке беременности (37-42 недель)
          </h4>

          <ion-accordion-group expand="inset" :multiple="true">
            <ion-accordion v-if="holidaysNames?.datesNormal" value="datesNormal">
              <ion-item slot="header" color="dark">
                <ion-label>
                  Праздники
                </ion-label>
              </ion-item>
              <div :class="styles.dayConception__spoilerContent" slot="content">
                <ul :class="styles.dayConception__daysList">
                  <li :class="styles.dayConception__dayItem"
                      v-for="(item, index) in holidaysNames?.datesNormal" :key="item.date + index"
                  >
                    <div :class="styles.dayConception__date">
                      {{ item.date.split( '-' ).join( '.' ) }}
                    </div>
                    <div :class="styles.dayConception__subTitle">
                      {{ item.name }}
                    </div>
                    <div :class="styles.dayConception__note">
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
              <div :class="styles.dayConception__spoilerContent" slot="content">
                <h4>
                  Мужские имена
                </h4>
                <ul :class="styles.dayConception__daysList">
                  <slot v-for="(item, index) in namesDays?.nameDayNormal"
                        :key="item.date + index"
                  >
                    <li v-if="item.male_names.length"
                        :class="styles.dayConception__dayItem"
                    >
                      <div :class="styles.dayConception__date">
                        {{ item.date.split( '-' ).join( '.' ) }}
                      </div>
                      <div :class="styles.dayConception__subTitle">
                        {{ item.male_names }}
                      </div>
                    </li>
                  </slot>
                </ul>

                <h4>
                  Женские имена
                </h4>
                <ul :class="styles.dayConception__daysList">
                  <slot v-for="(item, index) in namesDays?.nameDayNormal"
                        :key="item.date + index"
                  >
                    <li v-if="item.female_names.length"
                        :class="styles.dayConception__dayItem"
                    >
                      <div :class="styles.dayConception__date">
                        {{ item.date.split( '-' ).join( '.' ) }}
                      </div>
                      <div :class="styles.dayConception__subTitle">
                        {{ item.female_names }}
                      </div>
                    </li>
                  </slot>
                </ul>
              </div>
            </ion-accordion>
          </ion-accordion-group>
        </div>
      </Transition>

      <Transition name="brd-fade">
        <div v-if="holidaysNames?.datesAfter"
             :class="styles.dayConception__spoilersGroup"
        >
          <h4>
            При запоздалых родах (43-44 недели)
          </h4>

          <ion-accordion-group expand="inset" :multiple="true">
            <ion-accordion v-if="holidaysNames?.datesAfter" value="datesAfter">
              <ion-item slot="header" color="dark">
                <ion-label>
                  Праздники
                </ion-label>
              </ion-item>
              <div :class="styles.dayConception__spoilerContent" slot="content">
                <ul :class="styles.dayConception__daysList">
                  <li :class="styles.dayConception__dayItem"
                      v-for="(item, index) in holidaysNames?.datesAfter" :key="item.date + index"
                  >
                    <div :class="styles.dayConception__date">
                      {{ item.date.split( '-' ).join( '.' ) }}
                    </div>
                    <div :class="styles.dayConception__subTitle">
                      {{ item.name }}
                    </div>
                    <div :class="styles.dayConception__note">
                      {{ item.note }}
                    </div>
                  </li>
                </ul>
              </div>
            </ion-accordion>
          </ion-accordion-group>
        </div>
      </Transition>

      <Transition name="brd-fade">
        <div v-if="holidaysNames?.datesBefore"
             :class="styles.dayConception__spoilersGroup"
        >
          <h4>
            при преждевременных родах (35-36 недель)
          </h4>

          <ion-accordion-group expand="inset" :multiple="true">
            <ion-accordion v-if="holidaysNames?.datesBefore" value="datesBefore">
              <ion-item slot="header" color="dark">
                <ion-label>
                  Праздники
                </ion-label>
              </ion-item>
              <div :class="styles.dayConception__spoilerContent" slot="content">
                <ul :class="styles.dayConception__daysList">
                  <li :class="styles.dayConception__dayItem"
                      v-for="(item, index) in holidaysNames?.datesBefore" :key="item.date + index"
                  >
                    <div :class="styles.dayConception__date">
                      {{ item.date.split( '-' ).join( '.' ) }}
                    </div>
                    <div :class="styles.dayConception__subTitle">
                      {{ item.name }}
                    </div>
                    <div :class="styles.dayConception__note">
                      {{ item.note }}
                    </div>
                  </li>
                </ul>
              </div>
            </ion-accordion>
          </ion-accordion-group>
        </div>
      </Transition>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>