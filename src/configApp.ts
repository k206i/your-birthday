export const appVars = {
  floatingAlertTimer: 5, // секунд
  dayAdditionalPeriod: 14, // Дни до и после нормального течения беременности
  dayNormalPeriod: 18, // Погрешность в днях, соответствующая нормальному течению беременности
  pregnancyDuration: 280, // Дней. Акушерский срок (от первого дня последних месячных)
  abstinenceEjaculationDuration: { // Воздержание от эякуляции в днях
    short: 0,
    normal: 3,
    long: 7,
  },
  abstinenceAlcoholDuration: { // Воздержание от алкоголя в днях
    short: 60, // Значительное улучшение качества спермы
    normal: 80, // Цикл сперматогенеза, полное обновление популяции
  },
  ovulation: { // Расчёт дня овуляции
    lutealPhase: 14, // Дней от овуляции до следующих месячных (лютеиновая фаза)
    fertileDaysBefore: 5, // Фертильные дни до овуляции
    peakDaysBefore: 2, // Пиковые (наиболее вероятные) дни до овуляции
    fertileDaysAfter: 1, // Фертильные дни после овуляции
    totalDays: 9, // Общее число карточек в выдаче (недостаток добирается красными днями)
    cycleMin: 21, // Минимальная длина цикла в днях
    cycleMax: 40, // Максимальная длина цикла в днях
    cycleDefault: 28, // Длина цикла по умолчанию
  },
  lifeExpectancyWeeks: 5720, // Желаемая продолжительность жизни в неделях (110 лет × 52; сетка LifeProgress)
  birthdaySoonDays: 3, // За сколько дней начинать срочно напоминать о чужом ДР
  colors: {
    childBirthday: '#35b79b',
    dayConception: '#a876ec',
    maleCalendar: '#548fd6',
    femaleCalendar: '#ff8bef',
    lifeProgress: '#3DFF07',
    achievements: '#F2B348',
    donations: '#FF8BEF',
  },
  achievementColors: {
    common: '#8B8FA3',
    rare: '#57C5E3',
    epic: '#A876EC',
    legendary: '#F2B348',
    mythic: '#FF6EC7',
    special: '#6ae340',
  },
  achievementTranslates: {
    common: 'Обычное',
    rare: 'Редкое',
    epic: 'Эпичное',
    legendary: 'Легендарное',
    mythic: 'Мифическое',
    special: 'Специальное',
  },
  donations: {
    onceUrl: 'https://pay.cloudtips.ru/p/460b7ab7',
    subscribeDonation: 'https://boosty.to/k206i',
  }
}