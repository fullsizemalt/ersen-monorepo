/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_STRIPE_PUBLIC_KEY: string
    readonly VITE_WORKOS_CLIENT_ID: string
    readonly VITE_WORKOS_REDIRECT_URI: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
