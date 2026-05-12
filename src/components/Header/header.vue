<script setup lang="ts">
import {IonHeader, IonToolbar, IonButtons, IonBackButton } from '@ionic/vue';
import { arrowBack } from 'ionicons/icons';
import styles from './header.module.scss';
</script>

<template>
  <ion-header :class="styles.header">
    <ion-toolbar>
      <ion-buttons slot="start" class="ion-padding">
        <ion-back-button text="" defaultHref="/" :icon="arrowBack" ></ion-back-button>
      </ion-buttons>

      <div :class="styles.header__title">
        <div>
          <slot>
            День <span class="accent">рождения</span>
          </slot>
        </div>
      </div>
      <ion-buttons :collapse="true" slot="end">
        O
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>