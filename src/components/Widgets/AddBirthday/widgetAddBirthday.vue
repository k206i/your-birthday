<script setup lang="ts">
import styles from './widgetAddBirthday.module.scss';
</script>

<template>
  <div :class="styles.widgetAddBirthday">
    <div :class="styles.widgetAddBirthday__title">
      Здесь появятся ваши достижения
    </div>

    <div :class="styles.widgetAddBirthday__comment">
      Укажите дату рождения — и мы откроем ачивки по прожитым неделям: за возраст, эпоху и кумиров, которых вы обогнали ✨
    </div>
  </div>
</template>