<script setup lang="ts">
import {IonContent, IonPage, onIonViewWillEnter} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {appVars} from '@/configApp';
import {contactsBirthdays} from '@/store/contactsStore';
import {syncContacts} from '@/api/getContactsBirthdays';

onIonViewWillEnter( syncContacts );
</script>

<template>
  <ion-page :style="{
              '--brd-custom-theme-color': appVars.colors.contactsBirthdays,
            }"
  >
    <AppHeader page-name="Дни рождения <span class='accent-theme'>из контактов</span>" />

    <ion-content :fullscreen="true" class="ion-padding">
      <ul>
        <li v-for="contact in contactsBirthdays" :key="contact.id">
          {{ contact.name }}, {{ contact.day }}.{{ contact.month }}<template v-if="contact.year">.{{ contact.year }}</template>
        </li>
      </ul>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
