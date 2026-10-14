import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { Capacitor } from '@capacitor/core';
import type { PermissionState } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { appStore } from '@/store/appStore';
import { contactsBirthdays } from '@/store/contactsStore';
import type { TContactBirthday } from '@/store/contactsStore';
import { getUpcomingBirthdays } from '@/api/getUpcomingBirthdays';
import { formatLocalDate, parseLocalDate } from '@/composables/localDate';

export type TRemindersPermission = 'granted' | 'denied' | 'prompt';

// blocked: диалог показать нельзя, остаются только настройки телефона
export type TRemindersEnableResult = 'enabled' | 'refused' | 'blocked';

export type TReminderInput = {
  userBirthDate: string, // YYYY-MM-DD или пусто
  additionalName: string,
  additionalBirthDate: string, // YYYY-MM-DD или пусто
  contacts: TContactBirthday[],
}

export type TReminder = {
  id: number,
  at: Date,
  title: string,
  body: string,
}

const REMINDER_HOUR: number = 10;
const CHANNEL_ID: string = 'birthdays';
const OWN_ID_OFFSET: number = 1000000000;
const SYNC_DELAY: number = 1000; // ms, чтобы не перепланировать на каждую букву имени
const TEST_REMINDER_ID: number = 1;
const TEST_REMINDER_DELAY: number = 10000; // ms, чтобы успеть свернуть приложение

export const remindersPermission: Ref< TRemindersPermission > = ref( 'prompt' );

const toBirthday = ( id: string, name: string, dateString: string ): TContactBirthday | null => {
  if ( !dateString ) {
    return null;
  }

  const date: Date = parseLocalDate( dateString );

  return { id, name, month: date.getMonth() + 1, day: date.getDate() };
};

const getDayId = ( date: Date ): number => {
  return date.getFullYear() * 10000 + ( date.getMonth() + 1 ) * 100 + date.getDate();
};

const getReminderTime = ( date: Date ): Date => {
  return new Date( date.getFullYear(), date.getMonth(), date.getDate(), REMINDER_HOUR );
};

const joinNames = ( names: string[] ): string => {
  return names.length === 1 ? names[ 0 ] : `${ names.slice( 0, -1 ).join( ', ' ) } и ${ names[ names.length - 1 ] }`;
};

// Имена только в именительном падеже: склонять произвольные имена из контактов надёжно не выйдет
const getOthersText = ( names: string[] ): Pick< TReminder, 'title' | 'body' > => {
  if ( names.length === 1 ) {
    return { title: `🎂 Сегодня празднует ${ names[ 0 ] }`, body: 'Самое время поздравить' };
  }

  return { title: '🎂 Сегодня празднуют сразу несколько человек', body: `${ joinNames( names ) }. Самое время поздравить` };
};

export const buildReminders = ( input: TReminderInput, now: Date ): TReminder[] => {
  const today: string = formatLocalDate( now );
  const reminders: TReminder[] = [];
  const own: TContactBirthday | null = toBirthday( 'own', '', input.userBirthDate );

  if ( own ) {
    const [ { date } ] = getUpcomingBirthdays([ own ], today );

    reminders.push({
      id: getDayId( date ) + OWN_ID_OFFSET,
      at: getReminderTime( date ),
      title: 'С днём рождения! 🎉',
      body: 'Сегодня ваш день. Поздравление уже ждёт в приложении',
    });
  }

  const additional: TContactBirthday | null = input.additionalName
    ? toBirthday( 'additional', input.additionalName, input.additionalBirthDate )
    : null;
  const people: TContactBirthday[] = additional ? [ ...input.contacts, additional ] : input.contacts;
  const days: Map< number, { date: Date, names: string[] } > = new Map();

  for ( const { contact, date } of getUpcomingBirthdays( people, today )) {
    const id: number = getDayId( date );
    const day = days.get( id ) ?? { date, names: [] };

    // Близкий человек может быть и в контактах с той же датой
    if ( !day.names.includes( contact.name )) {
      day.names.push( contact.name );
    }

    days.set( id, day );
  }

  for ( const [ id, { date, names } ] of days ) {
    reminders.push({ id, at: getReminderTime( date ), ...getOthersText( names ) });
  }

  return reminders
    .filter( reminder => reminder.at > now )
    .sort(( a, b ) => a.at.getTime() - b.at.getTime() );
};

export const getReminderInput = (): TReminderInput => ({
  userBirthDate: appStore.userBirthDate,
  additionalName: appStore.additionalName,
  additionalBirthDate: appStore.additionalBirthDate,
  contacts: appStore.isContactsEnabled ? contactsBirthdays.value : [],
});

