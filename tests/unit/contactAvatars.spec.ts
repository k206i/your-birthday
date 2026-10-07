import { beforeEach, describe, expect, test } from 'vitest';
import { appStore } from '@/store/appStore';
import type { TContactBirthday } from '@/store/contactsStore';
import { getContactAvatar, reconcileContactAvatars, setContactAvatar } from '@/api/contactAvatars';

const contact = ( id: string, name: string ): TContactBirthday => ({ id, name, month: 5, day: 12 });

beforeEach(() => {
  appStore.contactAvatars = {};
});

describe( 'аватарки контактов', () => {
  test( 'показывается, когда совпали id и имя', () => {
    setContactAvatar( contact( '1', 'Мама' ), 'cat.webp' );

    expect( getContactAvatar( contact( '1', 'Мама' ))).toBe( 'cat.webp' );
  });

  test( 'не достаётся другому человеку с тем же id', () => {
    setContactAvatar( contact( '1', 'Мама' ), 'cat.webp' );

    expect( getContactAvatar( contact( '1', 'Коллега' ))).toBe( '' );
  });

  test( 'переживает переименование', () => {
    setContactAvatar( contact( '1', 'Мама' ), 'cat.webp' );
    reconcileContactAvatars([ contact( '1', 'Мамуля' ) ]);

    expect( getContactAvatar( contact( '1', 'Мамуля' ))).toBe( 'cat.webp' );
  });

  test( 'переезжает на новый id', () => {
    setContactAvatar( contact( '1', 'Мама' ), 'cat.webp' );
    reconcileContactAvatars([ contact( '42', 'Мама' ) ]);

    expect( getContactAvatar( contact( '42', 'Мама' ))).toBe( 'cat.webp' );
  });

  test( 'у тёзок остаются свои аватарки', () => {
    setContactAvatar( contact( '1', 'Саша' ), 'cat.webp' );
    setContactAvatar( contact( '2', 'Саша' ), 'dog.webp' );
    reconcileContactAvatars([ contact( '1', 'Саша' ), contact( '2', 'Саша' ) ]);

    expect( getContactAvatar( contact( '1', 'Саша' ))).toBe( 'cat.webp' );
    expect( getContactAvatar( contact( '2', 'Саша' ))).toBe( 'dog.webp' );
  });

  test( 'в неоднозначном случае чужая аватарка не появляется', () => {
    // Новый телефон: id 1 достался коллеге, а мама теперь под id 42
    setContactAvatar( contact( '1', 'Мама' ), 'cat.webp' );
    reconcileContactAvatars([ contact( '1', 'Коллега' ), contact( '42', 'Мама' ) ]);

    expect( getContactAvatar( contact( '1', 'Коллега' ))).toBe( '' );
  });
});
