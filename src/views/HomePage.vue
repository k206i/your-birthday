<script setup lang="ts">
import styles from './homePage.module.scss';
import { IonContent, IonPage } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import WidgetPageLink from '@/components/Widgets/widgetPageLink.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {onMounted, ref} from 'vue';

const userName = ref();

onMounted(async () => {
  // await Preferences.set({
  //   key: 'userName',
  //   value: 'Павел'
  // });

  userName.value = (await Preferences.get({key: 'userName'})).value;

  // Удаление
    // await Preferences.remove({ key: 'userName' });

  // Проверка существования
  //   const { keys } = await Preferences.keys();
  //   console.log(keys); // ['userName', ...]

  // Очистка всех данных
  //   await Preferences.clear();
});
</script>

<template>
  <ion-page :class="styles.homePage">
    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container">
        <div :class="styles.homePage__titleWidget">
          <h2 :class="styles.homePage__title">
            Здравствуйте<slot v-if="userName">, {{ userName }}</slot>!
          </h2>

          <div :class="styles.homePage__titleLead">
            До вашего ДР: 365 дней ✨
          </div>

          <div :class="styles.homePage__titleComment">
            Все важные даты в одном месте 💜
          </div>
        </div>

        <ul :class="styles.homePage__servicesList">
          <li>
            <WidgetPageLink
                link="/dayConception"
                title="День вашего зачатия"
                comment="Какой был праздник в день вашего зачатия?"
                bg-image="dog-2_questions"
                color="#a876ec"
            />
          </li>

          <li>
            <WidgetPageLink
                link="/dayConception"
                title="Дата рождения ребёнка"
                comment="Посмотрим, что будет в этот день?"
                bg-image="dog-1"
                color="#c75a99"
            />
          </li>
        </ul>

        <h2>Календарь дат</h2>

        <h2>Для мужиков</h2>
        <p>
          Мастурбация
        </p>

        <h2>Для девушек</h2>
        <p>
          Когда вы хотите родить?<br />
          цикл<br />
          благоприятные для зачатия дни + дата рождения<br />
          дни, когда зачатие маловероятно
        </p>

        <strong>TEST app?</strong>
        <p>Start with Ionic <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>