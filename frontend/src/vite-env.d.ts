// src/vite-env.d.ts
/// <reference types="vite/client" />

// 1. List your VITE_ variables here (add more as needed)
interface ImportMetaEnv {
    readonly VITE_API_URL: string
    readonly VITE_FEATURE_FLAG?: string
    // add other VITE_* keys here…
}

// 2. Tell TS that import.meta.env has that shape
interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module '*.scss';