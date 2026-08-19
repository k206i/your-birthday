<script setup lang="ts">
import styles from './widgetArtTitle.module.scss';
</script>

<template>
  <div :class="styles.widgetArtTitle">
    <div>
      <slot />
    </div>
  </div>
</template>