// BUILD INFO — generated at compile time for version tracking
// DO NOT EDIT — values are replaced by the prebuild script

export const APP_VERSION = '0.1.0'
export const BUILD_TIME = '2026-07-19T18:00:00Z'
export const BUILD_ID = 'b0a1b2c3d4e5'
export const COMMIT_SHA = '278b81c'

export const FULL_VERSION = `v${APP_VERSION} (${BUILD_ID}) @ ${BUILD_TIME}`

// Injected into window for runtime verification
export function injectBuildInfo() {
  if (typeof window !== 'undefined') {
    ;(window as any).__ZAFIRO_BUILD__ = {
      version: APP_VERSION,
      buildId: BUILD_ID,
      buildTime: BUILD_TIME,
      commitSha: COMMIT_SHA,
      full: FULL_VERSION,
    }
  }
}
