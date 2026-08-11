<script setup lang="ts">
import styles from './avatarShort.module.scss';
import {personOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
import {computed} from 'vue';
import {appStore} from '@/store/appStore';
import {getAvatarUrl} from '@/composables/getAvatarsList';

// undefined, если аватарка не выбрана или сохранённого файла больше нет в сборке —
// в обоих случаях показываем иконку вместо битой картинки
const avatarUrl = computed(() => appStore.userAvatar ? getAvatarUrl( appStore.userAvatar ) : undefined );
</script>

<template>
  <div :class="styles.avatarShort">
    <template v-if="avatarUrl">
      <div :class="styles.avatarShort__artClip">
        <img :class="styles.avatarShort__art" :src="avatarUrl" alt="" />
      </div>

      <img :class="[ styles.avatarShort__art, styles.avatarShort__art_top ]"
           :src="avatarUrl"
           alt=""
      />
    </template>

    <ion-icon v-else :icon="personOutline"></ion-icon>

    <router-link to="/userProfile" :class="styles.avatarShort__link"></router-link>
  </div>
</template>
