import { BrowserView, BrowserWindow } from 'electron/main';

export function resizeViewToFitWindow(
  view: BrowserView,
  window: BrowserWindow
): () => void {
  const resizeApp = () => {
    view.setBounds({
      ...window.getContentBounds(),
      x: 0,
      y: 0,
    });
  };
  resizeApp();
  window.on('resize', resizeApp);
  return () => window.off('resize', resizeApp);
}
