// Собирает news.json из веб-витрины телеграм-канала.
//
// Зависимостей нет — только встроенные fs и fetch, поэтому в CI не нужен npm ci.
// Соскабливание живёт здесь, а не в приложении: сломается вёрстка у Telegram —
// упадёт прогон, а пользователи увидят вчерашние новости вместо пустого экрана.

import fs from 'node:fs';

const CHANNEL = 'dayofbirth';
const LIMIT = 10;
const MAX_PAGES = 4;
const OUT_FILE = 'news.json';

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

// Текст поста лежит в div, внутри которого встречаются вложенные div,
// поэтому границу ищем счётчиком, а не регуляркой
const extractText = ( block ) => {
  const start = block.search( /<div class="tgme_widget_message_text js-message_text"[^>]*>/ );

  if ( start < 0 ) {
    return '';
  }

  let index = block.indexOf( '>', start ) + 1;
  let depth = 1;
  let out = '';

  while ( index < block.length && depth > 0 ) {
    if ( block.startsWith( '<div', index )) {
      depth++;
    } else if ( block.startsWith( '</div>', index )) {
      depth--;

      if ( !depth ) {
        break;
      }
    }

    out += block[ index ];
    index++;
  }

  return out;
};

const decode = ( html ) => html
  .replace( /<br\s*\/?>/gi, '\n' )
  .replace( /<[^>]+>/g, '' )
  .replace( /&nbsp;/g, ' ' )
  .replace( /&quot;/g, '"' )
  .replace( /&#39;/g, '\'' )
  .replace( /&laquo;/g, '«' )
  .replace( /&raquo;/g, '»' )
  .replace( /&mdash;/g, '—' )
  .replace( /&amp;/g, '&' )
  .replace( /&lt;/g, '<' )
  .replace( /&gt;/g, '>' )
  .replace( /[ \t]+\n/g, '\n' )
  .trim();

const parsePage = ( html ) => {
  return html
    .split( /(?=<div class="tgme_widget_message[ "][^>]*data-post=")/ )
    .filter( block => block.includes( 'data-post="' ))
    .map( block => ({
      id: ( block.match( new RegExp( `data-post="${ CHANNEL }/(\\d+)"` )) ?? [] )[ 1 ],
      date: ( block.match( /datetime="(\d{4}-\d{2}-\d{2})/ ) ?? [] )[ 1 ],
      text: decode( extractText( block )),
      image: ( block.match( /tgme_widget_message_photo_wrap[\s\S]{0,300}?(https:\/\/cdn\d*\.telesco\.pe\/file\/[^'")\s]+)/ ) ?? [] )[ 1 ] ?? null,
    }))
    // Посты с альбомом вложений витрина отдаёт без текста — они бы дали пустую карточку
    .filter( item => item.id && item.date && item.text );
};

const getPostIds = ( html ) => {
  const found = html.match( new RegExp( `data-post="${ CHANNEL }/(\\d+)"`, 'g' )) ?? [];

  return found.map( item => Number( item.match( /\d+/ )[ 0 ] ));
};

const humanDate = ( iso ) => {
  const [ , month, day ] = iso.split( '-' ).map( Number );

  return `${ day } ${ MONTHS[ month - 1 ] }`;
};

// Заголовок — первая строка или первое предложение, что короче
const toRecord = ( post ) => {
  const full = post.text.replace( /^Сегодня /, `${ humanDate( post.date ) } ` );
  const marks = [ full.search( /\n/ ), full.search( /\.\s/ ) ].filter( index => index > 0 );
  const cut = marks.length ? Math.min( ...marks ) : full.length;

  return {
    id: post.id,
    date: post.date,
    title: full.slice( 0, cut ).replace( /\.$/, '' ).trim(),
    text: full.slice( cut ).replace( /^[.\s]+/, '' ).trim(),
    image: post.image,
    url: `https://t.me/${ CHANNEL }/${ post.id }`,
  };
};

const collect = async () => {
  const posts = [];
  let before = null;

  for ( let page = 0; page < MAX_PAGES && posts.length < LIMIT; page++ ) {
    const url = `https://t.me/s/${ CHANNEL }${ before ? `?before=${ before }` : '' }`;
    const response = await fetch( url );

    if ( !response.ok ) {
      throw new Error( `${ url } ответил ${ response.status }` );
    }

    const html = await response.text();
    const parsed = parsePage( html );
    const fresh = parsed.filter( item => !posts.some( known => known.id === item.id ));

    if ( !fresh.length ) {
      break;
    }

    posts.unshift( ...fresh );
    before = Math.min( ...getPostIds( html ));
  }

  return posts;
};

// Обёртка, а не await на верхнем уровне: линтер проекта разбирает файлы как ES2020
const main = async () => {
  const posts = await collect();

  if ( !posts.length ) {
    throw new Error( 'Не удалось разобрать ни одного поста — похоже, изменилась вёрстка витрины' );
  }

  const news = posts.slice( -LIMIT ).reverse().map( toRecord );

  fs.writeFileSync( OUT_FILE, `${ JSON.stringify( news, null, 2 ) }\n` );

  console.log( `${ OUT_FILE }: записей ${ news.length }, с картинкой ${ news.filter( item => item.image ).length }` );
};

main().catch(( error ) => {
  console.error( error.message );
  process.exit( 1 );
});
