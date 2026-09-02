<script setup lang="ts">

import styles from './widgetReelsOnboarding.module.scss';
import {ref, computed, onMounted, onBeforeUnmount} from 'vue';
import {appVars} from '@/configApp';

import imgPersonalData from '@/assets/img/screenshots/screen-personalData.webp';
import imgChooseAvatar from '@/assets/img/screenshots/screen-choose-avatar.webp';
import imgMainPage from '@/assets/img/screenshots/screen-main-page.webp';
import imgLifeProgress from '@/assets/img/screenshots/screen-life-progress.webp';
import imgAchievement from '@/assets/img/screenshots/screen-achievement.webp';
import imgAchievementDetaled from '@/assets/img/screenshots/screen-achievement-detaled.webp';
import imgDayConception from '@/assets/img/screenshots/screen-dayConception.webp';
import imgChildBirthday from '@/assets/img/screenshots/screen-childBirthday.webp';
import imgFemaleCalendar from '@/assets/img/screenshots/screen-femaleCalendar.webp';
import imgFertilityWindow from '@/assets/img/screenshots/screen-female-fertility-window.webp';
import imgMaleCalendar from '@/assets/img/screenshots/screen-maleCalendar.webp';
import imgBirthdayWish from '@/assets/img/screenshots/screen-birthday-wish.webp';
import imgDonationsSupport from '@/assets/img/screenshots/screen-donations-support.webp';
import imgDonationsThanks from '@/assets/img/screenshots/screen-donations-thanks.webp';

export type TReelSlide = {
  id: string,
  image: string,
  title: string,
  text: string,
  themeColor: string,
};

const SWIPE_THRESHOLD: number = 48; // px

const props = defineProps<{
  startIndex?: number,
  nextLabel?: string,
  finishLabel?: string,
  skipLabel?: string,
  showProgress?: boolean,
  showSkip?: boolean,
}>();

const emit = defineEmits([ 'change', 'skip', 'finish' ]);

const slides: TReelSlide[] = [
  {
    id: 'personalData',
    image: imgPersonalData,
    title: 'Обойдёмся без регистрации',
    text: 'Ни почты, ни пароля — нужна только дата рождения, и то для расчётов. По желанию добавьте имя, годовщину свадьбы, чей-нибудь день рождения и шпаргалку «кто это», чтобы не «э-э-э...» в ответственный момент 🤭',
    themeColor: appVars.colors.dayConception,
  },
  {
    id: 'chooseAvatar',
    image: imgChooseAvatar,
    title: 'Кто будет за вас?',
    text: 'Любой из этих мемов готов стать вашей аватаркой. Не выбирается — есть кубик «Решите за меня». Передумывать можно хоть каждый день 😊',
    themeColor: appVars.colors.dayConception,
  },
  {
    id: 'mainPage',
    image: imgMainPage,
    title: 'Главная держит всё в поле зрения',
    text: 'Сколько дней до вашего дня рождения, кого поздравить следующим, последнее достижение. А ниже есть плитки разделов — загляните во все 👀',
    themeColor: appVars.colors.dayConception,
  },
  {
    id: 'lifeProgress',
    image: imgLifeProgress,
    title: 'Вся жизнь как на ладони',
    text: 'Клетка — неделя, строка — год, вся жизнь на одном экране. Оранжевые не просто так: за ними ваша круглая дата или человек, чья сетка оказалась короче вашей 🎮',
    themeColor: appVars.colors.lifeProgress,
  },
  {
    id: 'achievements',
    image: imgAchievement,
    title: 'Достижения на любой вкус',
    text: 'Возраст, знаменитости и годовщины набегают сами. А борода, диета и спорт считают дни — «15 дней без бритвы» уже звучит солидно 💎',
    themeColor: appVars.colors.achievements,
  },
  {
    id: 'achievementCard',
    image: imgAchievementDetaled,
    title: 'Пять уровней редкости достижений',
    text: 'От обычного до мифического, и у каждого своя рамка. Чем реже достижение, тем ярче светится и тем приятнее поделиться им с друзьями 💜',
    themeColor: appVars.achievementColors.epic,
  },
  {
    id: 'dayConception',
    image: imgDayConception,
    title: 'А всё начиналось примерно тогда',
    text: 'Достаточно даты рождения — посчитаем примерный день зачатия и расскажем, чем он был знаменит: именины, события, знаки зодиака 👀',
    themeColor: appVars.colors.dayConception,
  },
  {
    id: 'childBirthday',
    image: imgChildBirthday,
    title: 'Если ребёнок пока в планах',
    text: 'Выберите желаемый день рождения — покажем примерный день зачатия, ваш возраст к тому моменту и именины малыша. Мы считаем и предполагаем, а советует пусть врач 💗',
    themeColor: appVars.colors.childBirthday,
  },
  {
    id: 'femaleCalendar',
    image: imgFemaleCalendar,
    title: 'Календарь для неё',
    text: 'Нужны всего две вещи: первый день последнего цикла и его средняя продолжительность. По ним посчитаем овуляцию и подскажем, в какие дни шансы выше ❤️',
    themeColor: appVars.colors.femaleCalendar,
  },
  {
    id: 'fertilityWindow',
    image: imgFertilityWindow,
    title: 'Цвет подскажет всё сам',
    text: 'В календаре зелёные дни — наибольшая вероятность зачатия, жёлтые — тоже неплохо, красные — вряд ли. А внизу подсказка, когда примерно родится малыш 🐣',
    themeColor: appVars.colors.femaleCalendar,
  },
  {
    id: 'maleCalendar',
    image: imgMaleCalendar,
    title: 'Календарь для него',
    text: 'Два вопроса, оба деликатные: когда последний раз выпивали и когда была последняя эякуляция. По ним посчитаем день, когда силы будут на пике 😎',
    themeColor: appVars.colors.maleCalendar,
  },
  {
    id: 'birthdayWish',
    image: imgBirthdayWish,
    title: 'Тут вас точно поздравят',
    text: 'В ваш день поздравление откроется само: конфетти, комплименты и случайный гость из зверинца. А кнопка на главной устроит всё то же самое прямо сейчас 🎉',
    themeColor: appVars.colors.dayConception,
  },
  {
    id: 'donationsSupport',
    image: imgDonationsSupport,
    title: 'Ни рекламы, ни платных функций',
    text: 'Если приложение пришлось по душе, его можно поддержать — разово или каждый месяц, сумму выбираете сами. Хомяк обрадуется любой 🐹',
    themeColor: appVars.colors.donations,
  },
  {
    id: 'donationsThanks',
    image: imgDonationsThanks,
    title: 'Эти люди уже помогли',
    text: 'Имя из доната попадает в список благодарностей внутри приложения и приезжает с ближайшим обновлением. На этом экскурсия заканчивается, дальше приложение ваше 💜',
    themeColor: appVars.colors.donations,
  },
];

