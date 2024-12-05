import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    action?: string
    subject?: string
    layoutWrapperClasses?: string
    navActiveLink?: RouteLocationRaw
  }
  // src/env.d.ts
  interface ImportMetaEnv {
    readonly VITE_APP_GRANT_TYPE: string;
    readonly VITE_APP_API_ROOT: string;
    readonly VITE_APP_CLIENT_ID: string;
    readonly VITE_APP_CLIENT_SECRET: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

}
