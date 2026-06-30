<script setup lang="ts">
import styles from './uiDayCard.module.scss';
const props = defineProps<{
  date: Date,
  color?: 'success' | 'warning' | 'error',
}>();
</script>

<template>
  <div :class="[
      styles.uiDayCard,
      props.color && styles[ 'uiDayCard_' + props.color ]
    ]">
    <div>
      {{ props.date.toLocaleDateString( 'ru-RU', { month: 'short' } ).replace( '.', '' ) }}
    </div>

    <div :class="styles.uiDayCard__day">
      {{ props.date.getDate() }}
    </div>

    <div>
      {{ props.date.toLocaleDateString( 'ru-RU', { weekday: 'short' } ) }}
    </div>
  </div>
</template>