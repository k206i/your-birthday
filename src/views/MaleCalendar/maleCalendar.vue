<script setup lang="ts">
import styles from './maleCalendar.module.scss';
import stylesArtButton from '@/assets/styles/artButton.module.scss';
import stylesOverflowSection from '@/assets/styles/overflowSection.module.scss';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {IonContent, IonPage, IonIcon, IonModal, IonDatetime, IonHeader, IonToolbar, IonButtons, IonButton} from '@ionic/vue';
import { chevronForwardCircleOutline, closeCircle } from 'ionicons/icons';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import {ref, watch, computed, nextTick} from 'vue';
import {appVars} from '@/configApp';
import {parseLocalDate, formatLocalDate, formatDisplayDate} from '@/composables/localDate';
import {currentDate} from '@/store/currentDate';
import UiDayCard from '@/components/Ui/DayCard/uiDayCard.vue';
import WidgetTipInfo from '@/components/Widgets/TipInfo/widgetTipInfo.vue';
import WidgetLinksList from '@/components/Widgets/LinksList/widgetLinksList.vue';
import WidgetArtButton from '@/components/Widgets/ArtButton/widgetArtButton.vue';
import penguinArt from '@/assets/img/animals/penguin_art.webp';

const SUB_THEME_COLOR = appVars.colors.maleCalendar;

const lastAlcoholDate = ref();
const lastEjaculationDate = ref();

const isAlcoholDateModalOpen = ref(false);
const selectedAlcoholDate = ref();
const isEjaculationDateModalOpen = ref(false);
const selectedEjaculationDate = ref();
const buttonsRef = ref< HTMLElement >();
const selectedConceptionDate = ref< string | null >( null );
const isAlcoholInfoModalOpen = ref( false );
const isEjaculationInfoModalOpen = ref( false );
const isMasturbateInfoModalOpen = ref( false );
const isSmokeInfoModalOpen = ref( false );
const tipType = ref< 'alco' | 'ejac' >( 'alco' );

const isAlcoholSkipped = ref( false );

const toggleAlcoholSkip = () => {
  isAlcoholSkipped.value = !isAlcoholSkipped.value;
};

const openAlcoholDateModal = () => {
  isAlcoholDateModalOpen.value = true;
};

const openEjaculationDateModal = () => {
  isEjaculationDateModalOpen.value = true;
};

const maxDate = computed(() => currentDate.value + 'T23:59:59');

watch(selectedAlcoholDate, () => {
  if (selectedAlcoholDate.value) {
    lastAlcoholDate.value = selectedAlcoholDate.value.split('T')[0];
  }
});

watch(selectedEjaculationDate, () => {
  if (selectedEjaculationDate.value) {
    lastEjaculationDate.value = selectedEjaculationDate.value.split('T')[0];
  }
});

const optimalDates = computed(() => {
  if ( !selectedEjaculationDate.value ) {
    return null;
  }

  if ( !isAlcoholSkipped.value && !selectedAlcoholDate.value ) {
    return null;
  }

  const ejacDate: Date = parseLocalDate( selectedEjaculationDate.value.split('T')[0] );
  const today: Date = parseLocalDate( currentDate.value );

  let readyDate: Date | null = null;

  if ( !isAlcoholSkipped.value && selectedAlcoholDate.value ) {
    const alcDate: Date = parseLocalDate( selectedAlcoholDate.value.split('T')[0] );
    readyDate = new Date( alcDate );
    readyDate.setDate( readyDate.getDate() + appVars.abstinenceAlcoholDuration.normal );
  }

  const base: Date = readyDate && readyDate > today ? readyDate : ejacDate;
  // Запись tipType прямо здесь лаконичнее и читается лучше, чем отдельный computed с дублированием всего расчёта base
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  tipType.value = readyDate && readyDate > today ? 'alco' : 'ejac';
  const tooShort: string[] = [];
  const optimal: string[] = [];
  const tooLong: string[] = [];
  const inappropriate: string[] = [];
  let missing: number = 0;

  for ( let i = appVars.abstinenceEjaculationDuration.short; i <= appVars.abstinenceEjaculationDuration.long; i++ ) {
    const d: Date = new Date( base );
    d.setDate( d.getDate() + i );

    if ( d < today ) {
      missing++;
      continue;
    }

    const dateStr: string = formatLocalDate( d );

    if ( i <= appVars.abstinenceEjaculationDuration.short ) {
      tooShort.push( dateStr );
    } else if ( i <= appVars.abstinenceEjaculationDuration.normal ) {
      optimal.push( dateStr );
    } else {
      tooLong.push( dateStr );
    }
  }

  // Добираем от конца окна или от сегодня (если окно целиком в прошлом),
  // чтобы в inappropriate не попадали прошедшие даты
  const lastWindowDate: Date = new Date( base );
  lastWindowDate.setDate( lastWindowDate.getDate() + appVars.abstinenceEjaculationDuration.long );

  const fillStart: Date = lastWindowDate > today ? lastWindowDate : new Date( today );

  for ( let j = 1; j <= missing; j++ ) {
    const d: Date = new Date( fillStart );
    d.setDate( d.getDate() + j );
    inappropriate.push( formatLocalDate( d ) );
  }

  // По умолчанию рекомендуем ближайший оптимальный день,
  // а если оптимальное окно уже прошло — первую доступную дату
  const recommended: string = optimal[0] ?? tooShort[0] ?? tooLong[0] ?? inappropriate[0];

  return { tooShort, optimal, tooLong, inappropriate, recommended };
});

