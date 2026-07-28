<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import {watch} from 'vue';
import {appStore} from '@/store/appStore';
import {setLastAchievement} from '@/api/setLastAchievement';

setLastAchievement();

// Пересчёт ачивок при смене даты рождения
watch(() => appStore.userBirthDate, () => setLastAchievement());

</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
