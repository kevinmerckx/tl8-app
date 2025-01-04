import { Logger } from '@nestjs/common';
import {
  ActiveTranslations,
  ActiveUsers,
  Author,
  ChangeTranslationParams,
  Collaboration,
  RevertTranslationParams,
} from '@tl8/api';
import { ChangeTranslationMessage } from '@tl8/collaboration/interfaces';
import { generateOpenDevToolsForWebView } from '@tl8/electron-utils';
import { BrowserView, BrowserWindow } from 'electron';
import { join } from 'path';
import { CollaborativeStore } from '../collaborative-store';
import { ExtraUI } from '../extra-ui/extra-ui';
import { BaseMainFrame } from '../main-frame/base-main-frame';
import { Target } from '../target/target';
import { WindowDelegate } from '../window-delegate.interface';

export class CollaborativeMainFrame extends BaseMainFrame {
  protected logger = new Logger(CollaborativeMainFrame.name);
  protected mainFrameView = new BrowserView({
    webPreferences: {
      preload: join(__dirname, './preload-collaborative-main.js'),
    },
  });
  openDevTools = generateOpenDevToolsForWebView(this.mainFrameView);

  constructor(
    protected windowDelegate: WindowDelegate,
    protected collaborativeStore: CollaborativeStore,
    protected window: BrowserWindow,
    protected extraUI: ExtraUI,
    protected target: Target,
    private asUser: Author,
    protected openHome: () => Promise<void>
  ) {
    super(window, extraUI, target, windowDelegate);
  }

  setCollaboration(collaboration: Collaboration) {
    if (this.target.host !== this.collaborativeStore.collaboration.host) {
      return;
    }
    this.mainFrameView.webContents.send('setCollaboration', collaboration);
  }

  setTranslation(change: ChangeTranslationMessage) {
    if (this.target.host !== this.collaborativeStore.collaboration.host) {
      return;
    }
    this.mainFrameView.webContents.send('setTranslation', change);
  }

  setConnectionStatus(status: 'connected' | 'disconnected') {
    this.mainFrameView.webContents.send('setConnectionStatus', status);
  }

  setActiveUsers(activeUsers: ActiveUsers) {
    if (this.target.host !== this.collaborativeStore.collaboration.host) {
      return;
    }
    this.mainFrameView.webContents.send('setActiveUsers', activeUsers);
  }

  setActiveTranslations(activeTranslations: ActiveTranslations) {
    if (this.target.host !== this.collaborativeStore.collaboration.host) {
      return;
    }
    this.mainFrameView.webContents.send(
      'setActiveTranslations',
      activeTranslations
    );
  }

  protected async onChangeTranslation(
    params: ChangeTranslationParams
  ): Promise<void> {
    if (this.target.host !== this.collaborativeStore.collaboration.host) {
      return;
    }
    this.collaborativeStore.changeTranslationForLocation(params, this.asUser);
    this.target.setOverwrittenTranslations(
      this.collaborativeStore.getOverwrittenTranslationsForLocation()
    );
  }

  protected async onRevertTranslation(
    params: RevertTranslationParams
  ): Promise<void> {
    if (this.target.host !== this.collaborativeStore.collaboration.host) {
      return;
    }
    throw new Error('Not available in collaborative mode');
  }

  protected async onRevertAllTranslations(): Promise<void> {
    if (this.target.host !== this.collaborativeStore.collaboration.host) {
      return;
    }
    throw new Error('Not available in collaborative mode');
  }

  async init() {
    await super.init();
  }
}
