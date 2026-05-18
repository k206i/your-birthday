<script setup lang="ts">
import styles from './widgetPageTitle.module.scss';
import {appVars} from '@/configApp';

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
       :style="`background-color: color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix });`"
  >
    <div :class="styles.widgetPageTitle__wrapper">
      <h2 :class="styles.widgetPageTitle__title"
          :style="`text-shadow: 1px 1px 6px color-mix( in srgb, ${ props.color }, black ${ appVars.colorMix });`"
      >
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