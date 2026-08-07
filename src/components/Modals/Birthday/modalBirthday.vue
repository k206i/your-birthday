<script setup lang="ts">
import styles from "./modalBirthday.module.scss";
import {closeCircle} from 'ionicons/icons';
import {IonButton, IonButtons, IonContent, IonFooter, IonIcon, IonModal, IonToolbar} from '@ionic/vue';
import {appStore} from '@/store/appStore';
import {currentDate} from '@/store/currentDate';
import {parseLocalDate} from '@/composables/localDate';
import {declineUnit} from '@/composables/declineUnit';
import {getBirthdayWish, TBirthdayWish} from '@/api/getBirthdayWish';
import {getModalBottomArt} from '@/composables/getModalBottomArt';
import {ref, computed, watch} from 'vue';

const props = defineProps<{
  isOpen: boolean
}>();

const emit = defineEmits([ 'update:isOpen' ]);

// Количество частиц конфетти. Должно совпадать с $confetti-count в modalBirthday.module.scss
const confettiCount: number = 40;
// Количество частиц хлопушек. Должно совпадать с $cannon-count в modalBirthday.module.scss
const cannonCount: number = 60;
// Хлопушки стреляют один раз, поэтому слой пересоздаётся при каждом открытии
const cannonKey = ref( 0 );

const wish = ref< TBirthdayWish | null >( null );
const art = ref< string >( getModalBottomArt() );

// При каждом открытии показываем новое поздравление и новый арт
watch(() => props.isOpen, ( value ) => {
  if ( value ) {
    wish.value = getBirthdayWish();
    art.value = getModalBottomArt();
    cannonKey.value++;
  }
}, { immediate: true });

// Полных лет на текущую дату
const age = computed(() => {
  if ( !appStore.userBirthDate ) {
    return null;
  }

  const birth: Date = parseLocalDate( appStore.userBirthDate );
  const today: Date = parseLocalDate( currentDate.value );

  let years: number = today.getFullYear() - birth.getFullYear();
  const lastBirthday: Date = new Date( birth );
  lastBirthday.setFullYear( birth.getFullYear() + years );

  if ( lastBirthday > today ) {
    years--;
  }

  return years;
});

const close = () => {
  emit( 'update:isOpen', false );
};
</script>

<template>
  <ion-modal
      :is-open="props.isOpen"
      @did-dismiss="close"
      :class="styles.modalBirthday"
  >
    <ion-content>
      <div :class="styles.modalBirthday__contentWrapper">
        <div :class="styles.modalBirthday__confetti" aria-hidden="true">
          <span
              v-for="index in confettiCount"
              :key="index"
              :class="styles.modalBirthday__confettiItem"
          ></span>
        </div>

        <div
            :key="cannonKey"
            :class="styles.modalBirthday__cannon"
            aria-hidden="true"
        >
          <span
              v-for="index in cannonCount"
              :key="index"
              :class="styles.modalBirthday__cannonItem"
          ></span>
        </div>

        <div :class="styles.modalBirthday__blurWrapper">
        <div :class="styles.modalBirthday__title">
          С днём<br />
          рождения<span v-if="appStore.userName">,<br />
            <span :class="styles.modalBirthday__accent">{{appStore.userName}}</span>
          </span>!
        </div>


          <div :class="styles.modalBirthday__text">
            <template v-if="age !== null">
              <span :class="styles.modalBirthday__accent">
                {{ age }} {{ declineUnit( age, 'year' ) }}
              </span>
              —
            </template>

            {{ wish?.text }}
          </div>

          <div :class="styles.modalBirthday__wish">
            {{ wish?.wish }}
          </div>
        </div>

        <img :class="styles.modalBirthday__art"
             :src="art"
             alt=""
        />
      </div>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button @click="close">
            Закрыть&nbsp;&nbsp;
            <ion-icon :icon="closeCircle" size="large"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-footer>
  </ion-modal>
</template>
