// Собирает поздравление из шаблона и пулов кусков.
// Куски тянутся один раз на оба варианта заголовка, поэтому ввод имени меняет
// только обращение и не переписывает уже понравившееся пожелание

import giftCardTemplates from '@/jsons/gift_card_templates.json';
import giftCardSlots from '@/jsons/gift_card_slots.json';

type TGiftCardTemplate = {
  id: string,
  tone: string,
  headerWithName: string,
  headerWithoutName: string,
  text: string,
}

export type TGiftCard = {
  id: string,
  headerWithName: string,
  headerWithoutName: string,
  text: string,
}

export type TRenderedGiftCard = {
  header: string,
  text: string,
}

const templates: TGiftCardTemplate[] = giftCardTemplates as TGiftCardTemplate[];
const slots: Record< string, string[] > = giftCardSlots as Record< string, string[] >;

const RECENT_LIMIT: number = 10;
const MAX_TRIES: number = 12;

// Последние выдачи: на небольших пулах случайный выбор охотно повторяется подряд
const recent: string[] = [];

const getSlotNames = ( line: string ): string[] => {
  const found: string[] = line.match( /\{\w+\}/g ) ?? [];

  return found.map( item => item.slice( 1, -1 ));
};

const getRandomItem = ( items: string[] ): string => items[ Math.floor( Math.random() * items.length ) ] ?? '';

// Пул может оказаться короче, чем число слотов в шаблоне — тогда повтор неизбежен
const pickMany = ( pool: string[], amount: number ): string[] => {
  const picked: string[] = [];

  for ( let index: number = 0; index < amount; index++ ) {
    const free: string[] = pool.filter( item => !picked.includes( item ));

    picked.push( getRandomItem( free.length ? free : pool ));
  }

  return picked;
};

// Строки одной части считаем вместе и берём максимум: варианты заголовка
// с именем и без могут быть сформулированы по-разному
const getSlotCounts = ( lines: string[] ): Record< string, number > => {
  const counts: Record< string, number > = {};

  for ( const line of lines ) {
    const seen: Record< string, number > = {};

    for ( const slotName of getSlotNames( line )) {
      seen[ slotName ] = ( seen[ slotName ] ?? 0 ) + 1;
      counts[ slotName ] = Math.max( counts[ slotName ] ?? 0, seen[ slotName ] );
    }
  }

  return counts;
};

const drawValues = ( lines: string[] ): Record< string, string[] > => {
  const values: Record< string, string[] > = {};
  const counts: Record< string, number > = getSlotCounts( lines );

  for ( const slotName of Object.keys( counts )) {
    if ( slotName === 'name' ) {
      continue;
    }

    values[ slotName ] = pickMany( slots[ slotName ] ?? [], counts[ slotName ] );
  }

  return values;
};

const applyValues = ( line: string, values: Record< string, string[] >, name: string ): string => {
  const cursor: Record< string, number > = {};

  return line.replace( /\{(\w+)\}/g, ( match: string, slotName: string ): string => {
    if ( slotName === 'name' ) {
      return name;
    }

    const index: number = cursor[ slotName ] ?? 0;
    cursor[ slotName ] = index + 1;

    return values[ slotName ]?.[ index ] ?? match;
  });
};

// Заголовок и текст тянут куски независимо: общий счётчик выдал бы им
// одно и то же значение, попадись в обеих частях один тип слота.
// В варианте с именем плейсхолдер остаётся на месте — его подставит renderGiftCard
const buildGiftCard = (): TGiftCard => {
  const template: TGiftCardTemplate = templates[ Math.floor( Math.random() * templates.length ) ];
  const headerLines: string[] = [ template.headerWithName, template.headerWithoutName ];
  const headerValues: Record< string, string[] > = drawValues( headerLines );
  const textValues: Record< string, string[] > = drawValues([ template.text ]);

  return {
    id: template.id,
    headerWithName: applyValues( template.headerWithName, headerValues, '{name}' ),
    headerWithoutName: applyValues( template.headerWithoutName, headerValues, '' ),
    text: applyValues( template.text, textValues, '' ),
  };
};

export const generateGiftCard = (): TGiftCard => {
  let giftCard: TGiftCard = buildGiftCard();

  for ( let attempt: number = 1; attempt < MAX_TRIES && recent.includes( giftCard.headerWithoutName + giftCard.text ); attempt++ ) {
    giftCard = buildGiftCard();
  }

  recent.push( giftCard.headerWithoutName + giftCard.text );

  if ( recent.length > RECENT_LIMIT ) {
    recent.shift();
  }

  return giftCard;
};

export const renderGiftCard = ( giftCard: TGiftCard, name: string ): TRenderedGiftCard => {
  const trimmedName: string = name.trim();

  return {
    header: trimmedName ? giftCard.headerWithName.replace( '{name}', trimmedName ) : giftCard.headerWithoutName,
    text: giftCard.text,
  };
};
