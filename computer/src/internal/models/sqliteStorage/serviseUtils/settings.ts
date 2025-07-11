import { getDatabase } from '../servise';

export function saveSettings(settings: Settings): void {
  getDatabase().prepare(`DELETE FROM settings`).run();

  const stmt = getDatabase().prepare(`
    INSERT INTO settings (
      darkMode,
      browserNotifications,
      doNotDisturb,
      language,
      readReceipts,
      onlineStatus
    ) VALUES (
      @darkMode,
      @browserNotifications,
      @doNotDisturb,
      @language,
      @readReceipts,
      @onlineStatus
    )
  `);

  stmt.run({
    darkMode: settings.darkMode ? 1 : 0,
    browserNotifications: settings.browserNotifications ? 1 : 0,
    doNotDisturb: settings.doNotDisturb ? 1 : 0,
    language: settings.language,
    readReceipts: settings.readReceipts ? 1 : 0,
    onlineStatus: settings.onlineStatus ? 1 : 0
  });
}

export function getSettings(): Settings | null {
  try {
    const row = getDatabase().prepare(`SELECT * FROM settings LIMIT 1`).get();
    if (!row) return null;

    return {
      darkMode: !!row.darkMode,
      browserNotifications: !!row.browserNotifications,
      doNotDisturb: !!row.doNotDisturb,
      language: row.language,
      readReceipts: !!row.readReceipts,
      onlineStatus: !!row.onlineStatus
    };
  } catch (error) {
    console.error('Failed to get settings:', error);
    return null;
  }
}

export function deleteSettings() {
  getDatabase().prepare(`DELETE FROM settings`).run();
}
