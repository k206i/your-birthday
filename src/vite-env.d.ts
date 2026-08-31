/// <reference types="vite/client" />

declare const __APP_VERSION__: string
declare const __UPDATE_CHECK__: boolean

declare module '*.svg?component' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module '*.svg?url' {
  const src: string
  export default src
}
