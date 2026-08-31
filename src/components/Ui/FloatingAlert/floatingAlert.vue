<script setup lang="ts">
import styles from './floatingAlert.module.scss';
import {appVars} from '@/configApp';
import {watch, onUnmounted} from 'vue';

const props = defineProps<{
  isOpen: boolean,
}>();

const emit = defineEmits<{
  'update:isOpen': [ value: boolean ],
}>();

let timerId: ReturnType< typeof setTimeout > | null = null;

const clearTimer = () => {
  if ( timerId !== null ) {
    clearTimeout( timerId );
    timerId = null;
  }
};

const onClose = () => {
  clearTimer();
  emit( 'update:isOpen', false );
};

// Сброс в начале: без него таймер предыдущего показа закрыл бы новый алерт раньше срока
watch(() => props.isOpen, ( value ) => {
  clearTimer();

  if ( value ) {
    timerId = setTimeout( onClose, appVars.floatingAlertTimer * 1000 );
  }
}, { immediate: true });

onUnmounted( clearTimer );
</script>

<template>
  <!-- Телепорт в body: внутри ion-page всплывашку перекрывал футер -->
  <Teleport to="body">
    <div :class="[
          styles.floatingAlert,
          props.isOpen && styles.floatingAlert_isOpen
        ]"
         @click="onClose"
    >
      <div>
      <slot />
      </div>
    </div>
  </Teleport>
</template>
