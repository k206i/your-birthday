// Особые ачивки, которые выводятся из даты рождения, а не зарабатываются действием.
import { appStore } from '@/store/appStore';
import { grantSpecialAchievement } from '@/api/grantSpecialAchievement';
import { setLastAchievement } from '@/api/setLastAchievement';

type TBirthDateAchievement = {
  id: string,
  isEarned: ( birthDate: string ) => boolean, // birthDate в формате YYYY-MM-DD
}

const BIRTH_DATE_ACHIEVEMENTS: TBirthDateAchievement[] = [
  { id: 'special_ussrBorn', isEarned: birthDate => birthDate < '1991-12-26' },
  { id: 'special_gagarinBorn', isEarned: birthDate => birthDate.slice( 0, 4 ) === '1961' },
  { id: 'special_octobrist', isEarned: birthDate => birthDate < '1983-01-01' },
  { id: 'special_pioneer', isEarned: birthDate => birthDate < '1980-01-01' },
  { id: 'special_komsomol', isEarned: birthDate => birthDate < '1977-01-01' },
];

const revokeSpecialAchievement = ( id: string ): void => {
  if ( !appStore.specialAchievements[ id ] ) {
    return;
  }

  delete appStore.specialAchievements[ id ];
  setLastAchievement();
};

export const syncBirthDateAchievements = (): void => {
  const birthDate: string = appStore.userBirthDate;

  for ( const item of BIRTH_DATE_ACHIEVEMENTS ) {
    if ( birthDate && item.isEarned( birthDate )) {
      grantSpecialAchievement( item.id );

      continue;
    }

    revokeSpecialAchievement( item.id );
  }
};
