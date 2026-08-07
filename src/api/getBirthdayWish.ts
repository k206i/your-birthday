// Случайное поздравление на день рождения. Уже показанные не повторяются,
// пока не будут выданы все — после этого круг начинается заново

import birthdayWishes from '@/jsons/birthday_wishes.json';
import { appStore } from '@/store/appStore';

export type TBirthdayWish = {
  id: string,
  text: string,
  wish: string,
}

export const getBirthdayWish = (): TBirthdayWish => {
  const wishes: TBirthdayWish[] = birthdayWishes as TBirthdayWish[];
  let available: TBirthdayWish[] = wishes.filter( item => !appStore.usedWishIds.includes( item.id ));

  // Все поздравления показаны — начинаем круг заново
  if ( !available.length ) {
    appStore.usedWishIds = [];
    available = wishes;
  }

  const wish: TBirthdayWish = available[ Math.floor( Math.random() * available.length ) ];
  appStore.usedWishIds = [ ...appStore.usedWishIds, wish.id ];

  return wish;
}
