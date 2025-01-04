import { BrowserView, OpenDevToolsOptions } from 'electron';

export function openDevTools(
  view: BrowserView,
  options: OpenDevToolsOptions = { mode: 'detach' }
): void {
  view.webContents.on('did-finish-load', () =>
    view.webContents.openDevTools(options)
  );
}

export type DevToolsOpener = (options?: OpenDevToolsOptions) => void;

export function generateOpenDevToolsForWebView(
  view: BrowserView
): DevToolsOpener {
  return (options: OpenDevToolsOptions = { mode: 'detach' }) =>
    openDevTools(view, options);
}
