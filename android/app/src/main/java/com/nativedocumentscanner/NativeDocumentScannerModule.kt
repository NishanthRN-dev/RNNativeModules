package com.nativedocumentscanner

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.google.mlkit.vision.documentscanner.GmsDocumentScanning
import com.google.mlkit.vision.documentscanner.GmsDocumentScannerOptions
import com.google.mlkit.vision.documentscanner.GmsDocumentScanningResult
import com.nativelocalstorage.NativeDocumentScannerSpec

class NativeDocumentScannerModule(reactContext: ReactApplicationContext) :
    NativeDocumentScannerSpec(reactContext), ActivityEventListener {

    private var scanPromise: Promise? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName() = NAME

    override fun scanDocument(pageLimit: Double, promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("E_NO_ACTIVITY", "Activity is not available")
            return
        }

        scanPromise = promise

        val options = GmsDocumentScannerOptions.Builder()
            .setGalleryImportAllowed(true)
            .setPageLimit(pageLimit.toInt())
            .setResultFormats(
                GmsDocumentScannerOptions.RESULT_FORMAT_JPEG,
                GmsDocumentScannerOptions.RESULT_FORMAT_PDF
            )
            .setScannerMode(GmsDocumentScannerOptions.SCANNER_MODE_FULL)
            .build()

        val scanner = GmsDocumentScanning.getClient(options)

        scanner.getStartScanIntent(activity)
            .addOnSuccessListener { intentSender ->
                activity.startIntentSenderForResult(
                    intentSender,
                    SCAN_REQUEST_CODE,
                    null, 0, 0, 0
                )
            }
            .addOnFailureListener { e: Exception ->
                scanPromise?.reject("E_SCAN_FAILED", e.message)
                scanPromise = null
            }
    }

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != SCAN_REQUEST_CODE) return

        if (resultCode == Activity.RESULT_OK && data != null) {
            val result = GmsDocumentScanningResult.fromActivityResultIntent(data)
            val pages: List<GmsDocumentScanningResult.Page>? = result?.pages
            if (pages != null && pages.isNotEmpty()) {
                val firstPageUri = pages[0].getImageUri().toString()
                scanPromise?.resolve(firstPageUri)
            } else {
                scanPromise?.reject("E_NO_PAGES", "No pages scanned")
            }
        } else {
            scanPromise?.reject("E_SCAN_CANCELLED", "Scan was cancelled")
        }
        scanPromise = null
    }

    override fun onNewIntent(intent: Intent) {}

    companion object {
        const val NAME = "NativeDocumentScanner"
        private const val SCAN_REQUEST_CODE = 1234
    }
}
