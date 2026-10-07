<script setup lang="ts">
import styles from './avatarShort.module.scss';
import {personOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
import {computed} from 'vue';
import {appStore} from '@/store/appStore';
import {getAvatarUrl} from '@/composables/getAvatarsList';

const props = defineProps<{
  avatar?: string, // имя файла; без него показываем аватарку пользователя со ссылкой в профиль
}>();

const isUserAvatar = computed(() => props.avatar === undefined );

const avatarName = computed(() => isUserAvatar.value ? appStore.userAvatar : props.avatar );

// undefined, если аватарка не выбрана или её файла больше нет в сборке: тогда показываем слот вместо битой картинки
const avatarUrl = computed(() => avatarName.value ? getAvatarUrl( avatarName.value ) : undefined );
</script>

<template>
  <div :class="[
      styles.avatarShort,
      isUserAvatar && styles.avatarShort_user,
    ]"
  >
    <template v-if="avatarUrl">
      <div :class="styles.avatarShort__artClip">
        <img :class="styles.avatarShort__art" :src="avatarUrl" alt="" />
      </div>

      <img :class="[ styles.avatarShort__art, styles.avatarShort__art_top ]"
           :src="avatarUrl"
           alt=""
      />
    </template>

    <slot v-else>
      <ion-icon :class="styles.avatarShort__icon" :icon="personOutline"></ion-icon>
    </slot>

    <router-link v-if="isUserAvatar" to="/userProfile" :class="styles.avatarShort__link"></router-link>
  </div>
</template>
