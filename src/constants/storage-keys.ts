/**
 * Storage Keys Constants
 * Safe keys for local/session storage.
 * NEVER store unencrypted sensitive master keys or API secrets here.
 */

export const STORAGE_KEYS = {
  THEME_MODE: "finora_theme_mode",
  LOCALE: "finora_locale",
  CURRENCY_PREFERENCE: "finora_currency_pref",
  SIDEBAR_COLLAPSED: "finora_sidebar_collapsed",
  ACTIVE_WORKSPACE_ID: "finora_active_workspace_id",
} as const;
