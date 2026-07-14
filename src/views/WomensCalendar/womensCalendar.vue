<script setup lang="ts">
import styles from './womensCalendar.module.scss';
import stylesArtButton from '@/assets/styles/artButton.module.scss';
import stylesOverflowSection from '@/assets/styles/overflowSection.module.scss';
import AppHeader from '@/components/AppHeader/appHeader.vue';
import {IonContent, IonPage, IonIcon, IonModal, IonDatetime, IonButton, IonPicker, IonPickerColumn, IonPickerColumnOption, IonHeader, IonToolbar, IonButtons} from '@ionic/vue';
import { chevronForwardCircleOutline, closeCircle } from 'ionicons/icons';
import WidgetPageTitle from '@/components/Widgets/PageTitle/widgetPageTitle.vue';
import WidgetTipInfo from '@/components/Widgets/TipInfo/widgetTipInfo.vue';
import AppFooter from '@/components/AppFooter/appFooter.vue';
import UiDayCard from '@/components/Ui/DayCard/uiDayCard.vue';
import {ref, onMounted, computed, watch, nextTick} from 'vue';
import {appVars} from '@/configApp';
import {parseLocalDate, formatLocalDate, formatDisplayDate} from '@/composables/localDate';
import WidgetArtButton from '@/components/Widgets/ArtButton/widgetArtButton.vue';
import penguinArt from '@/assets/img/animals/penguin_art.webp';
import WidgetLinksList from '@/components/Widgets/LinksList/widgetLinksList.vue';

const SUB_THEME_COLOR = appVars.colors.womensCalendar;

const isPeriodDateModalOpen = ref( false );
const selectedPeriodDate = ref();
const isCycleModalOpen = ref( false );
const isAlcoholInfoModalOpen = ref( false );
const isSmokeInfoModalOpen = ref( false );
const isOtherFactorsInfoModalOpen = ref( false );
const cycleLength = ref< number >( appVars.ovulation.cycleDefault );
const maxDate = ref();
const buttonsRef = ref< HTMLElement >();

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

onMounted(() => {
  maxDate.value = formatLocalDate( new Date() ) + 'T23:59:59';
});

const lastPeriodDate = computed(() => {
  if ( !selectedPeriodDate.value ) {
    return '';
  }

  return selectedPeriodDate.value.split('T')[0];
});

const onCycleChange = ( event: CustomEvent ) => {
  cycleLength.value = Number( event.detail.value );
};

