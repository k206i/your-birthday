<script setup lang="ts">
import styles from './femaleCalendar.module.scss';
import stylesArtButton from '@/assets/styles/artButton.module.scss';
import stylesOverflowSection from '@/assets/styles/overflowSection.module.scss';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {IonContent, IonPage, IonIcon, IonModal, IonDatetime, IonButton, IonPicker, IonPickerColumn, IonPickerColumnOption, IonHeader, IonToolbar, IonButtons} from '@ionic/vue';
import { chevronForwardCircleOutline, closeCircle } from 'ionicons/icons';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import WidgetTipInfo from '@/components/Widgets/TipInfo/widgetTipInfo.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import UiDayCard from '@/components/Ui/DayCard/uiDayCard.vue';
import {ref, computed, watch, nextTick} from 'vue';
import {appVars} from '@/configApp';
import {parseLocalDate, formatLocalDate, formatDisplayDate} from '@/composables/localDate';
import {currentDate} from '@/store/currentDate';
import {appStore} from '@/store/appStore';
import WidgetArtButton from '@/components/Widgets/ArtButton/widgetArtButton.vue';
import penguinArt from '@/assets/img/animals/penguin_art.webp';
import WidgetLinksList from '@/components/Widgets/LinksList/widgetLinksList.vue';

const SUB_THEME_COLOR = appVars.colors.femaleCalendar;

const isPeriodDateModalOpen = ref( false );
const selectedPeriodDate = ref();
const isCycleModalOpen = ref( false );
const isAlcoholInfoModalOpen = ref( false );
const isSmokeInfoModalOpen = ref( false );
const isSpermSurviveModalOpen = ref( false );
const isOvulationInfoModalOpen = ref( false );
const isPregnancySignsModalOpen = ref( false );
const isOtherFactorsInfoModalOpen = ref( false );
const buttonsRef = ref< HTMLElement >();
const selectedConceptionDate = ref< string | null >( null );

const cycleOptions: number[] = [];

for ( let i = appVars.ovulation.cycleMin; i <= appVars.ovulation.cycleMax; i++ ) {
  cycleOptions.push( i );
}

const openPeriodDateModal = () => {
  isPeriodDateModalOpen.value = true;
};

const openCycleModal = () => {
  isCycleModalOpen.value = true;
};

const maxDate = computed(() => currentDate.value + 'T23:59:59');

const lastPeriodDate = computed(() => {
  if ( !selectedPeriodDate.value ) {
    return '';
  }

  return selectedPeriodDate.value.split('T')[0];
});

const onCycleChange = ( event: CustomEvent ) => {
  appStore.femaleCycleLength = Number( event.detail.value );
};

const ovulationDates = computed(() => {
  if ( !selectedPeriodDate.value ) {
    return null;
  }

  const periodStart: Date = parseLocalDate( selectedPeriodDate.value.split('T')[0] );
  const today: Date = parseLocalDate( currentDate.value );

  // Овуляция = начало последних месячных + длина цикла - лютеиновая фаза
  const ovulationDate: Date = new Date( periodStart );
  ovulationDate.setDate( ovulationDate.getDate() + appStore.femaleCycleLength - appVars.ovulation.lutealPhase );

  // Если овуляция уже прошла — прогнозируем следующий цикл
  while ( ovulationDate < today ) {
    ovulationDate.setDate( ovulationDate.getDate() + appStore.femaleCycleLength );
  }

  const early: string[] = [];
  const peak: string[] = [];
  const after: string[] = [];
  const inappropriate: string[] = [];

  // Фертильное окно (только будущие дни), прошедшие дни в начале отсекаются
  for ( let i = -appVars.ovulation.fertileDaysBefore; i <= appVars.ovulation.fertileDaysAfter; i++ ) {
    const d: Date = new Date( ovulationDate );
    d.setDate( d.getDate() + i );

    if ( d < today ) {
      continue;
    }

    const dateStr: string = formatLocalDate( d );

    if ( i < -appVars.ovulation.peakDaysBefore ) {
      early.push( dateStr );
    } else if ( i <= 0 ) {
      peak.push( dateStr );
    } else {
      after.push( dateStr );
    }
  }

  // Добираем красными днями после окна, пока не наберётся totalDays карточек
  const shownCount: number = early.length + peak.length + after.length;

  for ( let i = 1; i <= appVars.ovulation.totalDays - shownCount; i++ ) {
    const d: Date = new Date( ovulationDate );
    d.setDate( d.getDate() + appVars.ovulation.fertileDaysAfter + i );
    inappropriate.push( formatLocalDate( d ) );
  }

  return {
    early,
    peak,
    after,
    inappropriate,
    ovulation: formatLocalDate( ovulationDate ),
  };
});

const onDayCardClick = ( date: string ) => {
  selectedConceptionDate.value = date;
};

// Дата рождения при зачатии в выбранный день (по умолчанию — день овуляции)
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
// а выбранной датой ставим день овуляции — прежней даты в новом списке может не быть
watch( ovulationDates, async ( value ) => {
  selectedConceptionDate.value = value ? value.ovulation : null;

  if ( !value ) {
    return;
  }

  await nextTick();
  scrollToButtons();
});
</script>

