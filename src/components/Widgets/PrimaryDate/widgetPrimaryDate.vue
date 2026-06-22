<script setup lang="ts">
import styles from './widgetPrimaryDate.module.scss';

const props = defineProps<{
  title: string
  date: string,
  comment?: string,
  bgImage: string,
}>();
</script>
<template>
  <div :class="styles.widgetPrimaryDate">
    <div :class="styles.widgetPrimaryDate__contentWrapper">
      <div :class="styles.widgetPrimaryDate__title">
        {{ title }}
      </div>

      <div :class="styles.widgetPrimaryDate__date">
        {{ date }}
      </div>

      <div v-if="comment" :class="styles.widgetPrimaryDate__comment">
        {{ comment }}
      </div>
    </div>

    <div :class="[
          styles.widgetPrimaryDate__art,
          props.bgImage
        ]"
    ></div>
  </div>
</template>