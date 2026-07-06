# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"День рождения" — мобильное приложение (Ionic 8 + Vue 3 + Capacitor) для планирования рождения ребёнка и поиска совпадений с интересными датами. UI-тексты — на русском языке.

## Commands

```bash
npm run dev            # dev-сервер Vite
npm run build          # vue-tsc (проверка типов) + vite build
npm run build:android  # ionic capacitor build android (нужен Android Studio)
npm run lint           # eslint .
npm run test:unit      # Vitest (unit-тесты в tests/unit/)
npx vitest run tests/unit/example.spec.ts   # один unit-тест
npm run test:e2e       # Cypress (e2e-тесты в tests/e2e/specs/)
```

## Architecture

Vue 3 Composition API (`<script setup lang="ts">`), TypeScript strict, Vite, alias `@` → `src/`.

### Слои

- **`src/views/<PageName>/pageName.vue`** — страницы, регистрируются в `src/router/index.ts`. Каждая страница задаёт `SUB_THEME_COLOR` и передаёт его в CSS-переменную `--brd-custom-theme-color` на `ion-page` — от неё красится вся страница.
- **`src/api/*.ts`** — «API»-слой: async-функции, которые читают локальные JSON из `src/jsons/` и возвращают типизированные ответы. Сетевых запросов нет. Каждая функция экспортирует свой тип ответа (`TGetHolidaysNamesResponse` и т.п.).
- **`src/jsons/*.json`** — датасеты (праздники, именины, зодиак, знаменитости). Даты хранятся в формате `DD-MM`.
- **`src/configApp.ts`** — объект `appVars` со всеми доменными константами (сроки беременности, периоды воздержания). Никогда не хардкодить эти числа в компонентах — только через `appVars`.
- **`src/composables/*.ts`** — чистые утилиты (например, `getNewFormattedDate`).
- **`src/components/`** — переиспользуемые компоненты:
  - `AppHeader/`, `AppFooter/` — каркас страницы;
  - `Widgets/<Name>/widget<Name>.vue` — крупные блоки страниц (префикс `Widget` в имени компонента, `widget` в имени файла);
  - `Ui/<Name>/ui<Name>.vue` — мелкие UI-элементы (префикс `Ui`/`ui`).

### Стили

- CSS Modules: каждый `.vue` имеет парный `<имяФайла>.module.scss`, импортируется как `styles`; классы в BEM-подобной нотации `block__element`.
- Общие модули стилей — в `src/assets/styles/` (`artButton.module.scss`, `overflowSection.module.scss`), импортируются компонентами напрямую.
- Глобальные CSS-переменные проекта имеют префикс `--brd-`.

### Соглашения

- Имена файлов компонентов — camelCase, каталоги — PascalCase.
- Типы — с префиксом `T` (`TPayload`, `THolidayData`).
- Пропсы — через `defineProps<{...}>()`, в шаблоне обращение через `props.x`.
- Все `ion-datetime`: `locale="ru-RU"` и `:first-day-of-week="1"` (именно number-binding, строка ломает типы).
- Тёмная тема включена постоянно (`dark.always.css` в `main.ts`).

## Code style

- Пробелы внутри скобок: `if ( !value )`, `new Date( x )`, `fn( a, b )`, `for ( let i = 0; ... )`.
- Явные TS-аннотации на переменных: `const d: Date = new Date( base )`.
- Ранний return всегда в блоке `{}` на отдельной строке, не однострочно.
- Пустые строки между логическими блоками внутри функций.
