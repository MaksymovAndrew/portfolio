/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Next inlines these at build time, so the list is the contract of what the build provides
declare namespace NodeJS {
    interface ProcessEnv {
        readonly APP_VERSION: string;
        readonly NEXT_PUBLIC_SITE_URL?: string;
    }
}
