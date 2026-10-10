<script setup lang="ts">
import styles from './contactsBirthdaysPage.module.scss';
import {IonContent, IonIcon, IonPage, onIonViewWillEnter} from '@ionic/vue';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import AvatarContact from '@/components/Avatar/Contact/avatarContact.vue';
import AvatarPicker from '@/components/Avatar/Picker/avatarPicker.vue';
import {appVars} from '@/configApp';
import {appStore} from '@/store/appStore';
import {contactsBirthdays} from '@/store/contactsStore';
import type {TContactBirthday} from '@/store/contactsStore';
import {currentDate} from '@/store/currentDate';
import {syncContacts} from '@/api/getContactsBirthdays';
import {getUpcomingBirthdays} from '@/api/getUpcomingBirthdays';
import {getContactAvatar, setContactAvatar} from '@/api/contactAvatars';
import {formatDayMonth} from '@/composables/localDate';
import {declineUnit} from '@/composables/declineUnit';
import {computed, ref} from 'vue';
import {useRouter} from 'vue-router';
import {syncOutline} from 'ionicons/icons';
import WidgetTipInfo from '@/components/Widgets/TipInfo/widgetTipInfo.vue';

const router = useRouter();

const onCongratulate = ( contact: TContactBirthday ): void => {
  router.push({ path: '/giftCardPage', query: { name: contact.name } });
};

// Контакт не сбрасываем при закрытии, иначе модалка опустеет во время анимации
const pickerContact = ref< TContactBirthday | null >( null );
const isPickerOpen = ref( false );

const pickerAvatar = computed({
  get: (): string => pickerContact.value ? getContactAvatar( pickerContact.value ) : '',
  set: ( avatar: string ): void => {
    if ( !pickerContact.value ) {
      return;
    }

    setContactAvatar( pickerContact.value, avatar );
  },
});

const AVATAR_TIP: string = 'contactAvatarTip';

const isAvatarTipShown = computed(() => !appStore.dismissedAlerts.includes( AVATAR_TIP ));

const onOpenPicker = ( contact: TContactBirthday ): void => {
  pickerContact.value = contact;
  isPickerOpen.value = true;

  if ( isAvatarTipShown.value ) {
    setTimeout(() => {
      appStore.dismissedAlerts.push( AVATAR_TIP );
    }, 600 );
  }
};

// Чтение занимает доли секунды, без минимума вращение иконки не успеют заметить
const SYNC_MIN_DURATION: number = 600; // ms

const isSyncing = ref( false );

const onSync = async (): Promise< void > => {
  if ( isSyncing.value ) {
    return;
  }

  isSyncing.value = true;

  try {
    await Promise.all([
      syncContacts(),
      new Promise( resolve => setTimeout( resolve, SYNC_MIN_DURATION )),
    ]);
  } finally {
    isSyncing.value = false;
  }
};

const upcomingBirthdays = computed(() => getUpcomingBirthdays( contactsBirthdays.value, currentDate.value ));

const birthdaySections = computed(() => {
  const soon = upcomingBirthdays.value.filter( item => item.isSoon );
  const later = upcomingBirthdays.value.filter( item => !item.isSoon );

  return [
    { id: 'soon', title: 'Пора готовить подарки 🎁', items: soon },
    { id: 'later', title: soon.length ? 'Ещё есть время' : '', items: later },
  ].filter( section => section.items.length );
});

// Заголовок первого раздела стоит в одной строке с кнопкой синхронизации
const firstSectionTitle = computed(() => birthdaySections.value[ 0 ]?.title ?? '' );

onIonViewWillEnter( syncContacts );
</script>

<template>
  <ion-page :style="{
              '--brd-custom-theme-color': appVars.colors.contactsBirthdays,
            }"
  >
    <AppHeader page-name="Дни рождения <span class='accent-theme'>контактов</span>" />

    <ion-content :fullscreen="true" class="ion-padding">

      <div :class="styles.contactsBirthdaysPage__titleBlock">
        <div :class="styles.contactsBirthdaysPage__titleContentWrapper">
          <div :class="styles.contactsBirthdaysPage__title">
            Кто следующий задувает свечи?
          </div>

          <div :class="styles.contactsBirthdaysPage__titleComment">
            Прямо из телефонной книги.<br />
            Чем ближе праздник, тем выше в&nbsp;списке&nbsp;🎂
          </div>
        </div>

        <div :class="styles.contactsBirthdaysPage__art"></div>
      </div>

      <WidgetTipInfo v-if="isAvatarTipShown" :color="appVars.colors.contactsBirthdays">
        Аватарку <span :style="{color: appVars.colors.contactsBirthdays}">можно выбрать</span>, нажав на контакт
      </WidgetTipInfo>

      <div :class="styles.contactsBirthdaysPage__listHeader">
        <div v-if="firstSectionTitle" :class="styles.contactsBirthdaysPage__listTitle">
          {{ firstSectionTitle }}
        </div>

        <div :class="styles.contactsBirthdaysPage__sync" @click="onSync">
          <ion-icon :class="[
              styles.contactsBirthdaysPage__syncIcon,
              isSyncing && styles.contactsBirthdaysPage__syncIcon_spin,
            ]"
            :icon="syncOutline"
          ></ion-icon>

          Синхронизировать
        </div>
      </div>

      <template v-for="( section, index ) in birthdaySections" :key="section.id">
        <div v-if="index > 0 && section.title" :class="styles.contactsBirthdaysPage__listTitle">
          {{ section.title }}
        </div>

        <ul :class="styles.contactsBirthdaysPage__contactsList">
          <li v-for="{ contact, date, age, isToday, isSoon } in section.items"
              :key="contact.id"
              :class="styles.contactsBirthdaysPage__contactItem"
              @click="onOpenPicker( contact )"
          >
            <AvatarContact :class="styles.contactsBirthdaysPage__contactImg"
                           :contact="contact"
            />

            <div :class="styles.contactsBirthdaysPage__content">
              <div :class="styles.contactsBirthdaysPage__contactName">
                {{ contact.name }}
              </div>

              <div :class="styles.contactsBirthdaysPage__userComment">
                {{ formatDayMonth( date, isSoon ) }}

                <template v-if="age > 0">
                  · {{ isToday ? 'сегодня исполнилось' : 'исполнится' }} {{ age }} {{ declineUnit( age, 'year' ) }}
                </template>
              </div>
            </div>

            <div v-if="isToday"
                 :class="styles.contactsBirthdaysPage__button"
                 @click.stop="onCongratulate( contact )"
            >
              Поздравить
            </div>
          </li>
        </ul>
      </template>

      <AvatarPicker
          v-model="pickerAvatar"
          :is-open="isPickerOpen"
          :title="pickerContact?.name ?? ''"
          comment="Выберите персонажа, он появится вместо инициалов"
          @close="isPickerOpen = false"
      >
        <AvatarContact v-if="pickerContact"
                       :class="[
                         styles.contactsBirthdaysPage__contactImg,
                         styles.contactsBirthdaysPage__contactImg_large,
                       ]"
                       :contact="pickerContact"
        />

        <template #empty>
          <AvatarContact v-if="pickerContact"
                         :contact="pickerContact"
                         hide-avatar
          />
        </template>
      </AvatarPicker>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
