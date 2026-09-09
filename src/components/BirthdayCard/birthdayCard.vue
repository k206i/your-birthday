<script setup lang="ts">
import styles from './birthdayCard.module.scss';

const props = defineProps<{
  text: string,
  art?: string,
}>();
</script>

<template>
  <div :class="styles.birthdayCard">
    <div :class="styles.birthdayCard__text">
      {{ props.text }}
    </div>

    <img v-if="props.art"
         :class="styles.birthdayCard__art"
         :src="props.art"
         alt=""
    />
  </div>
</template>
