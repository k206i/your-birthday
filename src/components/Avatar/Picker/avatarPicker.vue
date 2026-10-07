<script setup lang="ts">
import styles from './avatarPicker.module.scss';
import {closeCircle} from 'ionicons/icons';
import {IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonModal, IonToolbar} from '@ionic/vue';
import {ref} from 'vue';
import {getAvatarsList, TAvatar} from '@/composables/getAvatarsList';

const props = defineProps<{
  isOpen: boolean,
  modelValue: string, // имя файла аватарки, пусто = не выбрана
  title: string,
  comment: string,
}>();

const emit = defineEmits([ 'update:modelValue', 'close' ]);

const isScaleAvatar = ref( false );

const avatars: TAvatar[] = getAvatarsList();

const changeAvatar = ( name: string ) => {
  isScaleAvatar.value = true;
  emit( 'update:modelValue', name );

  setTimeout(() => {
    isScaleAvatar.value = false;
  }, 150 );
};

const onRandomAvatar = () => {
  // Текущую исключаем, иначе нажатие может «ничего не сделать»
  const available: TAvatar[] = avatars.filter( item => item.name !== props.modelValue );

  if ( !available.length ) {
    return;
  }

  changeAvatar( available[ Math.floor( Math.random() * available.length ) ].name );
};
</script>

<template>
  <ion-modal
      :is-open="props.isOpen"
      keep-contents-mounted="true"
      @did-dismiss="emit( 'close' )"
  >
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="emit( 'close' )">
            Закрыть&nbsp;&nbsp;
            <ion-icon :icon="closeCircle" size="large"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div :class="styles.avatarPicker__modal">

        <div :class="[
            styles.avatarPicker__modalAvatar,
            isScaleAvatar && styles.avatarPicker__modalAvatar_zoomIn,
          ]"
        >
          <slot></slot>
        </div>

        <div :class="styles.avatarPicker__modalTitle">
          {{ props.title }}
        </div>

        <div :class="styles.avatarPicker__modalComment">
          {{ props.comment }}
        </div>

        <div :class="styles.avatarPicker__lightButton"
             @click="onRandomAvatar"
        >
          🎲 Решите за меня. Я не знаю!
        </div>

        <div :class="styles.avatarPicker__avatarsListWrapper">
          <ul :class="styles.avatarPicker__avatarsList">
            <li v-if="$slots.empty"
                :class="[
                  styles.avatarPicker__avatarItem,
                  styles.avatarPicker__avatarItem_empty,
                  !props.modelValue && styles.avatarPicker__avatarItem_active,
                ]"
                @click="changeAvatar( '' )"
            >
              <slot name="empty"></slot>
            </li>

            <li v-for="avatar in avatars"
                :key="avatar.name"
                :class="[
                  styles.avatarPicker__avatarItem,
                  avatar.name === props.modelValue && styles.avatarPicker__avatarItem_active,
                ]"
                @click="changeAvatar( avatar.name )"
            >
              <img :src="avatar.url" alt="" />
            </li>
          </ul>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>
