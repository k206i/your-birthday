import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ru.kliukin.birthdaydate',
  appName: 'День рождения',
  webDir: 'dist',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_cake',
      iconColor: '#A876EC',
    },
  },
};

export default config;
