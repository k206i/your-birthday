<script setup lang="ts">
import styles from './widgetPageTitleHome.module.scss';

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
        styles.widgetPageTitleHome,
        props.bgImage
      ]"
  >
    <div :class="styles.widgetPageTitleHome__wrapper">
      <h2 :class="styles.widgetPageTitleHome__title"
          v-html="props.title"
      ></h2>

      <div v-if="props.lead || $slots.lead"
           :class="styles.widgetPageTitleHome__titleLead"
      >
        <slot name="lead">
          <span v-html="props.lead"></span>
        </slot>
      </div>

      <div v-if="props.comment || $slots.comment"
           :class="styles.widgetPageTitleHome__titleComment"
      >
        <slot name="comment">
          <span v-html="props.comment"></span>
        </slot>
      </div>

      <router-link v-if="props.link"
                   :to="props.link"
                   :class="styles.widgetPageTitleHome__link">
      </router-link>
    </div>
  </div>
</template>