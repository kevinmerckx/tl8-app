import { Logger } from '@nestjs/common';
import { NavigationStateMessage } from '@tl8/api';
import { generateOpenDevToolsForWebView } from '@tl8/electron-utils';
import { BrowserView, Menu, Rectangle } from 'electron';
import { join } from 'path';
import {
  ContextMenuParams,
  TargetApplicationConfig,
  TranslatedContextMenuParams,
  UntranslatedContextMenuParams,
  WebAppOverwrittenTranslations,
} from 'tl8';
import { forwardBrowserLogs } from '../forward-browser-logs';
import { ipcMainByView } from '../ipc-main-by-view';

export interface TargetCallbacks {
  onTargetReady: (
    config: TargetApplicationConfig
  ) => Promise<WebAppOverwrittenTranslations>;
  onNavigated: (navigationState: NavigationStateMessage) => void;
  onFocusOnTranslation: (key: TranslatedContextMenuParams['key']) => void;
  forwardToMainFrame: (channel: string, args: any) => void;
}

export class Target {
  private targetView = new BrowserView({
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, './preload-target.js'),
    },
  });
  private currentUrl = '';
  protected logger = new Logger(Target.name);

  destroy() {
    if (!this.targetView.webContents.isDestroyed()) {
      (this.targetView.webContents as any).destroy();
    }
  }

  constructor(private callbacks: TargetCallbacks) {
    this.targetView.webContents.addListener('did-fail-load', () => {
      this.callbacks.onNavigated({
        state: {
          state: 'error',
          url: this.currentUrl,
          canGoBack: this.targetView.webContents.canGoBack(),
          canGoForward: this.targetView.webContents.canGoForward(),
        },
        inPage: false,
      });
    });
    this.targetView.webContents.addListener(
      'did-navigate-in-page',
      (_, url) => {
        this.currentUrl = url;
        this.callbacks.onNavigated({
          state: {
            state: 'loaded',
            url,
            canGoBack: this.targetView.webContents.canGoBack(),
            canGoForward: this.targetView.webContents.canGoForward(),
          },
          inPage: true,
        });
      }
    );
    this.targetView.webContents.addListener('did-navigate', (_, url) => {
      this.currentUrl = url;
      this.callbacks.onNavigated({
        state: {
          state: 'loaded',
          url,
          canGoBack: this.targetView.webContents.canGoBack(),
          canGoForward: this.targetView.webContents.canGoForward(),
        },
        inPage: false,
      });
    });

    ipcMainByView.handle(
      this.view,
      'fromTarget:sendToHost',
      (_, { channel, args }) => this.callbacks.forwardToMainFrame(channel, args)
    );

    ipcMainByView.handle(
      this.view,
      'fromTarget:declareReady',
      async (_, config: TargetApplicationConfig) =>
        this.callbacks.onTargetReady(config)
    );

    ipcMainByView.handle(
      this.view,
      'fromTarget:openContextMenu',
      (_, params: ContextMenuParams) => {
        const translatedMenuParams = params as TranslatedContextMenuParams;
        if (translatedMenuParams.key) {
          const menu = Menu.buildFromTemplate([
            {
              label: translatedMenuParams.key,
              enabled: false,
            },
            {
              label: 'Edit this translation',
              click: () =>
                this.callbacks.onFocusOnTranslation(translatedMenuParams.key),
            },
          ]);
          menu.popup();
          return;
        }
        const untranslatedMenuParams = params as UntranslatedContextMenuParams;
        if (untranslatedMenuParams.nodeContent) {
          const menu = Menu.buildFromTemplate([
            {
              label: 'This text is not translated.',
              enabled: false,
            },
          ]);
          menu.popup();
          return;
        }
      }
    );

    forwardBrowserLogs(this.logger, this.targetView);
  }

  setOverwrittenTranslations(
    overwrittenTranslations: WebAppOverwrittenTranslations
  ) {
    this.targetView.webContents.send(
      'setOverwrittenTranslations',
      overwrittenTranslations
    );
  }

  sendMessage(channel: string, data: unknown) {
    this.targetView.webContents.send('toTarget:' + channel, data);
  }

  get url() {
    return this.targetView.webContents.getURL();
  }

  get host() {
    try {
      return new URL(this.url).origin;
    } catch (error) {
      return '';
    }
  }

  loadUrl(url: string) {
    this.currentUrl = url;
    if (url === this.targetView.webContents.getURL()) {
      this.logger.debug('URL is identical to current one, we do nothing.');
      return;
    }
    this.logger.debug('Loading URL ' + url);
    this.targetView.webContents.loadURL(url);
  }

  goBack() {
    this.targetView.webContents.goBack();
  }

  refresh() {
    this.logger.debug('Refreshing');
    this.targetView.webContents.reload();
  }

  setBounds(bounds: Rectangle) {
    this.targetView.setBounds(bounds);
  }

  get view(): BrowserView {
    return this.targetView;
  }

  openDevTools = generateOpenDevToolsForWebView(this.targetView);
}
