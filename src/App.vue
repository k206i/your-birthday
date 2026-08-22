<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import {watch} from 'vue';
import {appStore} from '@/store/appStore';
import {currentDate} from '@/store/currentDate';
import {setLastAchievement} from '@/api/setLastAchievement';
import {getStreakStarts} from '@/api/getAchievementDate';

setLastAchievement();

// Пересчёт ачивок при смене даты рождения
watch(() => appStore.userBirthDate, () => setLastAchievement());

// Дата свадьбы открывает шкалу годовщин
watch(() => appStore.weddingDate, () => setLastAchievement());

// Смена суток: без этого стрик не растёт при открытом приложении
watch( currentDate, () => setLastAchievement());

// Запуск и сброс любого стрика
watch( getStreakStarts, () => setLastAchievement());

</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
