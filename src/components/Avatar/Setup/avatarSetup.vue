<script setup lang="ts">
import styles from './avatarSetup.module.scss';
import AvatarShort from '@/components/Avatar/Short/avatarShort.vue';
import {chevronForward, closeCircle} from 'ionicons/icons';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonToolbar} from '@ionic/vue';
import {ref} from 'vue';
import {appStore} from '@/store/appStore';
import {getAvatarsList, TAvatar} from '@/composables/getAvatarsList';

const isAvatarSetupModalOpen = ref( false );
const isScaleAvatar = ref( false );

const avatars: TAvatar[] = getAvatarsList();

const changeAvatar = ( name: string ) => {
  isScaleAvatar.value = true;
  appStore.userAvatar = name;

  setTimeout(() => {
    isScaleAvatar.value = false;
  }, 150 );
}

const onSelectAvatar = ( name: string ) => {
  changeAvatar( name );
};

const onRandomAvatar = () => {
  // Текущую исключаем, иначе нажатие может «ничего не сделать»
  const available: TAvatar[] = avatars.filter( item => item.name !== appStore.userAvatar );

  if ( !available.length ) {
    return;
  }

  changeAvatar( available[ Math.floor( Math.random() * available.length ) ].name );
};
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
        <div :class="styles.avatarSetup__modal">

          <div :class="[
              styles.avatarSetup__modalAvatar,
              isScaleAvatar && styles.avatarSetup__modalAvatar_zoomIn,
            ]"
          >
            <AvatarShort />
          </div>

          <div :class="styles.avatarSetup__modalTitle">
            Кто вы сегодня?
          </div>

          <div :class="styles.avatarSetup__modalComment">
            Выберите персонажа под своё сегодняшнее настроение&nbsp;😋
          </div>

          <div :class="styles.avatarSetup__lightButton"
               @click="onRandomAvatar"
          >
            🎲 Решите за меня. Я не знаю!
          </div>

          <div :class="styles.avatarSetup__avatarsListWrapper">
            <ul :class="styles.avatarSetup__avatarsList">
              <li v-for="avatar in avatars"
                  :key="avatar.name"
                  :class="[
                    styles.avatarSetup__avatarItem,
                    avatar.name === appStore.userAvatar && styles.avatarSetup__avatarItem_active,
                  ]"
                  @click="onSelectAvatar( avatar.name )"
              >
                <img :src="avatar.url" alt="" />
              </li>
            </ul>
          </div>
        </div>
      </ion-content>
    </ion-modal>
  </div>
</template>