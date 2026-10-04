import { beforeEach, describe, expect, test, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import WidgetAlert from '@/components/Widgets/Alert/widgetAlert.vue';
import { appStore } from '@/store/appStore';

// Настоящий Transition, а не заглушка test-utils: проверяем, что класс проходит именно сквозь него
const OPTIONS = { global: { stubs: { transition: false } } };

beforeEach(() => {
  appStore.dismissedAlerts = [];
});

describe( 'предупреждение', () => {
  test( 'класс от страницы доходит до корня сквозь анимацию', () => {
    const wrapper = mount( WidgetAlert, { ...OPTIONS, props: { title: 'Заголовок' }, attrs: { class: 'page-block' } });

    expect( wrapper.classes()).toContain( 'page-block' );
  });

  test( 'без своих кнопок остаётся «Ясно, понятно»', () => {
    const wrapper = mount( WidgetAlert, { ...OPTIONS, props: { title: 'Заголовок', dismissName: 'test' } });

    expect( wrapper.text()).toContain( 'Ясно, понятно' );
  });

  test( 'свои кнопки заменяют стандартную и получают функцию закрытия', async () => {
    const onClick = vi.fn(( dismiss: () => void ) => dismiss());
    const wrapper = mount( WidgetAlert, {
      ...OPTIONS,
      props: { title: 'Заголовок', dismissName: 'offer', buttons: [{ text: 'Не, потом', onClick }] },
    });

    expect( wrapper.text()).not.toContain( 'Ясно, понятно' );

    // Тот же текст у обёртки кнопок, а обработчик висит на самой кнопке, она последняя
    await wrapper.findAll( 'div' ).filter( item => item.text() === 'Не, потом' ).at( -1 )?.trigger( 'click' );

    expect( onClick ).toHaveBeenCalledOnce();
    expect( appStore.dismissedAlerts ).toContain( 'offer' );
  });

  test( 'закрытое предупреждение не показывается', () => {
    appStore.dismissedAlerts = [ 'offer' ];

    const wrapper = mount( WidgetAlert, { ...OPTIONS, props: { title: 'Заголовок', dismissName: 'offer' } });

    expect( wrapper.text()).toBe( '' );
  });
});
