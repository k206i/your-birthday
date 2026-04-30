<script setup lang="ts">
import styles from './widgetPageLink.module.scss';

const props = defineProps<{
  title?: string,
  comment?: string,
  color?: string,
  bgImage?: string,
  link: string,
}>();

</script>

<template>
  <div
      :class="[
          styles.widgetPageLink,
          props.bgImage === 'dog-1' && styles.dog1,
          props.bgImage === 'dog-2' && styles.dog2,
          props.bgImage === 'dog-2_questions' && styles.dog2_questions,
        ]"
      :style="`
        background-color: color-mix( in srgb, ${ props.color }, black 79%);
      `"
  >
    <div :class="styles.widgetPageLink__content">
      <div v-if="props.title"
           :class="styles.widgetPageLink__title"
      >
        {{ props.title }}
      </div>

      <div v-if="props.comment"
           :class="styles.widgetPageLink__comment"
           :style="`
              color: ${ props.color };
           `"
      >
        {{ props.comment }}
      </div>
    </div>
    <div
        :class="styles.widgetPageLink__gradient"
        :style="`
          background: linear-gradient( to bottom, transparent 0%, color-mix( in srgb, ${ props.color }, black 79%) 100%);
        `"
    ></div>

    <router-link :to="props.link" :class="styles.widgetPageLink__link"></router-link>
  </div>
</template>