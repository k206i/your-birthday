<script setup lang="ts">
import styles from './widgetUpdate.module.scss';
import {ref, computed, onMounted} from 'vue';
import {getLatestRelease, TRelease} from '@/api/getLatestRelease';
import {compareVersions} from '@/composables/compareVersions';
import {informationCircleOutline} from 'ionicons/icons';
import {IonIcon} from '@ionic/vue';
import {appStore} from '@/store/appStore';

const appVersion: string = __APP_VERSION__;

const release = ref< TRelease | null >( null );

onMounted( async () => {
  const latest: TRelease | null = await getLatestRelease();

  if ( latest && compareVersions( latest.version, appVersion ) > 0 ) {
    release.value = latest;
  }
});

const sizeLabel = computed(() => {
  const size: number = release.value?.apkSize ?? 0;

  return size ? `${ Math.round( size / 1024 / 1024 * 10 ) / 10 } МБ` : null;
});

// Имя закрытия с версией: следующий релиз даст новое имя и предупреждение вернётся
const dismissName = computed(() => release.value ? `update_${ release.value.version }` : '' );

const isDismissed = computed(() => !!dismissName.value && appStore.dismissedAlerts.includes( dismissName.value ));

const onClose = () => {
  if ( dismissName.value && !isDismissed.value ) {
    appStore.dismissedAlerts.push( dismissName.value );
  }
};
</script>

<template>
  <div v-if="release && !isDismissed" :class="styles.widgetUpdate">
    <div :class="styles.widgetUpdate__contentWrapper">
      <ion-icon
          :class="styles.widgetUpdate__icon"
          :icon="informationCircleOutline"
          size="large"
      ></ion-icon>

      <div :class="styles.widgetUpdate__content">
        <div :class="styles.widgetUpdate__title">
          Приложение обновилось до&nbsp;версии&nbsp;{{ release.version }}, у&nbsp;вас пока {{ appVersion }}
        </div>


        <div :class="styles.widgetUpdate__buttonWrapper">
          <!-- Ссылка, а не обработчик: Custom Tab не доводит загрузку apk до конца,
               а target="_blank" Capacitor отдаёт системному браузеру -->
          <a :href="release.apkUrl || release.url"
             target="_blank"
             rel="noopener"
             :class="styles.widgetUpdate__button"
          >
            Ура! Скачать<span v-if="sizeLabel" :class="styles.widgetUpdate__small"> ({{ sizeLabel }})</span>!
          </a>

          <div @click="onClose" :class="[
              styles.widgetUpdate__button,
              styles.widgetUpdate__button_light
              ]"
          >
            Не, потом
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
