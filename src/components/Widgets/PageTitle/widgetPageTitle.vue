<script setup lang="ts">
import styles from './widgetPageTitle.module.scss';

const props = defineProps<{
  color?: string,
  bgImage?: string,
}>();

</script>

<template>
  <div :class="[
      styles.widgetPageTitle,
      props.bgImage
    ]"
       :style="`background-color: color-mix( in srgb, ${ props.color }, black 79%);`"
  >
    <div :class="styles.widgetPageTitle__wrapper">
      <h2 :class="styles.widgetPageTitle__title">
        <slot/>
      </h2>

      <div v-if="!!$slots.lead"
           :class="styles.widgetPageTitle__titleLead"
           :style="`color: ${ props.color };`"
      >
        <slot name="lead" />
      </div>

      <div v-if="!!$slots.comment" :class="styles.widgetPageTitle__titleComment">
        <slot name="comment" />
      </div>
    </div>
  </div>
</template>