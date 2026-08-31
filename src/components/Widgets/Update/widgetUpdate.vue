<script setup lang="ts">
import styles from './widgetUpdate.module.scss';
import {ref, computed, onMounted} from 'vue';
import {Browser} from '@capacitor/browser';
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

// Прямая ссылка на apk даёт загрузку сразу; страница релиза — запасной путь
const onOpen = async (): Promise< void > => {
  if ( release.value ) {
    await Browser.open({ url: release.value.apkUrl || release.value.url });
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
          <div @click="onOpen" :class="styles.widgetUpdate__button">
            Ура! Скачать<span v-if="sizeLabel" :class="styles.widgetUpdate__small"> ({{ sizeLabel }})</span>!
          </div>

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
