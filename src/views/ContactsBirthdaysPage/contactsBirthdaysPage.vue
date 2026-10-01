<script setup lang="ts">
import styles from './contactsBirthdaysPage.module.scss';
import {IonContent, IonPage, onIonViewWillEnter} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {appVars} from '@/configApp';
import {contactsBirthdays} from '@/store/contactsStore';
import type {TContactBirthday} from '@/store/contactsStore';
import {currentDate} from '@/store/currentDate';
import {syncContacts} from '@/api/getContactsBirthdays';
import {getInitials} from '@/composables/getInitials';
import {getColorFromString} from '@/composables/getColorFromString';
import {parseLocalDate} from '@/composables/localDate';
import {declineUnit} from '@/composables/declineUnit';
import {computed} from 'vue';

const WEEKDAY_DAYS: number = 60;

const getNextBirthday = ( contact: TContactBirthday, today: Date ): Date => {
  const date: Date = new Date( today.getFullYear(), contact.month - 1, contact.day );

  if ( date < today ) {
    return new Date( today.getFullYear() + 1, contact.month - 1, contact.day );
  }

  return date;
};

const upcomingBirthdays = computed(() => {
  const today: Date = parseLocalDate( currentDate.value );

  return contactsBirthdays.value
    .map( contact => {
      const date: Date = getNextBirthday( contact, today );

      return {
        contact,
        date,
        age: contact.year ? date.getFullYear() - contact.year : 0,
        isToday: date.getTime() === today.getTime(),
      };
    })
    .sort(( a, b ) => a.date.getTime() - b.date.getTime() );
});

const formatBirthday = ( date: Date ): string => {
  const limit: Date = parseLocalDate( currentDate.value );
  limit.setDate( limit.getDate() + WEEKDAY_DAYS );

  const dayMonth: string = date.toLocaleDateString( 'ru-RU', { day: 'numeric', month: 'long' });

  if ( date > limit ) {
    return dayMonth;
  }

  return `${ dayMonth }, ${ date.toLocaleDateString( 'ru-RU', { weekday: 'short' }) }`;
};

onIonViewWillEnter( syncContacts );
</script>

<template>
  <ion-page :style="{
              '--brd-custom-theme-color': appVars.colors.contactsBirthdays,
            }"
  >
    <AppHeader page-name="Дни рождения <span class='accent-theme'>контактов</span>" />

    <ion-content :fullscreen="true" class="ion-padding">
      <ul :class="styles.contactsBirthdaysPage__contactsList">
        <li v-for="{ contact, date, age, isToday } in upcomingBirthdays"
            :key="contact.id"
            :class="styles.contactsBirthdaysPage__contactItem"
        >
          <div :class="styles.contactsBirthdaysPage__contactPic"
               :style="{ color: getColorFromString( contact.name ) }"
          >
            {{ getInitials( contact.name ) }}
          </div>

          <div :class="styles.contactsBirthdaysPage__content">
            <div :class="styles.contactsBirthdaysPage__contactName">
              {{ contact.name }}
            </div>

            <div :class="styles.contactsBirthdaysPage__userComment">
              {{ formatBirthday( date ) }}

              <template v-if="age > 0">
                · {{ isToday ? 'сегодня исполнилось' : 'исполнится' }} {{ age }} {{ declineUnit( age, 'year' ) }}
              </template>
            </div>
          </div>
        </li>
      </ul>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
