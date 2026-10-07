import { appStore } from '@/store/appStore';
import type { TContactAvatar } from '@/store/appStore';
import type { TContactBirthday } from '@/store/contactsStore';
import { hashString } from '@/composables/hashString';

// Хеш вместо имени: на диск не должно попадать ничего из контактов
export const getNameHash = ( name: string ): string => {
  return hashString( name ).toString( 36 );
};

// Сверяем и имя: id может достаться другому человеку
export const getContactAvatar = ( contact: TContactBirthday ): string => {
  const saved: TContactAvatar | undefined = appStore.contactAvatars[ contact.id ];

  if ( !saved || saved.nameHash !== getNameHash( contact.name )) {
    return '';
  }

  return saved.avatar;
};

export const setContactAvatar = ( contact: TContactBirthday, avatar: string ): void => {
  if ( !avatar ) {
    delete appStore.contactAvatars[ contact.id ];

    return;
  }

  appStore.contactAvatars[ contact.id ] = { nameHash: getNameHash( contact.name ), avatar };
};

export const reconcileContactAvatars = ( contacts: TContactBirthday[] ): void => {
  if ( !contacts.length ) {
    return;
  }

  const contactById: Map< string, TContactBirthday > = new Map( contacts.map( item => [ item.id, item ] ));
  const nameHashes: string[] = contacts.map( item => getNameHash( item.name ));

  for ( const [ id, saved ] of Object.entries( appStore.contactAvatars )) {
    const contact: TContactBirthday | undefined = contactById.get( id );

    if ( contact ) {
      // Переименовали: id прежний, а старого имени в книге больше нет
      if ( !nameHashes.includes( saved.nameHash )) {
        saved.nameHash = getNameHash( contact.name );
      }

      continue;
    }

    // Сменился id: переносим к единственному тёзке, у которого ещё нет своей аватарки
    const namesakes: TContactBirthday[] = contacts.filter( item => getNameHash( item.name ) === saved.nameHash );

    if ( namesakes.length === 1 && !appStore.contactAvatars[ namesakes[ 0 ].id ] ) {
      appStore.contactAvatars[ namesakes[ 0 ].id ] = saved;
      delete appStore.contactAvatars[ id ];
    }
  }
};
