<script setup lang="ts">
import styles from './avatarSetup.module.scss';
import AvatarShort from '@/components/Avatar/Short/avatarShort.vue';
import {chevronForward, closeCircle} from 'ionicons/icons';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonToolbar} from '@ionic/vue';
import {ref} from 'vue';
import {appStore} from '@/store/appStore';

const isAvatarSetupModalOpen = ref( false );
</script>

<template>
  <div :class="styles.avatarSetup"
       @click="isAvatarSetupModalOpen = true"
  >
    <AvatarShort :class="styles.avatarSetup__avatar" />

    <div>
      <div v-if="appStore.userName">
        {{ appStore.userName }}
      </div>

      <div :class="styles.avatarSetup__link">
        Сменить персонажа
      </div>
    </div>

    <ion-icon :class="styles.avatarSetup__arrow" :icon="chevronForward"></ion-icon>

    <ion-modal
        :is-open="isAvatarSetupModalOpen"
        keep-contents-mounted="true"
        @did-dismiss="isAvatarSetupModalOpen = false"
    >
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="end">
            <ion-button @click="isAvatarSetupModalOpen = false">
              Закрыть&nbsp;&nbsp;
              <ion-icon :icon="closeCircle" size="large"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div>
          <AvatarShort />
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>