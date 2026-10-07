<script setup lang="ts">
import AvatarShort from '@/components/Avatar/Short/avatarShort.vue';
import {computed} from 'vue';
import {getColorFromString} from '@/composables/getColorFromString';
import {getInitials} from '@/composables/getInitials';
import {getContactAvatar} from '@/api/contactAvatars';
import type {TContactBirthday} from '@/store/contactsStore';

const props = defineProps<{
  contact: TContactBirthday,
  hideAvatar?: boolean, // только инициалы, даже если аватарка выбрана
}>();

const color = computed(() => getColorFromString( props.contact.name ));
</script>

<template>
  <AvatarShort :avatar="props.hideAvatar ? '' : getContactAvatar( props.contact )"
               :style="{ color, '--brd-avatar-color': color }"
  >
    {{ getInitials( props.contact.name ) }}
  </AvatarShort>
</template>
