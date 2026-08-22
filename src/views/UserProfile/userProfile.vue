<script setup lang="ts">
import styles from './userProfile.module.scss';
import {IonContent, IonPage} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import UiInput from '@/components/Ui/Input/uiInput.vue';
import {appStore} from '@/store/appStore';
import AvatarSetup from '@/components/Avatar/Setup/avatarSetup.vue';
</script>

<template>
  <ion-page :class="styles.userProfile">
    <AppHeader page-name="Ваши <span class='accent-theme'>настройки</span>" />

    <ion-content :fullscreen="true" class="ion-padding">
      <div :class="styles.userProfile__block">
        <AvatarSetup />
      </div>

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
          Семья
        </div>

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.weddingDate"
            type="date"
            label="Когда вы поженились?"
            placeholder="выберите дату"
        />

        <div :class="styles.userProfile__blockComment">
          Откроем достижения по годовщинам — от ситцевой до золотой&nbsp;💍
        </div>
      </div>

      <div :class="styles.userProfile__block">
        <div :class="styles.userProfile__blockLabel">
          Не забыть поздравить
        </div>

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.additionalName"
            label="Имя того, кого поздравить"
            placeholder="Введите имя или солнышко, зайка 🥰"
        />

        <UiInput
            :class="styles.userProfile__field"
            v-model="appStore.additionalBirthDate"
            type="date"
            label="Когда день рождения?"
        />

        <div :class="styles.userProfile__blockComment">
          Напомним за 3 дня, чтобы вы успели подготовиться 🎁
        </div>
      </div>

      <div :class="styles.userProfile__block">
        <div :class="styles.userProfile__blockLabel">
          На всякий случай, чтобы не забыть как зовут 🤭
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

        <div :class="styles.userProfile__blockComment">
          Чтобы не «э-э-э...» в ответственный момент 🥶
        </div>
      </div>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
