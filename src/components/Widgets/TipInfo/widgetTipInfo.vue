<script setup lang="ts">
import styles from './widgetTipInfo.module.scss';
import IconBubbleTail from '@/assets/img/svg/icon-bubble-tail.svg?component';
</script>

<template>
  <div :class="styles.widgetTipInfo">
    <slot />
    <IconBubbleTail :class="styles.widgetTipInfo__tail" />
  </div>
</template>