// prompt-with-rationale — один отказ уже был, но спросить ещё можно
const toRemindersPermission = ( state: PermissionState ): TRemindersPermission => {
  if ( state === 'granted' ) {
    return 'granted';
  }

  return state === 'denied' ? 'denied' : 'prompt';
};

export const checkRemindersPermission = async (): Promise< TRemindersPermission > => {
  const { display } = await LocalNotifications.checkPermissions();

  remindersPermission.value = toRemindersPermission( display );

  return remindersPermission.value;
};

const requestRemindersPermission = async (): Promise< TRemindersPermission > => {
  const { display } = await LocalNotifications.requestPermissions();

  remindersPermission.value = toRemindersPermission( display );

  return remindersPermission.value;
};

const createRemindersChannel = (): Promise< void > => {
  return LocalNotifications.createChannel({
    id: CHANNEL_ID,
    name: 'Дни рождения',
    description: 'Напоминания в день рождения',
    importance: 3,
  });
};

const cancelPendingReminders = async (): Promise< void > => {
  const { notifications } = await LocalNotifications.getPending();

  if ( !notifications.length ) {
    return;
  }

  await LocalNotifications.cancel({ notifications: notifications.map(({ id }) => ({ id })) });
};

const runSync = async (): Promise< void > => {
  await cancelPendingReminders();

  if ( !appStore.isRemindersEnabled ) {
    return;
  }

  // Разрешение отозвали в настройках телефона
  if ( await checkRemindersPermission() !== 'granted' ) {
    appStore.isRemindersEnabled = false;

    return;
  }

  const reminders: TReminder[] = buildReminders( getReminderInput(), new Date() );

  if ( !reminders.length ) {
    return;
  }

  await createRemindersChannel();

  await LocalNotifications.schedule({
    notifications: reminders.map( reminder => ({
      id: reminder.id,
      title: reminder.title,
      body: reminder.body,
      channelId: CHANNEL_ID,
      schedule: { at: reminder.at, allowWhileIdle: true },
    })),
  });
};

let syncQueue: Promise< void > = Promise.resolve();

// Очередь: снятие и постановка от двух вызовов подряд не должны перемешаться
export const syncReminders = (): Promise< void > => {
  if ( !Capacitor.isNativePlatform()) {
    return Promise.resolve();
  }

  syncQueue = syncQueue
    .then( runSync )
    .catch(() => {
      // Сбой плагина не должен останавливать следующие синхронизации
    });

  return syncQueue;
};

export const enableReminders = async (): Promise< TRemindersEnableResult > => {
  if ( !Capacitor.isNativePlatform()) {
    appStore.isRemindersEnabled = true;

    return 'enabled';
  }

  let permission: TRemindersPermission = await checkRemindersPermission();

  if ( permission === 'denied' ) {
    return 'blocked';
  }

  if ( permission === 'prompt' ) {
    permission = await requestRemindersPermission();
  }

  if ( permission !== 'granted' ) {
    return 'refused';
  }

  appStore.isRemindersEnabled = true;

  return 'enabled';
};

export const disableReminders = (): void => {
  appStore.isRemindersEnabled = false;
};

// Для отладочной панели: ближайшее уведомление из расписания, но через несколько секунд
export const showTestReminder = async (): Promise< void > => {
  if ( !Capacitor.isNativePlatform()) {
    return;
  }

  if ( await checkRemindersPermission() !== 'granted' && await requestRemindersPermission() !== 'granted' ) {
    return;
  }

  const [ nearest ] = buildReminders( getReminderInput(), new Date() );

  await createRemindersChannel();

  await LocalNotifications.schedule({
    notifications: [{
      id: TEST_REMINDER_ID,
      title: nearest?.title ?? '🎂 Тестовое уведомление',
      body: nearest?.body ?? 'Дней рождения пока нет',
      channelId: CHANNEL_ID,
      schedule: { at: new Date( Date.now() + TEST_REMINDER_DELAY ), allowWhileIdle: true },
    }],
  });
};

export const initRemindersWatcher = ( onReminderTap: () => void ): void => {
  if ( !Capacitor.isNativePlatform()) {
    return;
  }

  let timer: ReturnType< typeof setTimeout > | undefined;

  watch(
    () => [
      appStore.isRemindersEnabled,
      appStore.isContactsEnabled,
      appStore.userBirthDate,
      appStore.additionalName,
      appStore.additionalBirthDate,
      contactsBirthdays.value,
    ],
    () => {
      clearTimeout( timer );
      timer = setTimeout( syncReminders, SYNC_DELAY );
    },
    { immediate: true },
  );

  LocalNotifications.addListener( 'localNotificationActionPerformed', onReminderTap );
};
