<script setup lang="ts">
import styles from './giftCard.module.scss';

const props = defineProps<{
  header: string,
  text: string,
  art?: string,
}>();
</script>

<template>
  <div :class="styles.giftCard">
    <div :class="styles.giftCard__header">
      {{ props.header }}
    </div>

    <div :class="styles.giftCard__text">
      {{ props.text }}
    </div>

    <img v-if="props.art"
         :class="styles.giftCard__art"
         :src="props.art"
         alt=""
    />
  </div>
</template>
