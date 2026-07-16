import { ref } from 'vue';
import type { Ref } from 'vue';
import { App } from '@capacitor/app';
import { formatLocalDate } from '@/composables/localDate';

// Реактивная текущая дата (YYYY-MM-DD).
// new Date() в computed не реактивен, поэтому "сегодня" берём отсюда —
// иначе при открытом приложении новый день никогда не наступит.
export const currentDate: Ref< string > = ref( formatLocalDate( new Date() ));

const updateCurrentDate = () => {
  const newDate: string = formatLocalDate( new Date() );

  if ( newDate !== currentDate.value ) {
    currentDate.value = newDate;
  }
};

// Следим за сменой дня: возврат из фона + проверка раз в минуту
// (в фоне таймеры WebView приостанавливаются, поэтому нужны оба механизма)
export const initCurrentDateWatcher = () => {
  App.addListener( 'appStateChange', ({ isActive }) => {
    if ( isActive ) {
      updateCurrentDate();
    }
  });

  setInterval( updateCurrentDate, 60 * 1000 );
};
