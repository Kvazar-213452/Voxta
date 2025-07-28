import { BrowserWindow } from 'electron';

let _mainWindow: BrowserWindow | undefined;

export function setMainWindow(window: BrowserWindow): void {
  _mainWindow = window;
}

export function getMainWindow(): BrowserWindow {
  if (!_mainWindow) {
    throw new Error('MainWindow error');
  }
  return _mainWindow;
}
