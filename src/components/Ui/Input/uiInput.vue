<script setup lang="ts">
import styles from './uiInput.module.scss';
import {IonInput} from '@ionic/vue';
import type {InputCustomEvent} from '@ionic/vue';
import {ref, watch} from 'vue';

const props = defineProps<{
  modelValue?: string | number,
  placeholder?: string,
  label?: string,
  type?: 'text' | 'date' | 'number' | 'password' | 'email' | 'tel',
}>();

const emit = defineEmits([ 'update:modelValue' ]);
const inputValue = ref( props.modelValue );

const onInput = ( event: InputCustomEvent ) => {
  emit( 'update:modelValue', event.detail.value ?? '' );
};

watch(() => props.modelValue, ( value ) => {
  inputValue.value = value;
});
</script>

<template>
  <div :class="styles.uiInput">
    <ion-input
        :class="styles.uiInput__input"
        :type="props.type"
        :placeholder="placeholder"
        :label="props.label"
        label-placement="floating"
        fill="solid"
        v-model="inputValue"
        @ionInput="onInput"
    ></ion-input>
  </div>
</template>
