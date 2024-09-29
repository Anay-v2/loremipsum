interface ImportMetaEnv {
    readonly API_KEY: string
    readonly AUTH_DOMAIN: string
    readonly DATABASE_URL: string
    readonly PROJECT_ID: string
    readonly STORAGE_BUCKET: string
    readonly MESSAGING_SENDER_ID: string
    readonly APP_ID: string
    readonly GOOGLE_APPLICATION_CREDENTIALS: string
}
    
interface ImportMeta {
    readonly env: ImportMetaEnv
}