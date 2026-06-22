<script setup lang="ts">
import styles from './widgetTipInfo.module.scss';
import IconBubbleTail from '@/assets/img/svg/icon-bubble-tail.svg?component';

const modules = import.meta.glob('@/assets/img/animals/tip/*', { eager: true, query: '?url', import: 'default' });
const images = Object.values(modules) as string[];
const artImage = images[Math.floor(Math.random() * images.length)];

</script>

<template>
  <div :class="styles.widgetTipInfo">
    <slot />

    <IconBubbleTail :class="styles.widgetTipInfo__tail" />

    <div :class="styles.widgetTipInfo__art"
         :style="{ backgroundImage: `url(${artImage})` }"
    ></div>
  </div>
</template>