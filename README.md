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