const ovulationDates = computed(() => {
  if ( !selectedPeriodDate.value ) {
    return null;
  }

  const periodStart: Date = parseLocalDate( selectedPeriodDate.value.split('T')[0] );
  const today: Date = new Date();
  today.setHours( 0, 0, 0, 0 );

  // Овуляция = начало последних месячных + длина цикла - лютеиновая фаза
  const ovulationDate: Date = new Date( periodStart );
  ovulationDate.setDate( ovulationDate.getDate() + cycleLength.value - appVars.ovulation.lutealPhase );

  // Если овуляция уже прошла — прогнозируем следующий цикл
  while ( ovulationDate < today ) {
    ovulationDate.setDate( ovulationDate.getDate() + cycleLength.value );
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

  // Дата рождения при зачатии в день овуляции — для перехода на страницу дня рождения
  const birthDate: Date = new Date( ovulationDate );
  birthDate.setDate( birthDate.getDate() + appVars.pregnancyDuration );

  return {
    early,
    peak,
    after,
    inappropriate,
    birthDate: formatLocalDate( birthDate ),
  };
});

const scrollToButtons = () => {
  buttonsRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// После расчёта дат проматываем страницу к кнопкам выбора
watch( ovulationDates, async ( value ) => {
  if ( !value ) {
    return;
  }

  await nextTick();
  scrollToButtons();
});
</script>

<template>
  <ion-page :class="styles.womensCalendar"
            :style="{
              '--brd-custom-theme-color': SUB_THEME_COLOR,
            }"
  >
    <AppHeader />

    <ion-content :fullscreen="true" class="ion-padding">
      <WidgetPageTitle
          :class="styles.womensCalendar__titleBlock"
          bg-image="cat-1"
          @click="scrollToButtons"
          title="Пора искать идеальное совпадение! ❤️"
          lead="
          Выберите даты в двух карточках ниже 👇 и мы рассчитаем день овуляции и период, когда вероятность оплодотворения яйцеклетки будет наиболее высокой. ✨"
          comment="Но помните: природа любит удивлять, а лучший советчик — ваш лечащий врач 👩‍⚕️"
      />

      <div ref="buttonsRef" :class="styles.womensCalendar__buttons">
        <div :class="stylesArtButton.artButton" @click="openPeriodDateModal">
          <div :class="stylesArtButton.artButton__art">
            <img src="@/assets/img/animals/cat-6_art.webp" alt="" />
          </div>

          <div :class="stylesArtButton.artButton__content">
            <div :class="stylesArtButton.artButton__title">
              Когда начались послед&shy;ние месячные?
            </div>

            <div :class="stylesArtButton.artButton__comment">
              {{ lastPeriodDate ? `📅 ${lastPeriodDate}` : 'Первый день последнего цикла' }}
            </div>
          </div>

          <div :class="stylesArtButton.artButton__art">
            <ion-icon :icon="chevronForwardCircleOutline" size="large"></ion-icon>
          </div>
        </div>

        <ion-modal
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

              <img :class="styles.womensCalendar__modalArt" src="@/assets/img/animals/cat-6_art.webp" alt="" />
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
              {{ `⏳ ${cycleLength} дн.` }}
            </div>
          </div>

          <div :class="stylesArtButton.artButton__art">
            <ion-icon :icon="chevronForwardCircleOutline" size="large"></ion-icon>
          </div>
        </div>

        <ion-modal
            :is-open="isCycleModalOpen"
            @did-dismiss="isCycleModalOpen = false"
        >
          <ion-content>
            <div class="center-content">
              <div>
              <ion-picker>
                <ion-picker-column :value="cycleLength" @ionChange="onCycleChange">
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

              <img :class="styles.womensCalendar__modalArt" src="@/assets/img/animals/hamster_art.webp" alt="" />
            </div>
          </ion-content>
        </ion-modal>
      </div>

      <div v-if="ovulationDates"
           :class="styles.womensCalendar__block"
      >
        <WidgetTipInfo :color="SUB_THEME_COLOR">
          Календарный метод даёт <span :style="{color: SUB_THEME_COLOR}">оценку, а не гарантию</span>: при нерегулярном цикле погрешность растёт. Зелёные дни — <span :style="{color: SUB_THEME_COLOR}">наибольшая вероятность зачатия</span> (пик — за 1–2 дня до овуляции), жёлтые — остальное фертильное окно, а все дни до и после окна — красные, зачатие в них маловероятно 😉
        </WidgetTipInfo>

        <div :class="stylesOverflowSection.overflowSection">
          <div :class="[
              styles.womensCalendar__dates,
              stylesOverflowSection.overflowSection__overflowWrapper
          ]">
            <div v-for="date in ovulationDates.early" :key="date">
              <UiDayCard :date="parseLocalDate( date )" color="warning" />
            </div>

            <div v-for="date in ovulationDates.peak" :key="date">
              <UiDayCard :date="parseLocalDate( date )" color="success" />
            </div>

            <div v-for="date in ovulationDates.after" :key="date">
              <UiDayCard :date="parseLocalDate( date )" color="warning" />
            </div>

            <div v-for="date in ovulationDates.inappropriate" :key="date">
              <UiDayCard :date="parseLocalDate( date )" color="error" />
            </div>
          </div>
        </div>
      </div>

      <WidgetArtButton
          v-if="ovulationDates"
          :color="appVars.colors.childBirthday"
          :title="`Малыш может родиться примерно <span style='color: ${SUB_THEME_COLOR}'>${ formatDisplayDate( parseLocalDate( ovulationDates.birthDate )) }</span> Давайте посмотрми, что интересного будет в этот день? 🐣`"
          comment="Праздники, именины, знак зодиака и памятные даты"
          :link="`/childBirthday?birthDate=${ovulationDates.birthDate}`"
          :art-src="penguinArt"
      />

      <WidgetLinksList :class="styles.womensCalendar__block">
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
