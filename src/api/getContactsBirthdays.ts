import { App } from '@capacitor/app';
import { CapacitorContacts } from '@capgo/capacitor-contacts';
import type { Contact, ContactsPermissionState } from '@capgo/capacitor-contacts';
import { appStore } from '@/store/appStore';
import { contactsBirthdays, contactsPermission } from '@/store/contactsStore';
import type { TContactBirthday, TContactsPermission } from '@/store/contactsStore';

// blocked: диалог показать нельзя, остаются только настройки телефона
export type TContactsEnableResult = 'enabled' | 'refused' | 'blocked';

// prompt-with-rationale — один отказ уже был, но спросить ещё можно; limited бывает только на iOS
export const toContactsPermission = ( state: ContactsPermissionState ): TContactsPermission => {
  if ( state === 'granted' || state === 'limited' ) {
    return 'granted';
  }

  return state === 'denied' ? 'denied' : 'prompt';
};

export const toContactBirthday = ( contact: Contact ): TContactBirthday | null => {
  const name: string = ( contact.displayName ?? contact.fullName ?? '' ).trim();
  const day: number | undefined = contact.birthday?.day;
  const month: number | undefined = contact.birthday?.month;

  if ( !contact.id || !name || !day || !month || day > 31 || month > 12 ) {
    return null;
  }

  return { id: contact.id, name, month, day, year: contact.birthday?.year };
};

export const checkContactsPermission = async (): Promise< TContactsPermission > => {
  const { readContacts } = await CapacitorContacts.checkPermissions();

  contactsPermission.value = toContactsPermission( readContacts );

  return contactsPermission.value;
};

// Без явного списка плагин запросит и запись, а её в манифесте нет
export const requestContactsPermission = async (): Promise< TContactsPermission > => {
  const { readContacts } = await CapacitorContacts.requestPermissions({ permissions: [ 'readContacts' ] });

  contactsPermission.value = toContactsPermission( readContacts );

  return contactsPermission.value;
};

export const loadContactsBirthdays = async (): Promise< TContactBirthday[] > => {
  const { contacts } = await CapacitorContacts.getContacts({ fields: [ 'id', 'displayName', 'fullName', 'birthday' ] });

  contactsBirthdays.value = contacts
    .map( toContactBirthday )
    .filter(( item ): item is TContactBirthday => item !== null );

  return contactsBirthdays.value;
};

export const disableContacts = (): void => {
  appStore.isContactsEnabled = false;
  contactsBirthdays.value = [];
};

export const enableContacts = async (): Promise< TContactsEnableResult > => {
  let permission: TContactsPermission = await checkContactsPermission();

  if ( permission === 'denied' ) {
    return 'blocked';
  }

  if ( permission === 'prompt' ) {
    permission = await requestContactsPermission();
  }

  if ( permission !== 'granted' ) {
    return 'refused';
  }

  appStore.isContactsEnabled = true;
  await loadContactsBirthdays();

  return 'enabled';
};

export const syncContacts = async (): Promise< void > => {
  if ( !appStore.isContactsEnabled ) {
    return;
  }

  if ( await checkContactsPermission() === 'granted' ) {
    await loadContactsBirthdays();

    return;
  }

  // Доступ отозвали в настройках телефона
  disableContacts();
};

// Полное чтение дорогое, поэтому при возврате в приложение смотрим только на разрешение
export const refreshContacts = async (): Promise< void > => {
  const before: TContactsPermission = contactsPermission.value;

  if ( await checkContactsPermission() !== before ) {
    await syncContacts();
  }
};

export const initContactsWatcher = (): void => {
  syncContacts();

  App.addListener( 'appStateChange', ({ isActive }) => {
    if ( isActive ) {
      refreshContacts();
    }
  });
};

export const openContactsSettings = async (): Promise< void > => {
  try {
    await CapacitorContacts.openSettings();
  } catch {
    // В браузере у плагина нет настроек
  }
};
