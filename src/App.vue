<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import {setLastAchievement} from '@/api/setLastAchievement';

setLastAchievement();

</script>

<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
