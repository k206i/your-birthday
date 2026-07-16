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
      <div :class="styles.userProfile__block">
        <div :class="styles.userProfile__blockLabel">
          Обо мне
        </div>

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
      </div>

      <div :class="styles.userProfile__block">
        <div :class="styles.userProfile__blockLabel">
          Не забыть поздравить
        </div>

        <div :class="styles.userProfile__blockComment">
          Напомним заранее, чтобы вы успели подготовиться 🎁
        </div>

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.additionalName"
            label="Кого поздравить?"
            placeholder="Введите имя"
        />

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.additionalBirthDate"
            type="date"
            label="Когда день рождения?"
            placeholder="выберите дату"
        />
      </div>

      <div :class="styles.userProfile__block">
        <div :class="styles.userProfile__blockLabel">
          На всякий случай, чтобы не забыть как зовут 🤭
        </div>

        <div :class="styles.userProfile__blockComment">
          Чтобы не «э-э-э...» в ответственный момент 🥶
        </div>

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.rememberedPersonTitle"
            label="Кто это?"
            placeholder="Тёща, Тесть, Невестка, Начальник..."
        />

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.rememberedPersonName"
            label="Как зовут?"
            placeholder="Лучше имя, и не прозвище 😅"
        />
      </div>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
