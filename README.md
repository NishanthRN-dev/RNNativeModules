# TurboModuleExample

React Native project demonstrating **Android Turbo Modules** (New Architecture).

## Native Modules

### NativeLocalStorage

Key-value storage module. Internally uses Android `SharedPreferences`.

| Method | Description |
|--------|-------------|
| `setItem(value, key)` | Save a value |
| `getItem(key)` | Retrieve a value |
| `removeItem(key)` | Delete a value |
| `clear()` | Clear all data |

### NativeDocumentScanner

Document scanner using Google ML Kit SDK.

| Method | Description |
|--------|-------------|
| `scanDocument(pageLimit)` | Opens camera scanner, returns image URI |

**How it works:**

1. JS calls `scanDocument(pageLimit)` → Promise created
2. Native module configures ML Kit options (page limit, formats, scanner mode)
3. ML Kit opens built-in camera UI — no custom camera code needed
4. ML Kit detects document edges, auto crops, removes shadows, fixes rotation
5. User confirms scan → `onActivityResult` receives scanned image
6. Native module resolves Promise with image URI back to JS
7. JS displays scanned image using the returned URI

## Project Structure

```
specs/                              # TypeScript specs (codegen input)
├── NativeLocalStorage.ts
└── NativeDocumentScanner.ts

android/.../com/
├── nativelocalstorage/
│   ├── NativeLocalStorageModule.kt
│   └── NativeLocalStoragePackage.kt
├── nativedocumentscanner/
│   ├── NativeDocumentScannerModule.kt
│   └── NativeDocumentScannerPackage.kt
└── turbomoduleexample/
    ├── MainActivity.kt
    └── MainApplication.kt
```

## Run

```bash
npm install
npm run android
```
