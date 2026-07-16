<script setup lang="ts">
import styles from './widgetPageTitle.module.scss';

const props = defineProps<{
  title: string,
  lead?: string,
  comment?: string,
  bgImage?: string,
  link?: string,
}>();

</script>

<template>
  <div :class="[
        styles.widgetPageTitle,
        props.bgImage
      ]"
  >
    <div :class="styles.widgetPageTitle__wrapper">
      <h2 :class="styles.widgetPageTitle__title">
        {{ props.title }}
      </h2>

      <div v-if="props.lead || $slots.lead"
           :class="styles.widgetPageTitle__titleLead"
      >
        <slot name="lead">
          <span v-html="props.lead"></span>
        </slot>
      </div>

      <div v-if="props.comment || $slots.comment"
           :class="styles.widgetPageTitle__titleComment"
      >
        <slot name="comment">
          <span v-html="props.comment"></span>
        </slot>
      </div>

      <router-link v-if="props.link"
                   :to="props.link"
                   :class="styles.widgetPageTitle__link">
      </router-link>
    </div>
  </div>
</template>