const onDayCardClick = ( date: string ) => {
  selectedConceptionDate.value = date;
};

// Дата рождения при зачатии в выбранный день (по умолчанию — ближайший оптимальный)
const birthDate = computed(() => {
  if ( !selectedConceptionDate.value ) {
    return null;
  }

  const date: Date = parseLocalDate( selectedConceptionDate.value );
  date.setDate( date.getDate() + appVars.pregnancyDuration );

  return formatLocalDate( date );
});

const scrollToButtons = () => {
  buttonsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// После расчёта дат проматываем страницу к кнопкам выбора,
// а выбранной датой ставим рекомендованный день — прежней даты в новом списке может не быть
watch( optimalDates, async ( value ) => {
  selectedConceptionDate.value = value ? value.recommended : null;

  if ( !value ) {
    return;
  }

  await nextTick();
  scrollToButtons();
});
</script>

<template>
  <ion-page :class="styles.maleCalendar"
            :style="{
              '--brd-custom-theme-color': SUB_THEME_COLOR,
            }"
  >
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <WidgetPageTitle
          :class="styles.maleCalendar__titleBlock"
          bg-image="cat-5"
          @click="scrollToButtons"
          title="Вы тоже можете планировать!"
          lead="Давайте рассчитаем оптимальный день, когда ваши сперматозоиды будут полны сил! 😎"
          comment="Но помните, лучший советчик &mdash; ваш лечащий врач&nbsp; 🤙"
      />

      <div ref="buttonsRef" :class="styles.maleCalendar__buttons">
        <div :class="stylesArtButton.artButton" @click="openAlcoholDateModal">
          <div :class="[
              stylesArtButton.artButton__art,
              stylesArtButton.artButton__dimmable,
              isAlcoholSkipped && stylesArtButton.artButton__dimmable_dimmed
          ]">
            <img src="@/assets/img/animals/cat-alco.webp" alt="" />
          </div>

          <div :class="stylesArtButton.artButton__content">
            <div :class="[
                stylesArtButton.artButton__title,
                stylesArtButton.artButton__dimmable,
                isAlcoholSkipped && stylesArtButton.artButton__dimmable_dimmed
            ]">
              Когда последний раз употреб&shy;ляли алкоголь?
            </div>

            <div :class="[
                stylesArtButton.artButton__comment,
                stylesArtButton.artButton__dimmable,
                isAlcoholSkipped && stylesArtButton.artButton__dimmable_dimmed
            ]">
              {{ lastAlcoholDate ? `📅 ${lastAlcoholDate}` : 'Честность = точность расчётов' }}
            </div>

            <div :class="[
                stylesArtButton.artButton__subButton,
                isAlcoholSkipped && stylesArtButton.artButton__subButton_active
            ]"
                 @click.stop="toggleAlcoholSkip"
            >
              {{ isAlcoholSkipped ? 'Не учитывается 🙅' : 'Не учитывать' }}
            </div>
          </div>

          <div :class="[
              stylesArtButton.artButton__art,
              stylesArtButton.artButton__dimmable,
              isAlcoholSkipped && stylesArtButton.artButton__dimmable_dimmed
          ]">
            <ion-icon :icon="chevronForwardCircleOutline" size="large"></ion-icon>
          </div>
        </div>

        <ion-modal
            :is-open="isAlcoholDateModalOpen"
            keep-contents-mounted="true"
            @did-dismiss="isAlcoholDateModalOpen = false"
        >
          <ion-content>
            <div class="center-content">
              <ion-datetime
                  v-model="selectedAlcoholDate"
                  locale="ru-RU"
                  presentation="date"
                  :show-default-buttons="true"
                  done-text="Готово" cancel-text="Не, отмена"
                  :max="maxDate"
                  :first-day-of-week="1"
                  @ionChange="isAlcoholDateModalOpen = false"
                  @ionCancel="isAlcoholDateModalOpen = false"
              ></ion-datetime>

              <img :class="styles.maleCalendar__modalArt" src="@/assets/img/animals/cat-alco.webp" alt="" />
            </div>
          </ion-content>
        </ion-modal>

        <div :class="stylesArtButton.artButton" @click="openEjaculationDateModal">
          <div :class="stylesArtButton.artButton__art">
            <img src="@/assets/img/animals/cat-4.webp" alt="" />
          </div>

          <div :class="stylesArtButton.artButton__content">
            <div :class="stylesArtButton.artButton__title">
              Когда была послед&shy;няя эякуляция?
            </div>

            <div :class="stylesArtButton.artButton__comment">
              {{ lastEjaculationDate ? `📅 ${lastEjaculationDate}` : 'Неважно, каким способом 🤭' }}
            </div>
          </div>

          <div :class="stylesArtButton.artButton__art">
            <ion-icon :icon="chevronForwardCircleOutline" size="large"></ion-icon>
          </div>
        </div>

        <ion-modal
            :is-open="isEjaculationDateModalOpen"
            keep-contents-mounted="true"
            @did-dismiss="isEjaculationDateModalOpen = false"
        >
          <ion-content>
            <div class="center-content">
              <ion-datetime
                  v-model="selectedEjaculationDate"
                  locale="ru-RU"
                  presentation="date"
                  :show-default-buttons="true"
                  done-text="Готово" cancel-text="Не, отмена"
                  :max="maxDate"
                  :first-day-of-week="1"
                  @ionChange="isEjaculationDateModalOpen = false"
                  @ionCancel="isEjaculationDateModalOpen = false"
              ></ion-datetime>

              <img :class="styles.maleCalendar__modalArt" src="@/assets/img/animals/cat-4.webp" alt="" />
            </div>
          </ion-content>
        </ion-modal>
      </div>

      <div v-if="optimalDates"
           :class="styles.maleCalendar__block"
      >
        <template v-if="tipType === 'alco'">
          <WidgetTipInfo :color="SUB_THEME_COLOR">
            Если употребляли <span :style="{color: SUB_THEME_COLOR}">алкоголь сравнительно недавно</span>, то помните, что процесс от деления первичной половой клетки (сперматогония) до полностью зрелого, готового к оплодотворению сперматозоида занимает в среднем от 70 до 90 дней. Поэтому, <span :style="{color: SUB_THEME_COLOR}">обратите внимание на месяц в рекомендованной дате</span> 😅<br />
            <a @click.prevent="isAlcoholInfoModalOpen = true">Подробнее</a>
          </WidgetTipInfo>
        </template>

        <template v-if="tipType === 'ejac'">
          <WidgetTipInfo :color="SUB_THEME_COLOR">
            Слишком редкое и слишком частое семяизвержение <span :style="{color: SUB_THEME_COLOR}">одинаково мешают зачатию</span>. В первом случае страдает качество и подвижность клеток, во втором — их концентрация. <span :style="{color: SUB_THEME_COLOR}">Золотая середина существует</span>: достаточно одного раза в 1–2 дня, чтобы поддерживать сперму в оптимальном состоянии для оплодотворения.<br />
            <a @click.prevent="isEjaculationInfoModalOpen = true">Подробнее</a>
          </WidgetTipInfo>
        </template>

        <div :class="stylesOverflowSection.overflowSection">
          <div :class="[
              styles.maleCalendar__dates,
              stylesOverflowSection.overflowSection__overflowWrapper
          ]">
            <div v-for="date in optimalDates.tooShort" :key="date">
              <UiDayCard
                  :date="parseLocalDate( date )"
                  color="warning"
                  :is-active="selectedConceptionDate === date"
                  @click="onDayCardClick( date )"
              />
            </div>

            <div v-for="date in optimalDates.optimal" :key="date">
              <UiDayCard
                  :date="parseLocalDate( date )"
                  color="success"
                  :is-active="selectedConceptionDate === date"
                  @click="onDayCardClick( date )"
              />
            </div>

            <div v-for="date in optimalDates.tooLong" :key="date">
              <UiDayCard
                  :date="parseLocalDate( date )"
                  color="warning"
                  :is-active="selectedConceptionDate === date"
                  @click="onDayCardClick( date )"
              />
            </div>

            <div v-for="date in optimalDates.inappropriate" :key="date">
              <UiDayCard
                  :date="parseLocalDate( date )"
                  color="error"
                  :is-active="selectedConceptionDate === date"
                  @click="onDayCardClick( date )"
              />
            </div>
          </div>
        </div>
      </div>

      <WidgetArtButton
          v-if="birthDate"
          :color="appVars.colors.childBirthday"
          :title="`Малыш может родиться примерно <div style='color: ${SUB_THEME_COLOR}; font-size: 1.2em; font-weight: bold'>${ formatDisplayDate( parseLocalDate( birthDate )) }</div> Давайте посмотрми, что интересного будет в этот день? 🐣`"
          comment="Праздники, именины, знак зодиака и памятные даты"
          :link="`/childBirthday?birthDate=${birthDate}`"
          :art-src="penguinArt"
      />

      <WidgetLinksList :class="styles.maleCalendar__block">
        <a @click.prevent="isEjaculationInfoModalOpen = true">
          Влияние <span :style="{color: SUB_THEME_COLOR}">частоты семяизвержений</span> на сперматозоиды
        </a>

        <a @click.prevent="isAlcoholInfoModalOpen = true">
          Почему <span :style="{color: SUB_THEME_COLOR}">алкоголь</span> так долго влияет на качество спермы?
        </a>

        <a @click.prevent="isMasturbateInfoModalOpen = true">
          Как <span :style="{color: SUB_THEME_COLOR}">онанизм влияет</span> на качество спермы?
        </a>

        <a @click.prevent="isSmokeInfoModalOpen = true">
          Влияет ли <span :style="{color: SUB_THEME_COLOR}">курение</span> на качество спермы?
        </a>
      </WidgetLinksList>

      <!-- про алкоголь -->
      <ion-modal
          :is-open="isAlcoholInfoModalOpen"
          keep-contents-mounted="true"
          @did-dismiss="isAlcoholInfoModalOpen = false"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button @click="isAlcoholInfoModalOpen = false">
                Закрыть&nbsp;&nbsp;
                <ion-icon :icon="closeCircle" size="large"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="article">
            <h2>🔬 Почему именно 3 месяца?</h2>
            <P>
              Этот срок обусловлен физиологическим циклом созревания мужских половых клеток:
            </P>

            <ol>
              <li>
                Полный цикл созревания сперматозоида: Процесс от деления первичной половой клетки (сперматогония) до полностью зрелого, готового к оплодотворению сперматозоида занимает в среднем от 70 до 90 дней.
              </li>
              <li>
                Влияние алкоголя на всех этапах: Алкоголь и его токсичный метаболит ацетальдегид негативно воздействуют на сперматозоиды на всех стадиях их развития, повреждая их ДНК, снижая подвижность и увеличивая количество аномальных форм.
              </li>
              <li>
                Длительность "восстановления": Исследования показывают, что простого прекращения употребления недостаточно, так как процесс вывода токсинов и восстановления нормальной работы организма (синдром отмены) также создает окислительный стресс, который может влиять на качество спермы на протяжении около месяца после отказа от алкоголя . Трехмесячный срок позволяет "сменить" всю популяцию сперматозоидов на новую, выросшую уже в здоровых условиях.
              </li>
            </ol>

            <h2>📊 Что говорят исследования?</h2>

            <ol>
              <li>
                Снижение качества: Даже умеренное, но регулярное употребление алкоголя (например, 3-4 банки пива несколько раз в неделю) может значительно ухудшить качество спермы.
              </li>
              <li>
                Риск для ребенка: Употребление алкоголя отцом до зачатия связывают с повышенным риском врожденных дефектов у ребенка, включая дефекты лица и головного мозга, характерные для фетального алкогольного синдрома.
              </li>
              <li>
                Положительная динамика: Клинические тесты показали, что у половины мужчин с низкой фертильностью, вызванной алкоголем, полное воздержание в течение трех месяцев нормализует процесс сперматогенеза.
              </li>
            </ol>
          </div>
        </ion-content>
      </ion-modal>

      <!-- про эякуляцию -->
      <ion-modal
          :is-open="isEjaculationInfoModalOpen"
          keep-contents-mounted="true"
          @did-dismiss="isEjaculationInfoModalOpen = false"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button @click="isEjaculationInfoModalOpen = false">
                Закрыть&nbsp;&nbsp;
                <ion-icon :icon="closeCircle" size="large"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="article">
            <h2>Секрет мужской силы: как частота семяизвержения влияет на здоровье и шансы стать отцом</h2>

            <p>В вопросах мужского здоровья и планирования беременности существует множество мифов. Один из самых распространённых касается частоты семяизвержения. Многие уверены: чтобы зачать здорового ребёнка, нужно копить сперму неделями. Другие считают, что частая разрядка никак не влияет на качество семени. Истина, как всегда, посередине.</p>

            <h2>Миф №1: чем дольше воздерживаться, тем лучше</h2>

            <p>Длительное воздержание (свыше 7–10 дней) увеличивает объём эякулята, но ухудшает качество:</p>

            <ul>
              <li>сперматозоиды стареют;</li>
              <li>в них накапливаются повреждения ДНК (фрагментация);</li>
              <li>подвижность клеток резко падает.</li>
            </ul>

            <p><strong>Результат:</strong> много спермы, но она состоит из старых, повреждённых клеток. Это снижает шансы на зачатие и повышает риск выкидыша.</p>

            <h2>Миф №2: чем чаще, тем выше фертильность</h2>

            <p>Эякуляция несколько раз в день тоже приводит к проблемам:</p>

            <ul>
              <li>организм не успевает воспроизводить новые клетки;</li>
              <li>эякулят становится слишком жидким;</li>
              <li>падает концентрация сперматозоидов.</li>
            </ul>

            <p><strong>Результат:</strong> клетки молодые, но их слишком мало, чтобы оплодотворить яйцеклетку.</p>

            <h2>Золотое правило</h2>

            <p>Оптимальная частота для мужчины, планирующего беременность, — эякуляция <strong>1 раз в 1–2 дня</strong>.</p>
          </div>
        </ion-content>
      </ion-modal>

      <!-- про онанизм -->
      <ion-modal
          :is-open="isMasturbateInfoModalOpen"
          keep-contents-mounted="true"
          @did-dismiss="isMasturbateInfoModalOpen = false"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button @click="isMasturbateInfoModalOpen = false">
                Закрыть&nbsp;&nbsp;
                <ion-icon :icon="closeCircle" size="large"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="article">
            <h2>🖐️ Как онанизм влияет на качество спермы?</h2>

            <p>В отличие от алкоголя, влияние мастурбации на качество спермы не является однозначно вредным. Более того, умеренная мастурбация чаще всего не ухудшает, а в определенных контекстах даже улучшает показатели спермы для зачатия.</p>

            <p>Однако ключевым здесь является частота и временной интервал по отношению к моменту овуляции.</p>

            <h2>🧪 Влияние на качество спермы для зачатия</h2>

            <p>Здесь работает правило «золотой середины».</p>

            <h3>🐢 Слишком редкая эякуляция (воздержание 7–10+ дней)</h3>

            <ul>
              <li>Сперматозоиды накапливаются, но стареют. В старой сперме накапливаются повреждения ДНК (фрагментация), снижается подвижность.</li>
              <li><strong>Результат:</strong> количество спермы может быть большим, но качество клеток низкое. Это снижает шансы на зачатие и повышает риск выкидыша (из-за повреждённой ДНК).</li>
            </ul>

            <h3>⚡ Слишком частая эякуляция (несколько раз в день каждый день)</h3>

            <ul>
              <li>Организм не успевает восполнять запас сперматозоидов. Эякулят становится жидким, объем уменьшается, количество сперматозоидов падает.</li>
              <li><strong>Результат:</strong> концентрация клеток может стать слишком низкой для оплодотворения.</li>
            </ul>

            <h3>🎯 Оптимальная частота для зачатия</h3>

            <ul>
              <li><strong>Рекомендация:</strong> эякуляция каждые 1–2 дня (то есть мастурбация или половой акт).</li>
              <li><strong>Почему:</strong> это обеспечивает максимальное количество «свежих», подвижных сперматозоидов с минимальными повреждениями ДНК. Исследования показывают, что наилучшее качество спермы достигается при периоде воздержания от 1 до 3 суток.</li>
            </ul>

            <h2>🔬 Влияние на результаты спермограммы (анализа)</h2>

            <p><strong>Это критически важно знать перед сдачей анализа!</strong> Мастурбация непосредственно влияет на результаты. Поэтому лаборатории всегда просят вас соблюдать конкретный период воздержания перед сдачей — обычно от 2 до 5 дней (чаще всего 3–4 дня).</p>

            <ul>
              <li><strong>Если сдать сперму после 1 дня воздержания:</strong> объем и концентрация сперматозоидов будут искусственно занижены. Врач может ошибочно заподозрить бесплодие.</li>
              <li><strong>Если после 7+ дней:</strong> подвижность будет искусственно занижена, а процент аномальных форм — завышен.</li>
            </ul>

            <p><strong>Вывод:</strong> мастурбация сама по себе не вредит сперме. Вредит либо слишком долгое, либо слишком частое воздержание. Онанизм — это просто инструмент для регуляции частоты эякуляции.</p>

            <h2>🍷 Онанизм и «вымывание» спермы после алкоголя</h2>

            <p>Это отдельный интересный нюанс. Если мужчина пил алкоголь, то повреждённые сперматозоиды уже образовались внутри него. Вы не можете их «исправить», но вы можете быстрее вывести их из организма с помощью мастурбации.</p>

            <p>Логика такова:</p>

            <ol>
              <li>Вы выпили алкоголь. Токсины повредили часть созревающих сперматозоидов.</li>
              <li>Если вы <strong>не эякулируете</strong>, эти повреждённые клетки останутся в придатке яичка и будут использованы при попытке зачатия в течение следующих 2–3 недель.</li>
              <li>Если вы <strong>регулярно эякулируете</strong> (каждые 1–3 дня), вы «прочищаете трубы», быстрее избавляясь от старого повреждённого материала, давая место новой здоровой сперме.</li>
            </ol>

            <h2>🧴 Единственное реальное негативное влияние онанизма</h2>

            <p>Оно не физиологическое, а <strong>механическое</strong>, и проявляется только в одном случае: если вы используете <strong>лубриканты (смазки)</strong> во время мастурбации. Многие смазки (даже некоторые «натуральные» масла) токсичны для сперматозоидов — они их обездвиживают или убивают. Если вы мастурбируете, а затем тут же используете эту сперму для зачатия (например, вводя её во влагалище), результаты будут плохими. Используйте специальные фертильные смазки (Pre-Seed, Фертилюкс) или вообще обходитесь без них.</p>

            <h2>📊 Итог в таблице</h2>

            <div class="overflow" >
              <table style="min-width: 500px">
                <thead>
                  <tr>
                    <th>Сценарий</th>
                    <th>Влияние на качество спермы</th>
                    <th>Рекомендация</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Для зачатия</strong></td>
                    <td>Положительное (если умеренно). Обновляет сперму, повышает подвижность, снижает фрагментацию ДНК.</td>
                    <td>Эякуляция каждые 1–2 дня.</td>
                  </tr>
                  <tr>
                    <td><strong>Для спермограммы</strong></td>
                    <td>Решающее. Меняет цифры.</td>
                    <td>Строго соблюдать 3–4 дня воздержания перед сдачей.</td>
                  </tr>
                  <tr>
                    <td><strong>После алкоголя</strong></td>
                    <td>Положительное. Ускоряет выведение повреждённых клеток.</td>
                    <td>Эякулировать каждые 1–2 дня месяц-два после отказа от алкоголя.</td>
                  </tr>
                  <tr>
                    <td><strong>С лубрикантами</strong></td>
                    <td>Отрицательное. Сперма погибает.</td>
                    <td>Не использовать обычные смазки, если сперма пойдёт на зачатие.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>💡 Главный вывод для подготовки к беременности</h2>

            <p>Нет ничего вредного в том, чтобы мастурбировать раз в 1–3 дня. Наоборот, воздерживаться неделями перед овуляцией — плохая стратегия, так как вы получите старую некачественную сперму. Мастурбируйте спокойно, просто выбирайте правильную частоту.</p>
          </div>
        </ion-content>
      </ion-modal>

      <!-- про курение -->
      <ion-modal
          :is-open="isSmokeInfoModalOpen"
          keep-contents-mounted="true"
          @did-dismiss="isSmokeInfoModalOpen = false"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button @click="isSmokeInfoModalOpen = false">
                Закрыть&nbsp;&nbsp;
                <ion-icon :icon="closeCircle" size="large"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="article">
            <h2>🚬 Влияет ли курение на качество спермы?</h2>

            <p>Да, курение оказывает существенное негативное влияние на качество спермы. Оно ухудшает большинство ключевых параметров, повреждает ДНК сперматозоидов и может приводить к гормональному дисбалансу.</p>

            <h2>🔬 Как именно курение вредит сперме?</h2>

            <h3>Снижение концентрации и подвижности</h3>

            <p>У курящих мужчин концентрация сперматозоидов в среднем ниже на 23%, а их подвижность — на 13% по сравнению с некурящими. Некоторые исследования показывают значительное снижение общего количества сперматозоидов и прогрессивной подвижности.</p>

            <h3>Ухудшение морфологии</h3>

            <p>Курение увеличивает количество сперматозоидов с аномальной формой и строением, что снижает их способность к оплодотворению.</p>

            <h3>Повреждение ДНК (фрагментация)</h3>

            <p>Это один из самых серьезных эффектов. У курильщиков значительно повышен уровень фрагментации ДНК сперматозоидов, что может приводить к проблемам с зачатием, повышать риск выкидыша и врожденных дефектов у ребенка.</p>

            <h3>⚖Гормональный дисбаланс</h3>

            <p>У заядлых курильщиков (более 20 сигарет в день) наблюдается снижение уровня тестостерона и повышение уровня фолликулостимулирующего (ФСГ) и лютеинизирующего (ЛГ) гормонов, что указывает на нарушение функции яичек.</p>

            <h3>Воздействие токсинов</h3>

            <p>Сигаретный дым содержит более 4000 вредных соединений, включая тяжелые металлы, такие как свинец и мышьяк, которые накапливаются в семенной жидкости и напрямую повреждают сперматозоиды.</p>

            <h2>📊 Есть ли надежда на восстановление?</h2>

            <p><strong>Да, негативные последствия курения обратимы.</strong> Отказ от курения приводит к значительному улучшению показателей спермы.</p>

            <ul>
              <li>Исследования показывают, что <strong>уже через 3 месяца</strong> после отказа от курения наблюдается заметное улучшение объема спермы, концентрации и подвижности сперматозоидов, а также снижение количества аномальных форм.</li>
              <li>Через <strong>6 месяцев</strong> после отказа положительная динамика сохраняется и усиливается.</li>
              <li>Важно, что вместе с качеством спермы восстанавливается и ее <strong>эпигенетический профиль</strong> (характер метилирования ДНК), что потенциально снижает риски для будущего ребенка.</li>
            </ul>

            <h2>💡 Ключевой вывод</h2>

            <p>Курение — один из самых значимых и при этом <strong>модифицируемых</strong> факторов риска для мужской фертильности. Хотя его воздействие на сперму комплексное и серьезное, отказ от привычки даже на один полный цикл сперматогенеза (около 3 месяцев) может существенно повысить шансы на здоровое зачатие.</p>

            <p>Это касается не только обычных сигарет, но и, вероятно, электронных сигарет, исследования которых также показывают негативное влияние на репродуктивную систему.</p>

            <p>Надеюсь, эта информация поможет вам в принятии решений о своем здоровье. Если появятся другие вопросы — я готов помочь.</p>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
