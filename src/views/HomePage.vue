<script setup lang="ts">
import styles from './homePage.module.scss';
import { IonContent, IonPage } from '@ionic/vue';
import { Preferences } from '@capacitor/preferences';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {onMounted, ref} from 'vue';
import WidgetPageLink from '@/components/Widgets/PageLink/widgetPageLink.vue';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';

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
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <div id="container">
        <WidgetPageTitle
            :class="styles.homePage__titleWidget"
            bg-image="dog-1_art"
            color="#a876ec"
            :title="`Здравствуйте${ userName ? ', ' + userName : '' }!`"
            lead="До вашего ДР: 365 дней ✨"
            comment="Все важные даты в одном месте 💜"
        />

        <ul :class="styles.homePage__servicesList">
          <li>
            <WidgetPageLink
                link="/dayConception"
                title="День зачатия"
                comment="Какой был праздник в день зачатия?"
                bg-image="dog-2_art"
                color="#a876ec"
            />
          </li>

          <li>
            <WidgetPageLink
                link="/childBirthday"
                title="Планируем дату рождения ребёнка"
                comment="Посмотрим, что будет в этот день?"
                bg-image="cat-1_art"
                color="#ff63f0"
            />
          </li>

          <li>
            <WidgetPageLink
                link="/mensCalendar"
                title="Планирование для мужиков"
                comment="Чо, как?"
                bg-image="dog-4"
                color="#548fd6"
            />
          </li>

          <li>
            <WidgetPageLink
                link="/womensCalendar"
                title="Планирование для девушек"
                comment="Поищем идеальный день ❤️"
                bg-image="cat-1_art"
                color="#f796ff"
            />
          </li>
        </ul>

        <h2>Календарь дат</h2>

        <h2>Для мужиков</h2>
        <p>
          Статья о вреде курения
        </p>

        <h2>Для девушек</h2>
        <p>
          Когда вы хотите родить?<br />
          цикл<br />
          благоприятные для зачатия дни + дата рождения<br />
          дни, когда зачатие маловероятно
        </p>

        <h2>
          Визуализатор жизни
        </h2>
      </div>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>