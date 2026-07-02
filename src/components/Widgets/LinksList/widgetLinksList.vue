<script setup lang="ts">
import styles from './widgetLinksList.module.scss';
import IconLines from '@/assets/img/svg/icon-lines.svg';

const modules = import.meta.glob('@/assets/img/animals/block_top/*', { eager: true, query: '?url', import: 'default' });
const images = Object.values(modules) as string[];
const artImage = images[Math.floor(Math.random() * images.length)];
</script>

<template>
  <div :class="styles.widgetLinksList">
    <img :class="styles.widgetLinksList__art" :src="artImage" alt="" />

    <div :class="styles.widgetLinksList__title">
      <IconLines />

      ИНТЕРЕСНЫЕ СТАТЬИ

      <IconLines />
    </div>

    <div :class="styles.widgetLinksList__list">
      <slot />
    </div>
  </div>
</template>