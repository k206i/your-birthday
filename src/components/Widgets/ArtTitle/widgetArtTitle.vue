<script setup lang="ts">
import styles from './widgetArtTitle.module.scss';
</script>

<template>
  <div :class="styles.widgetArtTitle">
    <h1>
      <slot />
    </h1>
  </div>
</template>