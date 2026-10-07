<script setup lang="ts">
import styles from './avatarSetup.module.scss';
import AvatarShort from '@/components/Avatar/Short/avatarShort.vue';
import AvatarPicker from '@/components/Avatar/Picker/avatarPicker.vue';
import {chevronForward} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
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

    <AvatarPicker
        v-model="appStore.userAvatar"
        :is-open="isAvatarSetupModalOpen"
        title="Кто вы сегодня?"
        comment="Выберите персонажа под своё сегодняшнее настроение&nbsp;😋"
        @close="isAvatarSetupModalOpen = false"
    >
      <AvatarShort />
    </AvatarPicker>
  </div>
</template>