<template>
  <ion-page :class="styles.femaleCalendar"
            :style="{
              '--brd-custom-theme-color': SUB_THEME_COLOR,
            }"
  >
    <AppHeader page-name="Планирование <span class='accent-theme'>для девушек</span>" />

    <ion-content :fullscreen="true" class="ion-padding">
      <WidgetPageTitle
          :class="styles.femaleCalendar__titleBlock"
          bg-image="cat-1"
          @click="scrollToButtons"
          title="Пора искать идеальное совпадение! ❤️"
          lead="
          Выберите даты в двух карточках ниже 👇 и мы рассчитаем день овуляции и период, когда вероятность оплодотворения яйцеклетки будет наиболее высокой. ✨"
          comment="Но помните: природа любит удивлять, а лучший советчик — ваш лечащий врач 👩‍⚕️"
      />

      <div ref="buttonsRef" :class="styles.femaleCalendar__buttons">
        <div :class="stylesArtButton.artButton" @click="openPeriodDateModal">
          <div :class="stylesArtButton.artButton__art">
            <img src="@/assets/img/animals/cat-6_art.webp" alt="" />
          </div>

          <div :class="stylesArtButton.artButton__content">
            <div :class="stylesArtButton.artButton__title">
              Когда начались послед&shy;ние месячные?
            </div>

            <div :class="stylesArtButton.artButton__comment">
              {{ lastPeriodDate ? `📅 ${lastPeriodDate}` : 'Выберите дату' }}
            </div>
          </div>

          <div :class="stylesArtButton.artButton__art">
            <ion-icon :icon="chevronForwardCircleOutline" size="large"></ion-icon>
          </div>
        </div>

        <ion-modal
            class="picker-modal"
            :is-open="isPeriodDateModalOpen"
            keep-contents-mounted="true"
            @did-dismiss="isPeriodDateModalOpen = false"
        >
          <ion-content>
            <div class="center-content">
              <ion-datetime
                  v-model="selectedPeriodDate"
                  locale="ru-RU"
                  presentation="date"
                  :show-default-buttons="true"
                  done-text="Готово" cancel-text="Отмена"
                  :max="maxDate"
                  :first-day-of-week="1"
                  @ionChange="isPeriodDateModalOpen = false"
                  @ionCancel="isPeriodDateModalOpen = false"
              ></ion-datetime>

              <img :class="styles.femaleCalendar__modalArt" src="@/assets/img/animals/cat-6_art.webp" alt="" />
            </div>
          </ion-content>
        </ion-modal>

        <div :class="stylesArtButton.artButton" @click="openCycleModal">
          <div :class="stylesArtButton.artButton__art">
            <img src="@/assets/img/animals/hamster_art.webp" alt="" />
          </div>

          <div :class="stylesArtButton.artButton__content">
            <div :class="stylesArtButton.artButton__title">
              Средняя продолжи&shy;тельность цикла?
            </div>

            <div :class="stylesArtButton.artButton__comment">
              {{ `⏳ ${appStore.femaleCycleLength} дн.` }}
            </div>
          </div>

          <div :class="stylesArtButton.artButton__art">
            <ion-icon :icon="chevronForwardCircleOutline" size="large"></ion-icon>
          </div>
        </div>

        <ion-modal
            class="picker-modal"
            :is-open="isCycleModalOpen"
            @did-dismiss="isCycleModalOpen = false"
        >
          <ion-content>
            <div class="center-content">
              <div>
              <ion-picker>
                <ion-picker-column :value="appStore.femaleCycleLength" @ionChange="onCycleChange">
                  <ion-picker-column-option
                      v-for="option in cycleOptions"
                      :key="option"
                      :value="option"
                  >
                    {{ option }}
                  </ion-picker-column-option>
                </ion-picker-column>
              </ion-picker>

              <ion-button
                  expand="block"
                  fill="clear"
                  @click="isCycleModalOpen = false"
              >
                Готово
              </ion-button>
              </div>

              <img :class="styles.femaleCalendar__modalArt" src="@/assets/img/animals/hamster_art.webp" alt="" />
            </div>
          </ion-content>
        </ion-modal>
      </div>

      <div v-if="ovulationDates"
           :class="styles.femaleCalendar__block"
      >
        <WidgetTipInfo :color="SUB_THEME_COLOR">
          Календарный метод даёт <span :style="{color: SUB_THEME_COLOR}">оценку, а не гарантию</span>: при нерегулярном цикле погрешность растёт. Зелёные дни — <span :style="{color: SUB_THEME_COLOR}">наибольшая вероятность зачатия</span> (пик — за 1–2 дня до овуляции), жёлтые — остальное фертильное окно, а все дни до и после окна — красные, зачатие в них маловероятно 😉<br />
          <a @click.prevent="isOvulationInfoModalOpen = true">Подробнее</a>
        </WidgetTipInfo>

        <div :class="stylesOverflowSection.overflowSection">
          <div :class="[
              styles.femaleCalendar__dates,
              stylesOverflowSection.overflowSection__overflowWrapper
          ]">
            <div v-for="date in ovulationDates.early" :key="date">
              <UiDayCard
                  :date="parseLocalDate( date )"
                  color="warning"
                  :is-active="selectedConceptionDate === date"
                  @click="onDayCardClick( date )"
              />
            </div>

            <div v-for="date in ovulationDates.peak" :key="date">
              <UiDayCard
                  :date="parseLocalDate( date )"
                  color="success"
                  :is-active="selectedConceptionDate === date"
                  @click="onDayCardClick( date )"
              />
            </div>

            <div v-for="date in ovulationDates.after" :key="date">
              <UiDayCard
                  :date="parseLocalDate( date )"
                  color="warning"
                  :is-active="selectedConceptionDate === date"
                  @click="onDayCardClick( date )"
              />
            </div>

            <div v-for="date in ovulationDates.inappropriate" :key="date">
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

      <WidgetLinksList :class="styles.femaleCalendar__block">
        <a @click.prevent="isOvulationInfoModalOpen = true">
          Как точно определить <span :style="{color: SUB_THEME_COLOR}">момент овуляции</span>?
        </a>

        <a @click.prevent="isSpermSurviveModalOpen = true">
          Сколько <span :style="{color: SUB_THEME_COLOR}">живёт сперма</span> во влагалище
        </a>

        <a @click.prevent="isPregnancySignsModalOpen = true">
          В чём выражаются <span :style="{color: SUB_THEME_COLOR}">признаки беременности</span>?
        </a>

        <a @click.prevent="isAlcoholInfoModalOpen = true">
          Влияние <span :style="{color: SUB_THEME_COLOR}">алкоголя</span> на яйцеклетки
        </a>

        <a @click.prevent="isSmokeInfoModalOpen = true">
          Вредит ли <span :style="{color: SUB_THEME_COLOR}">курение</span> яйцеклеткам?
        </a>

        <a @click.prevent="isOtherFactorsInfoModalOpen = true">
          Другие факторы, влияющие на <span :style="{color: SUB_THEME_COLOR}">фертильность</span>
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
            <h2>🍷 Влияет ли алкоголь на яйцеклетки?</h2>

            <p>Да, алкоголь оказывает негативное влияние на яйцеклетки. Это влияние носит долгосрочный характер и затрагивает как качество самих клеток, так и общую фертильность женщины.</p>

            <h3>🔬 Как алкоголь влияет на яйцеклетки и репродуктивную систему:</h3>

            <ul>
              <li><strong>Необратимое накопление повреждений.</strong> Яйцеклетки закладываются в организме женщины еще до ее рождения и живут всю жизнь. Они не обновляются, поэтому все негативные факторы, включая алкоголь, накапливаются в них годами, необратимо повреждая их структуру и генетический материал.</li>

              <li><strong>Снижение качества и запаса яйцеклеток.</strong> Алкоголь напрямую повреждает яичники, что приводит к уменьшению общего запаса яйцеклеток (овариального резерва) и ухудшению их качества. Это, в свою очередь, снижает шансы на зачатие.</li>

              <li><strong>Нарушение созревания и овуляции.</strong> Даже небольшие дозы алкоголя могут нарушить гормональный баланс, необходимый для правильного созревания яйцеклетки и ее выхода из яичника (овуляции).</li>

              <li><strong>Влияние на ДНК.</strong> Научные исследования показывают, что алкоголь повреждает ДНК в клетках, что может приводить к мутациям в генетическом материале яйцеклетки. Недавние исследования на моделях также подтверждают, что даже низкие концентрации алкоголя нарушают работу митохондрий и процессы метилирования ДНК в яйцеклетках, что критически важно для развития здорового эмбриона.</li>

              <li><strong>Риск бесплодия и осложнений.</strong> Хроническое употребление или злоупотребление алкоголем в разы увеличивает риск развития бесплодия, может привести к раннему наступлению климакса и повышает вероятность выкидыша в случае наступления беременности.</li>
            </ul>

            <h3>💡 Важно знать:</h3>

            <p>Даже при отказе от алкоголя непосредственно перед зачатием, яйцеклетки, которые уже подвергались его воздействию ранее, могут нести повреждения. Именно поэтому врачи рекомендуют воздерживаться от алкоголя минимум за 3 месяца до планируемого зачатия, чтобы дать организму возможность &quot;очиститься&quot;, хотя на сами уже сформированные яйцеклетки это кардинально не повлияет.</p>

            <p>Если вы планируете беременность, обсуждение образа жизни, включая употребление алкоголя, с врачом — важный шаг для снижения рисков и повышения шансов на здоровое зачатие.</p>
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
            <h2>🚬 Вредит ли курение яйцеклеткам?</h2>

            <p>Да, курение оказывает крайне негативное влияние на яйцеклетки и женскую фертильность в целом. В отличие от многих других факторов, воздействие курения является одним из самых разрушительных и труднообратимых.</p>

            <h3>🔬 Как курение влияет на яйцеклетки и репродуктивную систему:</h3>

            <ul>
              <li><strong>Ускоренное старение яйцеклеток.</strong> Яйцеклетки закладываются у женщины еще внутриутробно и не обновляются. Токсичные вещества табачного дыма ускоряют процессы окисления и старения, что приводит к более раннему истощению овариального резерва и приближению менопаузы в среднем на 1-4 года.</li>

              <li><strong>Снижение качества яйцеклеток.</strong> Курение напрямую ухудшает качество ооцитов (яйцеклеток), повышая риск хромосомных аномалий. Это одна из причин, почему у курящих женщин выше риск рождения детей с генетическими нарушениями и выше вероятность выкидышей на ранних сроках.</li>

              <li><strong>Нарушение гормонального фона и овуляции.</strong> Вещества, содержащиеся в табаке, нарушают выработку эстрогена и других гормонов, что может приводить к нерегулярным циклам, отсутствию овуляции (ановуляции) и затруднению зачатия.</li>

              <li><strong>Снижение эффективности ЭКО.</strong> Многочисленные исследования показывают, что у курящих женщин значительно ниже шансы на успешное оплодотворение в программах ЭКО: требуется больше гормональных препаратов для стимуляции, созревает меньше фолликулов, а частота наступления беременности ниже на 30-50%.</li>

              <li><strong>Повреждение ДНК митохондрий.</strong> Яйцеклетки крайне чувствительны к повреждению митохондриальной ДНК. Курение вызывает мутации в митохондриях, которые обеспечивают клетку энергией. Это делает яйцеклетки неспособными к нормальному оплодотворению и развитию эмбриона.</li>

              <li><strong>Влияние на будущего ребенка.</strong> Даже если беременность наступает, курение во время беременности (в том числе пассивное) повышает риск выкидыша, преждевременных родов, низкого веса плода, а также влияет на репродуктивное здоровье будущих дочерей (внутреннее поколение).</li>
            </ul>

            <h3>💡 Важно знать:</h3>

            <ul>
              <li><strong>Восстановление занимает время.</strong> Если отказаться от курения, качество яйцеклеток не улучшается мгновенно, так как сами клетки уже сформированы. Однако улучшается кровоснабжение яичников и гормональный фон. Врачи рекомендуют отказаться от курения <strong>минимум за 3-6 месяцев</strong> до планируемого зачатия, а лучше за год.</li>

              <li><strong>Пассивное курение тоже опасно.</strong> Регулярное вдыхание табачного дыма (даже если женщина сама не курит) также снижает фертильность, хотя и в меньшей степени, чем активное курение.</li>

              <li><strong>Эффект накапливается.</strong> Вред от курения суммируется с годами. Чем дольше стаж курения, тем выше риски. Однако отказ от курения в любом возрасте приносит пользу и повышает шансы на здоровое зачатие.</li>
            </ul>

            <p>👨‍⚕️ Если вы планируете беременность, отказ от курения — это один из самых важных шагов, которые вы можете предпринять для своего здоровья и здоровья будущего ребенка. Обсудите с врачом возможные стратегии отказа от курения и поддержки организма в этот период.</p>
          </div>
        </ion-content>
      </ion-modal>

      <!-- про время жизни спермы -->
      <ion-modal
          :is-open="isSpermSurviveModalOpen"
          keep-contents-mounted="true"
          @did-dismiss="isSpermSurviveModalOpen = false"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button @click="isSpermSurviveModalOpen = false">
                Закрыть&nbsp;&nbsp;
                <ion-icon :icon="closeCircle" size="large"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="article">
            <h2>🧪 Сколько живёт сперма во влагалище</h2>

            <p>Вопрос о том, сколько живут сперматозоиды во влагалище, не имеет однозначного ответа, так как это зависит от двух ключевых факторов: конкретной среды влагалища и того, что мы считаем «жизнью» сперматозоида.</p>

            <h3>⚠️ Среда влагалища — главное препятствие</h3>

            <p>Вопреки распространённому мнению, влагалище — это не самое благоприятное место для выживания сперматозоидов. Его естественная среда является кислой, что служит защитным барьером для организма от бактерий. Для сперматозоидов эта кислотность губительна.</p>

            <ul>
              <li><strong>Большинство сперматозоидов погибает быстро:</strong> Из-за кислой среды влагалища значительная часть сперматозоидов погибает в течение нескольких минут или часов после эякуляции.</li>
              <li><strong>Выживают только самые быстрые:</strong> Лишь небольшое количество наиболее подвижных сперматозоидов способно быстро покинуть влагалище и проникнуть через канал шейки матки в более защищённую и благоприятную среду.</li>
            </ul>

            <h3>📅 Сколько живут сперматозоиды в женских половых путях</h3>

            <p>Хотя во влагалище условия суровы, после того как сперматозоиды достигают шейки матки, матки и фаллопиевых труб, их шансы на выживание значительно возрастают. Именно в этих частях репродуктивной системы они могут сохранять жизнеспособность в течение нескольких дней.</p>

            <ul>
              <li><strong>Общая продолжительность жизни:</strong> В благоприятных условиях, внутри женского репродуктивного тракта, сперматозоиды обычно могут жить от <strong>3 до 5 дней</strong>.</li>
              <li><strong>Максимальный срок:</strong> В некоторых источниках указывается, что в исключительных случаях и при идеальных условиях (например, наличие благоприятной цервикальной слизи) этот срок может достигать <strong>7 дней</strong>.</li>
            </ul>

            <p>Важно понимать, что эти сроки относятся к сперматозоидам, которые уже покинули влагалище и находятся в верхних отделах репродуктивной системы. В научной и судебно-медицинской литературе общепризнанным считается, что сперматозоиды могут сохраняться во влагалище и шейке матки в течение приблизительно <strong>3–7 дней</strong>. Более ранние утверждения о том, что сперматозоиды могут выживать до 17 или 19 дней, считаются сомнительными и не подтверждёнными надёжными исследованиями.</p>

            <h3>✅ Вывод</h3>

            <p>Таким образом, <strong>непосредственно во влагалище</strong> сперматозоиды живут недолго — от нескольких минут до нескольких часов. Большая их часть погибает из-за кислой среды. Однако, если говорить о способности сперматозоидов к оплодотворению в целом после попадания в женский организм, то жизнеспособные клетки могут сохраняться в верхних отделах репродуктивной системы (матке и трубах) в течение <strong>3–5 дней</strong>, что и определяет возможность зачатия за несколько дней до овуляции.</p>
          </div>
        </ion-content>
      </ion-modal>

      <!-- про овуляцию -->
      <ion-modal
          :is-open="isOvulationInfoModalOpen"
          keep-contents-mounted="true"
          @did-dismiss="isOvulationInfoModalOpen = false"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button @click="isOvulationInfoModalOpen = false">
                Закрыть&nbsp;&nbsp;
                <ion-icon :icon="closeCircle" size="large"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="article">
            <h2>📆 Как понять, когда именно овуляция?</h2>

            <p>Овуляция — это выход созревшей яйцеклетки из яичника в брюшную полость, после чего она попадает в маточную трубу. Это центральное событие менструального цикла, определяющее возможность зачатия. Чтобы точно определить этот момент, можно использовать несколько методов, от субъективных ощущений до точных медицинских тестов.</p>

            <h3>🩸 Календарный метод (расчёт по циклу, используется в этом приложении)</h3>

            <p>Самый простой, но и наименее точный способ. Подходит только женщинам с регулярным циклом.</p>

            <ul>
              <li><strong>Формула:</strong> Овуляция обычно происходит за <strong>14 дней до начала</strong> следующей менструации (при 28-дневном цикле это день 14).</li>
              <li><strong>Пример:</strong> Если цикл длится 30 дней, овуляция ожидается на 16-й день (30 – 14 = 16).</li>
              <li><strong>Важно:</strong> Метод даёт большую погрешность, так как длина цикла может колебаться.</li>
            </ul>

            <h3>🌡️ Метод базальной температуры (БТ)</h3>

            <p>Это один из самых популярных домашних способов. Он основан на изменении температуры тела в зависимости от фазы цикла.</p>

            <ul>
              <li><strong>Как измерять:</strong> Каждое утро, не вставая с постели, сразу после пробуждения, измеряйте температуру во рту, влагалище или прямой кишке (ректально — самый точный вариант).</li>
              <li><strong>Что вы увидите:</strong> В первой фазе цикла температура держится на низких значениях (≈ 36,4–36,7 °C). В день овуляции она падает на 0,2–0,3 °C, а на следующий день <strong>резко повышается</strong> на 0,4–0,6 °C и остаётся высокой до конца цикла.</li>
              <li><strong>Вывод:</strong> Овуляция произошла в день падения температуры или за день до её скачка.</li>
            </ul>

            <h3>🧪 Тесты на овуляцию (аптечные полоски)</h3>

            <p>Самый точный метод для домашнего использования. Они реагируют на резкий выброс лютеинизирующего гормона (ЛГ), который происходит за <strong>24–48 часов</strong> до выхода яйцеклетки.</p>

            <ul>
              <li><strong>Как использовать:</strong> Начинайте тестирование за 3–5 дней до предполагаемой овуляции (по календарю). Делайте тест ежедневно, желательно в одно и то же время (не с утра, а в середине дня, так как ЛГ вырабатывается утром).</li>
              <li><strong>Результат:</strong> Если вторая полоска яркая или темнее контрольной — это <strong>«положительный»</strong> результат. Он означает, что овуляция наступит в ближайшие 24–48 часов.</li>
            </ul>

            <h3>🔬 УЗИ-фолликулометрия (самый надёжный способ)</h3>

            <p>Это медицинский метод, при котором врач с помощью УЗИ отслеживает рост доминантного фолликула в яичнике.</p>

            <ul>
              <li><strong>Процесс:</strong> Первое УЗИ делается на 7–10 день цикла. Затем повторяется каждые 2–3 дня до момента, когда фолликул достигает размера 18–24 мм.</li>
              <li><strong>Признак овуляции на УЗИ:</strong> Исчезновение большого фолликула и появление свободной жидкости позади матки.</li>
              <li><strong>Плюс:</strong> Это единственный метод, который даёт 100% гарантию того, что овуляция состоялась (или не состоялась).</li>
            </ul>

            <h3>👀 Субъективные ощущения (симптомы)</h3>

            <p>Некоторые женщины чувствуют овуляцию физически. Эти признаки не являются достоверными, но в сочетании с другими методами дают хорошую картину.</p>

            <ul>
              <li><strong>Боль внизу живота:</strong> Часто с одной стороны (с той, где созревает яйцеклетка). Это может быть тянущее или колющее ощущение (миттельшмерц).</li>
              <li><strong>Характер выделений:</strong> Цервикальная слизь становится прозрачной, тягучей и скользкой, как яичный белок. Это сигнал, что тело готово к зачатию.</li>
              <li><strong>Повышение либидо:</strong> Природа берёт своё — в день овуляции многие женщины отмечают усиление сексуального влечения.</li>
            </ul>

            <h3>📱 Мобильные приложения и умные гаджеты</h3>

            <p>Современные технологии позволяют отслеживать цикл автоматически. Приложения (Flo, Clue, Ovia) анализируют введённые данные (температуру, выделения, календарь) и дают прогноз. Существуют также умные датчики, которые измеряют температуру ночью или анализируют состав пота.</p>

            <h3>✅ Вывод: как выбрать лучший метод</h3>

            <p>Ни один из методов (кроме УЗИ) не даёт абсолютной гарантии, так как цикл может сместиться из-за стресса, болезни или смены климата.</p>

            <ul>
              <li><strong>Для планирования беременности:</strong> Используйте <strong>тесты на овуляцию</strong> в сочетании с <strong>измерением базальной температуры</strong> — это лучшая комбинация для дома.</li>
              <li><strong>Для точного диагноза (например, при бесплодии):</strong> Только <strong>УЗИ-мониторинг</strong>, который проведёт врач.</li>
              <li><strong>Для общего понимания:</strong> Ведите календарь, отмечайте выделения и ощущения — так вы лучше узнаете свой организм.</li>
            </ul>

            <p>Помните: овуляция длится всего <strong>12–24 часа</strong>, но «фертильное окно» (время, когда возможна беременность) открывается за 5 дней до овуляции, так как сперматозоиды могут ждать яйцеклетку в половых путях.</p>
          </div>
        </ion-content>
      </ion-modal>

      <!-- про признаки беременности -->
      <ion-modal
          :is-open="isPregnancySignsModalOpen"
          keep-contents-mounted="true"
          @did-dismiss="isPregnancySignsModalOpen = false"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button @click="isPregnancySignsModalOpen = false">
                Закрыть&nbsp;&nbsp;
                <ion-icon :icon="closeCircle" size="large"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="article">
            <h2>🤰 Признаки беременности</h2>

            <p>Ранние признаки беременности могут появиться уже через несколько дней после зачатия, однако у каждой женщины они проявляются по-разному. Важно понимать, что ни один из симптомов (кроме положительного теста или УЗИ) не является стопроцентным подтверждением беременности, так как многие из них могут совпадать с предменструальным синдромом (ПМС).</p>

            <p>Ниже приведён полный список возможных признаков — от самых ранних до наиболее очевидных, с разбивкой по срокам их появления.</p>

            <h3>⏰ Самые ранние признаки (1–2 недели после зачатия)</h3>

            <p>Эти симптомы могут возникнуть ещё до задержки менструации. Они связаны с гормональной перестройкой организма, в первую очередь с ростом уровня ХГЧ (хорионического гонадотропина) и прогестерона.</p>

            <ul>
              <li><strong>Имплантационное кровотечение:</strong> Небольшие мажущие выделения розового или коричневого цвета, возникающие, когда оплодотворённая яйцеклетка прикрепляется к стенке матки. Это происходит примерно на <strong>6–12 день</strong> после зачатия и длится не более 1–2 дней.</li>
              <li><strong>Повышение базальной температуры:</strong> Если вы ведёте график БТ, то признаком беременности является температура выше <strong>37 °C</strong>, которая не снижается более 14 дней подряд.</li>
              <li><strong>Учащённое мочеиспускание:</strong> Уже на ранних сроках увеличение объёма крови и давление растущей матки на мочевой пузырь могут вызывать частые позывы в туалет.</li>
              <li><strong>Чувствительность груди:</strong> Грудь становится набухшей, болезненной, соски — особенно чувствительными. Венозная сетка на груди может стать более заметной.</li>
              <li><strong>Изменение вкусовых предпочтений и обоняния:</strong> Внезапное отвращение к любимым продуктам (например, кофе или рыбе) или, наоборот, непреодолимая тяга к определённой пище. Также резко обостряется восприятие запахов.</li>
            </ul>

            <h3>📅 Признаки на 3–4 неделе (первая неделя задержки)</h3>

            <p>На этом сроке большинство женщин уже замечают отсутствие менструации и начинают подозревать беременность. Симптомы становятся более выраженными.</p>

            <ul>
              <li><strong>Задержка менструации:</strong> Самый очевидный и классический признак. Однако задержка может быть вызвана и другими причинами (стресс, смена климата, гормональный сбой), поэтому требует подтверждения.</li>
              <li><strong>Тошнота и утренняя слабость (токсикоз):</strong> Хотя принято говорить об «утренней» тошноте, на самом деле она может возникать в любое время суток. Сопровождается головокружением, слабостью и повышенной утомляемостью.</li>
              <li><strong>Вздутие живота и запоры:</strong> Прогестерон замедляет работу кишечника, что приводит к ощущению тяжести, метеоризму и запорам.</li>
              <li><strong>Сонливость и хроническая усталость:</strong> Организм переключается на режим «энергосбережения», чтобы обеспечить все ресурсы для развития эмбриона. Желание спать днём становится обычным делом.</li>
              <li><strong>Перепады настроения:</strong> Резкие смены эмоций — от радости до слез и раздражительности — связаны с «гормональной бурей» в организме.</li>
            </ul>

            <h3>🔬 Достоверные признаки (подтверждение беременности)</h3>

            <p>Эти методы дают уже не субъективное ощущение, а объективный результат.</p>

            <ul>
              <li><strong>Аптечный тест на беременность:</strong> Современные тесты (особенно струйные и цифровые) обладают высокой чувствительностью и могут показать положительный результат за <strong>4–5 дней до задержки</strong>. Для точности рекомендуется повторить тест через 2 дня или сделать его утром, когда концентрация ХГЧ максимальна.</li>
              <li><strong>Анализ крови на ХГЧ:</strong> Это самый ранний и точный лабораторный метод. Уровень ХГЧ в крови начинает расти уже через <strong>8–10 дней</strong> после зачатия. В отличие от теста, анализ крови даёт количественный результат, который позволяет врачу отслеживать динамику беременности.</li>
              <li><strong>УЗИ органов малого таза:</strong> Трансвагинальное УЗИ способно показать плодное яйцо в матке уже на <strong>4–5 неделе</strong> беременности (примерно через 2–3 недели после зачатия), а сердцебиение эмбриона — с <strong>5–6 недели</strong>.</li>
            </ul>

            <h3>👁️ Визуальные и физические изменения на более поздних сроках</h3>

            <p>Начиная с 5–6 недели и далее, к перечисленным симптомам присоединяются внешние изменения, которые уже сложно не заметить.</p>

            <ul>
              <li><strong>Потемнение ареол сосков:</strong> Круги вокруг сосков становятся темнее и увеличиваются в размерах.</li>
              <li><strong>Появление пигментации:</strong> На лице может появиться «маска беременности» (хлоазма) — тёмные пятна на лбу и щеках. Также может потемнеть вертикальная линия на животе (linea nigra).</li>
              <li><strong>Изменения кожи и волос:</strong> У одних женщин кожа становится идеальной (сияющий эффект), у других, наоборот, появляются прыщи из-за гормональной активности. Волосы могут стать жирнее или суше.</li>
              <li><strong>Увеличение живота:</strong> Хотя заметный рост живота обычно начинается с 12–16 недель, на ранних сроках может возникать ощущение «распирания» из-за вздутия и задержки жидкости.</li>
            </ul>

            <h3>⚠️ Важные нюансы и предостережения</h3>

            <p>Некоторые симптомы должны насторожить женщину и стать поводом для срочного обращения к врачу.</p>

            <ul>
              <li><strong>Интенсивное кровотечение:</strong> Если вместо скудных выделений открылось обильное кровотечение, похожее на менструацию, это может быть признаком выкидыша или внематочной беременности.</li>
              <li><strong>Сильная боль внизу живота или в боку:</strong> Острая, режущая боль, особенно с одной стороны, может указывать на внематочную беременность.</li>
              <li><strong>Отсутствие каких-либо симптомов:</strong> Беременность без токсикоза и прочих признаков — это абсолютно нормальный вариант. Некоторые женщины узнают о своём положении только на 3–4 месяце. Поэтому при любой задержке рекомендуется сделать тест, даже если вы прекрасно себя чувствуете.</li>
            </ul>

            <h3>✅ Вывод: как не ошибиться в диагнозе</h3>

            <p>Самодиагностика по субъективным ощущениям часто бывает ошибочной. ПМС и ранние признаки беременности могут быть практически идентичны. Чтобы точно убедиться, следуйте простому алгоритму:</p>

            <ul>
              <li><strong>Шаг 1:</strong> Дождитесь первого дня задержки и сделайте аптечный тест на беременность утром.</li>
              <li><strong>Шаг 2:</strong> При положительном или сомнительном результате сдайте <strong>анализ крови на ХГЧ</strong> в клинике.</li>
              <li><strong>Шаг 3:</strong> Через 1–2 недели посетите гинеколога для подтверждения маточной беременности с помощью <strong>УЗИ</strong>.</li>
            </ul>

            <p>Только сочетание этих трёх шагов даёт стопроцентную гарантию правильного ответа.</p>
          </div>
        </ion-content>
      </ion-modal>

      <!-- другие факторы -->
      <ion-modal
          :is-open="isOtherFactorsInfoModalOpen"
          keep-contents-mounted="true"
          @did-dismiss="isOtherFactorsInfoModalOpen = false"
      >
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button @click="isOtherFactorsInfoModalOpen = false">
                Закрыть&nbsp;&nbsp;
                <ion-icon :icon="closeCircle" size="large"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <div class="article">
            <h2>⚠️ Дополнительные факторы, влияющие на фертильность и здоровье яйцеклеток</h2>

            <p>Помимо алкоголя и курения, существует ряд других факторов, которые могут негативно влиять на качество яйцеклеток, овариальный резерв и способность к зачатию. Некоторые из них поддаются коррекции, другие требуют особого внимания.</p>

            <h3>🌡️ Перегрев (термальное воздействие)</h3>
            <ul>
              <li><strong>Влияние:</strong> Повышение температуры тела негативно сказывается на созревании яйцеклеток. Перегрев может нарушить процесс деления клеток.</li>
              <li><strong>Источники риска:</strong> Частое посещение саун, горячих ванн, соляриев, работа в горячих цехах, а также сезонные заболевания с высокой температурой.</li>
              <li><strong>Рекомендация:</strong> Избегать перегрева за 2-3 месяца до планируемого зачатия. При болезни с высокой температурой обязательно консультироваться с врачом.</li>
            </ul>

            <h3>🧪 Химические вещества и токсины</h3>
            <ul>
              <li><strong>Влияние:</strong> Некоторые химические соединения являются эндокринными разрушителями (нарушают гормональный фон) и могут напрямую повреждать яйцеклетки.</li>
              <li><strong>Источники риска:</strong> Пестициды в неорганических продуктах, фталаты и парабены в косметике и бытовой химии, тяжелые металлы (свинец, ртуть), некоторые растворители и пластификаторы (BPA в пластике).</li>
              <li><strong>Рекомендация:</strong> Выбирать органические продукты, использовать безопасную бытовую химию, избегать нагрева пластиковой посуды, отдавать предпочтение натуральной косметике.</li>
            </ul>

            <h3>🌙 Нарушения сна и циркадных ритмов</h3>
            <ul>
              <li><strong>Влияние:</strong> Хронический недосып и работа в ночные смены нарушают выработку мелатонина и кортизола, что сбивает гормональный цикл и может угнетать овуляцию.</li>
              <li><strong>Исследования:</strong> Работницы с ночными сменами имеют более высокий риск нарушений менструального цикла и снижения фертильности.</li>
              <li><strong>Рекомендация:</strong> Соблюдать режим сна (7-8 часов), ложиться до полуночи, минимизировать синий свет от экранов за час до сна.</li>
            </ul>

            <h3>💊 Лекарственные препараты</h3>
            <ul>
              <li><strong>Влияние:</strong> Некоторые лекарства могут негативно влиять на созревание фолликулов и овуляцию, а также накапливаться в тканях яичников.</li>
              <li><strong>Группы риска:</strong> Длительный прием антибиотиков (особенно тетрациклинового ряда), некоторые антидепрессанты, нейролептики, гормональные препараты (без назначения врача), а также химиотерапевтические средства.</li>
              <li><strong>Рекомендация:</strong> Всегда сообщать врачу о планировании беременности перед началом лечения. При необходимости корректировать терапию под наблюдением специалиста.</li>
            </ul>

            <h3>🦠 Инфекции и воспалительные заболевания</h3>
            <ul>
              <li><strong>Влияние:</strong> Хронические воспалительные процессы в органах малого таза могут приводить к образованию спаек, нарушению кровоснабжения яичников и снижению овариального резерва.</li>
              <li><strong>Источники риска:</strong> Инфекции, передающиеся половым путем (хламидиоз, гонорея и другие), эндометриоз, хронический сальпингоофорит.</li>
              <li><strong>Рекомендация:</strong> Своевременно лечить инфекции, проходить профилактические осмотры у гинеколога не реже 1 раза в год.</li>
            </ul>

            <h3>😰 Хронический стресс</h3>
            <ul>
              <li><strong>Влияние:</strong> Постоянное повышенное содержание кортизола подавляет выработку гонадотропинов (ФСГ и ЛГ), необходимых для созревания яйцеклетки и овуляции.</li>
              <li><strong>Проявления:</strong> Нарушение цикла, отсутствие овуляции, снижение либидо.</li>
              <li><strong>Рекомендация:</strong> Практиковать техники релаксации (медитация, дыхательные упражнения), уделять время хобби, нормализовать физическую активность, при необходимости — обратиться к психологу.</li>
            </ul>

            <h3>📉 Недостаток веса или ожирение</h3>
            <ul>
              <li><strong>Влияние:</strong> Как недостаток жировой ткани, так и ее избыток нарушают баланс эстрогенов, что приводит к нарушению овуляции.</li>
              <li><strong>Проявления:</strong> При ИМТ &lt; 18,5 цикл может становиться ановуляторным. При ИМТ &gt; 30 повышается риск поликистоза яичников и резистентности к инсулину.</li>
              <li><strong>Рекомендация:</strong> Поддерживать здоровый вес (ИМТ 18,5-24,9). Рекомендуется консультация диетолога при необходимости коррекции массы тела.</li>
            </ul>

            <h3>☕ Кофеин</h3>
            <ul>
              <li><strong>Влияние:</strong> Чрезмерное употребление кофеина может повышать тонус матки, влиять на кровоснабжение органов малого таза и увеличивать время до наступления беременности.</li>
              <li><strong>Исследования:</strong> Потребление более 200-300 мг кофеина в сутки (2-3 чашки кофе) связывают со снижением фертильности.</li>
              <li><strong>Рекомендация:</strong> Ограничить потребление кофеина до 1-2 чашек кофе в день, отдавая предпочтение натуральному молотому кофе без добавок. Также учитывать кофеин в чае, энергетиках и шоколаде.</li>
            </ul>

            <h3>🌿 Некоторые продукты и добавки</h3>
            <ul>
              <li><strong>Влияние:</strong> Некоторые травы и БАДы могут обладать эстрогенной активностью или влиять на свертываемость крови, что нежелательно при подготовке к зачатию.</li>
              <li><strong>Группа риска:</strong> Женьшень, солодка, зверобой, некоторые китайские травы в больших дозировках.</li>
              <li><strong>Рекомендация:</strong> Принимать БАДы и травяные чаи только после консультации с врачом, особенно если они назначены для повышения фертильности.</li>
            </ul>

            <h3>📊 Резюмирующая таблица факторов риска</h3>

            <div class="overflow">
              <table style="min-width: 600px">
                <thead>
                  <tr>
                    <th>Фактор</th>
                    <th>Степень влияния</th>
                    <th>Обратимость</th>
                    <th>Что делать</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Курение</td>
                    <td>Критическая</td>
                    <td>Частичная</td>
                    <td>Полный отказ за 3-6 месяцев до зачатия</td>
                  </tr>
                  <tr>
                    <td>Алкоголь</td>
                    <td>Высокая</td>
                    <td>Частичная</td>
                    <td>Полный отказ за 3 месяца до зачатия</td>
                  </tr>
                  <tr>
                    <td>Перегрев</td>
                    <td>Умеренная</td>
                    <td>Полная</td>
                    <td>Исключить сауны, горячие ванны на период планирования</td>
                  </tr>
                  <tr>
                    <td>Химические токсины</td>
                    <td>Высокая</td>
                    <td>Частичная</td>
                    <td>Минимизировать контакт с бытовой химией, выбирать органику</td>
                  </tr>
                  <tr>
                    <td>Нарушение сна</td>
                    <td>Умеренная</td>
                    <td>Полная</td>
                    <td>Нормализовать режим, спать не менее 7 часов</td>
                  </tr>
                  <tr>
                    <td>Хронический стресс</td>
                    <td>Высокая</td>
                    <td>Полная</td>
                    <td>Техники релаксации, отдых, при необходимости — терапия</td>
                  </tr>
                  <tr>
                    <td>Недостаток/избыток веса</td>
                    <td>Высокая</td>
                    <td>Полная</td>
                    <td>Коррекция питания, консультация диетолога</td>
                  </tr>
                  <tr>
                    <td>Кофеин (более 300 мг/сут)</td>
                    <td>Умеренная</td>
                    <td>Полная</td>
                    <td>Ограничить до 1-2 чашек кофе в день</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>💡 Главный вывод</h3>
            <p>Подготовка к зачатию — это комплексный процесс, который затрагивает все сферы жизни. Оптимальный срок для начала коррекции факторов риска — <strong>за 3-6 месяцев</strong> до планируемой беременности (в идеале — за год). За это время яйцеклетки проходят полный цикл созревания (около 90 дней), и ваш организм может подготовиться к зачатию в наилучших условиях.</p>

            <p>👨‍⚕️ Обязательно проконсультируйтесь с гинекологом-репродуктологом для индивидуального подбора рекомендаций с учетом ваших особенностей здоровья.</p>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>

    <AppFooter />
  </ion-page>
</template>
