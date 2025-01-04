import { BrowserWindowConstructorOptions } from 'electron';

export const DEFAULT_CONFIG: BrowserWindowConstructorOptions = {
  useContentSize: false,
  center: false,
  minWidth: 106,
  minHeight: 60,
  resizable: true,
  alwaysOnTop: false,
  fullscreen: false,
  skipTaskbar: false,
  kiosk: false,
  title: 'TL8',
  show: true,
  frame: true,
  acceptFirstMouse: false,
  disableAutoHideCursor: false,
  autoHideMenuBar: true,
  enableLargerThanScreen: false,
  backgroundColor: '#fff',
  darkTheme: false,
  transparent: false,
};
