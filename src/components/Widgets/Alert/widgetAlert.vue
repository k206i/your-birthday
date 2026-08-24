<script setup lang="ts">
import styles from './widgetAlert.module.scss';
import {warningOutline, informationCircleOutline, alertCircleOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
import {computed} from 'vue';
import {appStore} from '@/store/appStore';

const props = defineProps<{
  title: string,
  comment?: string,
  type?: 'warning' | 'error' | 'info',
  dismissName?: string,
}>();

const isDismissed = computed(() => !!props.dismissName && appStore.dismissedAlerts.includes( props.dismissName ));

const onDismiss = () => {
  if ( props.dismissName && !appStore.dismissedAlerts.includes( props.dismissName )) {
    appStore.dismissedAlerts.push( props.dismissName );
  }
}
</script>

<template>
  <div v-if="!isDismissed"
      :class="[
        styles.widgetAlert,
        props.type === 'info' && styles.widgetAlert_info,
        props.type === 'warning' && styles.widgetAlert_warning,
        props.type === 'error' && styles.widgetAlert_error,
      ]"
  >
    <div :class="styles.widgetAlert__contentWrapper">
      <ion-icon
          v-if="props.type === 'info'"
          :class="styles.widgetAlert__icon"
          :icon="informationCircleOutline"
          size="large"
      ></ion-icon>
      <ion-icon
          v-else-if="props.type === 'warning'"
          :class="styles.widgetAlert__icon"
          :icon="warningOutline"
          size="large"
      ></ion-icon>
      <ion-icon
          v-else-if="props.type === 'error'"
          :class="styles.widgetAlert__icon"
          :icon="alertCircleOutline"
          size="large"
      ></ion-icon>

      <div :class="styles.widgetAlert__content">
        <div :class="styles.widgetAlert__title">
          {{ props.title }}
        </div>

        <div v-if="props.comment"
             :class="styles.widgetAlert__comment"
        >
          {{ props.comment }}
        </div>

        <div v-if="props.dismissName"
             @click="onDismiss"
             :class="styles.widgetAlert__buttonWrapper"
        >
          <div :class="styles.widgetAlert__button">
            Ясно, понятно
          </div>
        </div>
      </div>
    </div>
  </div>
</template>