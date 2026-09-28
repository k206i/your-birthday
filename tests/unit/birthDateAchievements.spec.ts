import { beforeEach, describe, expect, test } from 'vitest';
import { appStore } from '@/store/appStore';
import { syncBirthDateAchievements } from '@/api/syncBirthDateAchievements';

const sync = ( birthDate: string ): void => {
  appStore.userBirthDate = birthDate;
  syncBirthDateAchievements();
};

describe( 'ачивки по дате рождения', () => {
  beforeEach(() => {
    appStore.specialAchievements = {};
    appStore.userBirthDate = '';
  });

  test( 'последний день СССР засчитывается', () => {
    sync( '1991-12-25' );

    expect( appStore.specialAchievements.special_ussrBorn ).toBeDefined();
  });

  test( 'день роспуска СССР уже не засчитывается', () => {
    sync( '1991-12-26' );

    expect( appStore.specialAchievements.special_ussrBorn ).toBeUndefined();
  });

  test( 'год полёта Гагарина даёт обе ачивки', () => {
    sync( '1961-04-12' );

    expect( appStore.specialAchievements.special_ussrBorn ).toBeDefined();
    expect( appStore.specialAchievements.special_gagarinBorn ).toBeDefined();
  });

  test( 'соседние с 1961 годы Гагарина не дают', () => {
    sync( '1960-12-31' );
    expect( appStore.specialAchievements.special_gagarinBorn ).toBeUndefined();

    sync( '1962-01-01' );
    expect( appStore.specialAchievements.special_gagarinBorn ).toBeUndefined();
  });

  test( 'последний пионерский год засчитывается, следующий уже нет', () => {
    sync( '1979-12-31' );
    expect( appStore.specialAchievements.special_pioneer ).toBeDefined();

    sync( '1980-01-01' );
    expect( appStore.specialAchievements.special_pioneer ).toBeUndefined();
  });

  test( 'вся советская лесенка выдаётся вместе', () => {
    sync( '1976-05-19' );

    expect( appStore.specialAchievements.special_octobrist ).toBeDefined();
    expect( appStore.specialAchievements.special_pioneer ).toBeDefined();
    expect( appStore.specialAchievements.special_komsomol ).toBeDefined();
    expect( appStore.specialAchievements.special_ussrBorn ).toBeDefined();
  });

  test( 'до комсомола не дожили, пионер остаётся', () => {
    sync( '1978-06-01' );

    expect( appStore.specialAchievements.special_pioneer ).toBeDefined();
    expect( appStore.specialAchievements.special_komsomol ).toBeUndefined();
  });

  test( 'последний комсомольский год засчитывается, следующий уже нет', () => {
    sync( '1976-12-31' );
    expect( appStore.specialAchievements.special_komsomol ).toBeDefined();

    sync( '1977-01-01' );
    expect( appStore.specialAchievements.special_komsomol ).toBeUndefined();
  });

  test( 'до пионеров не дожили, октябрёнок остаётся', () => {
    sync( '1981-06-01' );

    expect( appStore.specialAchievements.special_octobrist ).toBeDefined();
    expect( appStore.specialAchievements.special_pioneer ).toBeUndefined();
  });

  test( 'последний октябрятский год засчитывается, следующий уже нет', () => {
    sync( '1982-12-31' );
    expect( appStore.specialAchievements.special_octobrist ).toBeDefined();

    sync( '1983-01-01' );
    expect( appStore.specialAchievements.special_octobrist ).toBeUndefined();
  });

  test( 'современная дата не даёт ничего', () => {
    sync( '2005-06-01' );

    expect( appStore.specialAchievements ).toEqual({});
  });

  test( 'исправление даты отзывает выданное', () => {
    sync( '1961-04-12' );
    sync( '2005-06-01' );

    expect( appStore.specialAchievements ).toEqual({});
  });

  test( 'пустая дата отзывает выданное', () => {
    sync( '1961-04-12' );
    sync( '' );

    expect( appStore.specialAchievements ).toEqual({});
  });

  test( 'ачивки за действия не трогаются', () => {
    appStore.specialAchievements.special_dev = '2026-09-28';
    sync( '2005-06-01' );

    expect( appStore.specialAchievements.special_dev ).toBe( '2026-09-28' );
  });
});
