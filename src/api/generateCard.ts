// Собирает поздравление из шаблона и пулов кусков.
// Куски тянутся один раз на оба варианта строки, поэтому ввод имени меняет
// только обращение и не переписывает уже понравившееся пожелание

import cardTemplates from '@/jsons/card_templates.json';
import cardSlots from '@/jsons/card_slots.json';

type TCardTemplate = {
  id: string,
  tone: string,
  withName: string,
  withoutName: string,
}

export type TCard = {
  id: string,
  withName: string,
  withoutName: string,
}

const templates: TCardTemplate[] = cardTemplates as TCardTemplate[];
const slots: Record< string, string[] > = cardSlots as Record< string, string[] >;

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

// Сколько кусков нужно на слот, считаем по обоим вариантам строки: с именем и без
// шаблон может быть сформулирован по-разному
const getSlotCounts = ( template: TCardTemplate ): Record< string, number > => {
  const counts: Record< string, number > = {};

  for ( const line of [ template.withName, template.withoutName ]) {
    const seen: Record< string, number > = {};

    for ( const slotName of getSlotNames( line )) {
      seen[ slotName ] = ( seen[ slotName ] ?? 0 ) + 1;
      counts[ slotName ] = Math.max( counts[ slotName ] ?? 0, seen[ slotName ] );
    }
  }

  return counts;
};

const drawValues = ( template: TCardTemplate ): Record< string, string[] > => {
  const values: Record< string, string[] > = {};
  const counts: Record< string, number > = getSlotCounts( template );

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

// В варианте с именем плейсхолдер остаётся на месте: имя подставит renderCard,
// когда пользователь его введёт или поменяет
const buildCard = (): TCard => {
  const template: TCardTemplate = templates[ Math.floor( Math.random() * templates.length ) ];
  const values: Record< string, string[] > = drawValues( template );

  return {
    id: template.id,
    withName: applyValues( template.withName, values, '{name}' ),
    withoutName: applyValues( template.withoutName, values, '' ),
  };
};

export const generateCard = (): TCard => {
  let card: TCard = buildCard();

  for ( let attempt: number = 1; attempt < MAX_TRIES && recent.includes( card.withoutName ); attempt++ ) {
    card = buildCard();
  }

  recent.push( card.withoutName );

  if ( recent.length > RECENT_LIMIT ) {
    recent.shift();
  }

  return card;
};

export const renderCard = ( card: TCard, name: string ): string => {
  const trimmedName: string = name.trim();

  if ( !trimmedName ) {
    return card.withoutName;
  }

  return card.withName.replace( '{name}', trimmedName );
};
