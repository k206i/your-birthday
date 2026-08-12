<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import {watch} from 'vue';
import {appStore} from '@/store/appStore';
import {currentDate} from '@/store/currentDate';
import {setLastAchievement} from '@/api/setLastAchievement';

setLastAchievement();

// Пересчёт ачивок при смене даты рождения
watch(() => appStore.userBirthDate, () => setLastAchievement());

// Смена суток: без этого стрик не растёт при открытом приложении
watch( currentDate, () => setLastAchievement());

// Запуск и сброс стриков
watch(() => appStore.beardStreakStart, () => setLastAchievement());
watch(() => appStore.dietStreakStart, () => setLastAchievement());

</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
