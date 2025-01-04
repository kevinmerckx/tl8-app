import { Logger } from '@nestjs/common';
import {
  ChangeTranslationParams,
  CreateCollaborativeProjectParams,
  NavigationStateMessage,
  RevertTranslationParams,
} from '@tl8/api';
import { DevToolsOpener, resizeViewToFitWindow } from '@tl8/electron-utils';
import { ConfirmParams, ModalParams } from '@tl8/extra-ui-interfaces';
import { BrowserView, BrowserWindow } from 'electron';
import { join } from 'path';
import { cwd } from 'process';
import { WebAppOverwrittenTranslations } from 'tl8';
import { environment } from '../../environments/environment';
import { ExtraUI } from '../extra-ui/extra-ui';
import { ipcMainByView } from '../ipc-main-by-view';
import { Target } from '../target/target';
import { forwardBrowserLogs } from '../forward-browser-logs';
import { WindowDelegate } from '../window-delegate.interface';

export abstract class BaseMainFrame {
  protected abstract logger: Logger;
  protected abstract mainFrameView: BrowserView;
  protected abstract onChangeTranslation(
    params: ChangeTranslationParams
  ): Promise<void>;
  protected abstract openHome(): Promise<void>;
  protected abstract onRevertTranslation(
    params: RevertTranslationParams
  ): Promise<void>;
  protected abstract onRevertAllTranslations(): Promise<void>;
  abstract openDevTools: DevToolsOpener;

  constructor(
    protected window: BrowserWindow,
    protected extraUI: ExtraUI,
    protected target: Target,
    protected windowDelegate: WindowDelegate
  ) {}

  destroy() {
    if (!this.mainFrameView.webContents.isDestroyed()) {
      (this.mainFrameView.webContents as any).destroy();
    }
  }

  init() {
    forwardBrowserLogs(this.logger, this.mainFrameView);

    ipcMainByView.handle(
      this.view,
      'fromTl8App:postMessageToTarget',
      (_, { channel, data }) => this.target.sendMessage(channel, data)
    );
    ipcMainByView.handle(this.view, 'fromTl8App:navigate', (_, url) => {
      this.target.loadUrl(url);
      if (!url) {
        this.windowDelegate.closeTargetView();
      }
    });
    ipcMainByView.handle(this.view, 'fromTl8App:navigate:back', () =>
      this.target.goBack()
    );
    ipcMainByView.handle(this.view, 'fromTl8App:navigate:refresh', () =>
      this.target.refresh()
    );

    ipcMainByView.handle(this.view, 'fromTl8App:triggerResize', (_, bounds) => {
      this.target.setBounds({
        x: Math.floor(bounds.x * this.zoomFactor),
        y: Math.floor(bounds.y * this.zoomFactor),
        height: Math.ceil(bounds.height * this.zoomFactor),
        width: Math.ceil(bounds.width * this.zoomFactor),
      });
    });

    ipcMainByView.handle(this.view, 'openHome', () => this.openHome());

    ipcMainByView.handle(
      this.view,
      'fromTl8App:modal',
      (_, params: ModalParams) => this.extraUI.openModal(params)
    );

    ipcMainByView.handle(
      this.view,
      'fromTl8App:confirm',
      async (_, params: ConfirmParams) => this.extraUI.confirm(params)
    );

    ipcMainByView.handle(
      this.view,
      'changeTranslation',
      async (_, params: ChangeTranslationParams) => {
        this.onChangeTranslation(params);
      }
    );

    ipcMainByView.handle(
      this.view,
      'revertTranslation',
      async (_, params: RevertTranslationParams) => {
        this.onRevertTranslation(params);
      }
    );

    ipcMainByView.handle(this.view, 'revertAllTranslations', async () => {
      this.onRevertAllTranslations();
    });

    ipcMainByView.handle(this.view, 'fromTl8App:openTargetView', () =>
      this.windowDelegate.openTargetView()
    );

    ipcMainByView.handle(this.view, 'fromTl8App:closeTargetView', () =>
      this.windowDelegate.closeTargetView()
    );

    if (environment.production) {
      return this.mainFrameView.webContents.loadFile(
        join(__dirname, 'main-frame/index.html')
      );
    } else {
      return this.mainFrameView.webContents.loadFile(
        join(cwd(), 'dist/apps/main-frame/index.html')
      );
    }
  }

  createCollaborativeProject(params: CreateCollaborativeProjectParams) {
    this.mainFrameView.webContents.send('createCollaborativeProject', params);
  }

  setNavigationState(navigationStateMessage: NavigationStateMessage) {
    this.mainFrameView.webContents.send(
      'setNavigationState',
      navigationStateMessage
    );
  }

  setLoadFailed() {
    this.mainFrameView.webContents.send('setLoadFailed');
  }

  sendMessage(channel: string, args: any) {
    this.mainFrameView.webContents.send('fromTarget:message', channel, ...args);
  }

  focusOnTranslation(key: string) {
    this.mainFrameView.webContents.focus();
    this.mainFrameView.webContents.send('focusOnTranslation', key);
  }

  setOverwrittenTranslations(
    overwrittenTranslations: WebAppOverwrittenTranslations
  ) {
    this.mainFrameView.webContents.send(
      'setOverwrittenTranslations',
      overwrittenTranslations
    );
  }

  get zoomFactor() {
    return this.mainFrameView.webContents.zoomFactor;
  }

  get view(): BrowserView {
    return this.mainFrameView;
  }

  resizeToFillWindow() {
    resizeViewToFitWindow(this.mainFrameView, this.window);
  }
}
