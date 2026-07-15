<script setup lang="ts">
import styles from './userProfile.module.scss';
import {IonContent, IonPage} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import UiInput from '@/components/Ui/Input/uiInput.vue';
import {appStore} from '@/store/appStore';
</script>

<template>
  <ion-page :class="styles.userProfile">
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <UiInput
          :class="styles.userProfile__field"
          v-model="appStore.userName"
          label="Как вас зовут?"
          placeholder="Введите имя"
      />

      <UiInput
          :class="styles.userProfile__field"
          v-model="appStore.userBirthDate"
          type="date"
          label="Когда у вас день рождения?"
          placeholder="выберите дату"
      />

      --{{ appStore.userName }}--
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