const currentIndex = ref< number >( 0 );
const pointerStartX = ref< number | null >( null );

const currentSlide = computed< TReelSlide >(() => slides[ currentIndex.value ] );
const isLast = computed< boolean >(() => currentIndex.value === slides.length - 1 );
const progressPercent = computed< number >(() => ( currentIndex.value + 1 ) / slides.length * 100 );

const counter = computed< string >(() => {
  const pad = ( value: number ): string => String( value ).padStart( 2, '0' );

  return pad( currentIndex.value + 1 ) + '/' + pad( slides.length );
});

const goToSlide = ( index: number ): void => {
  if ( index === currentIndex.value || index < 0 || index > slides.length - 1 ) {
    return;
  }

  currentIndex.value = index;

  emit( 'change', currentIndex.value );
};

const onNext = (): void => {
  if ( isLast.value ) {
    emit( 'finish' );

    return;
  }

  goToSlide( currentIndex.value + 1 );
};

const onPrev = (): void => {
  goToSlide( currentIndex.value - 1 );
};

const onSkip = (): void => {
  emit( 'skip' );
};

const onPointerDown = ( event: PointerEvent ): void => {
  pointerStartX.value = event.clientX;
};

const onPointerUp = ( event: PointerEvent ): void => {
  if ( pointerStartX.value === null ) {
    return;
  }

  const shift: number = event.clientX - pointerStartX.value;

  pointerStartX.value = null;

  if ( Math.abs( shift ) < SWIPE_THRESHOLD ) {
    return;
  }

  if ( shift < 0 ) {
    onNext();

    return;
  }

  onPrev();
};

const onPointerCancel = (): void => {
  pointerStartX.value = null;
};

const onKeydown = ( event: KeyboardEvent ): void => {
  if ( event.key === 'ArrowRight' ) {
    onNext();

    return;
  }

  if ( event.key === 'ArrowLeft' ) {
    onPrev();
  }
};

onMounted(() => {
  const start: number = props.startIndex ?? 0;

  currentIndex.value = Math.min( Math.max( start, 0 ), slides.length - 1 );

  window.addEventListener( 'keydown', onKeydown );
});

onBeforeUnmount(() => {
  window.removeEventListener( 'keydown', onKeydown );
});
</script>

<template>
  <div :class="styles.widgetReelsOnboarding"
       :style="{ '--brd-custom-theme-color': currentSlide.themeColor }"
       @pointerdown="onPointerDown"
       @pointerup="onPointerUp"
       @pointercancel="onPointerCancel"
  >
    <div v-if="props.showProgress !== false" :class="styles.widgetReelsOnboarding__progress">
      <div :class="styles.widgetReelsOnboarding__track">
        <div :class="styles.widgetReelsOnboarding__fill"
             :style="{ width: progressPercent + '%' }"
        ></div>
      </div>

      <div :class="styles.widgetReelsOnboarding__counter">
        {{ counter }}
      </div>
    </div>

    <Transition name="brd-fade" mode="out-in">
      <div :key="currentSlide.id" :class="styles.widgetReelsOnboarding__slide">
        <div :class="styles.widgetReelsOnboarding__shot">
          <img :class="styles.widgetReelsOnboarding__image"
               :src="currentSlide.image"
               :alt="currentSlide.title"
               draggable="false"
          >
        </div>

        <div :class="styles.widgetReelsOnboarding__copy">
          <h2 :class="styles.widgetReelsOnboarding__title">
            {{ currentSlide.title }}
          </h2>

          <p :class="styles.widgetReelsOnboarding__text">
            {{ currentSlide.text }}
          </p>
        </div>
      </div>
    </Transition>

    <div :class="styles.widgetReelsOnboarding__actions">
      <button type="button"
              :class="styles.widgetReelsOnboarding__next"
              @click="onNext"
      >
        {{ isLast ? ( props.finishLabel ?? 'Начать' ) : ( props.nextLabel ?? 'Далее' ) }}
      </button>

      <button v-if="!isLast && props.showSkip !== false"
              type="button"
              :class="styles.widgetReelsOnboarding__skip"
              @click="onSkip"
      >
        {{ props.skipLabel ?? 'Пропустить экскурсию' }}
      </button>
    </div>
  </div>
</template>
