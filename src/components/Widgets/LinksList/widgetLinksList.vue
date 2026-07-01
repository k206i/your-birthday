<script setup lang="ts">
import styles from './widgetLinksList.module.scss';
import IconLines from '@/assets/img/svg/icon-lines.svg';
</script>

<template>
  <div :class="styles.widgetLinksList">
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