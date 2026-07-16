import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { restoreAppStore } from '@/store/appStore';
import { initCurrentDateWatcher } from '@/store/currentDate';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import './assets/styles/reset.scss';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* @import '@ionic/vue/css/palettes/dark.always.css'; */
/* @import '@ionic/vue/css/palettes/dark.class.css'; */
// import '@ionic/vue/css/palettes/dark.system.css';
import '@ionic/vue/css/palettes/dark.always.css'

/* Theme variables */
import './assets/fonts/fonts.scss';
import './assets/styles/backgrounds.css';
import './assets/styles/variables.css';
import './assets/styles/vars.scss';
import './assets/styles/transitions.scss';
import './assets/styles/main.scss';
import './assets/styles/article.scss';

const app = createApp(App)
  .use(IonicVue)
  .use(router);

initCurrentDateWatcher();

Promise.all([ router.isReady(), restoreAppStore() ]).then(() => {
  app.mount('#app');
});
