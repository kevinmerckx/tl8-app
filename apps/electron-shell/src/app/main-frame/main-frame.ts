import { Logger } from '@nestjs/common';
import {
  ChangeTranslationParams,
  RevertTranslationParams,
  WorkInProgress,
  WorkInProgressDialogInput,
  WorkInProgressDialogOutput,
} from '@tl8/api';
import { generateOpenDevToolsForWebView } from '@tl8/electron-utils';
import { BrowserView, BrowserWindow, dialog } from 'electron';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TargetApplicationConfig } from 'tl8';
import { ExtraUI } from '../extra-ui/extra-ui';
import { ipcMainByView } from '../ipc-main-by-view';
import { TranslationStore } from '../store/translation-store';
import { Target } from '../target/target';
import { WindowDelegate } from '../window-delegate.interface';
import { BaseMainFrame } from './base-main-frame';

export class MainFrame extends BaseMainFrame {
  protected logger = new Logger(MainFrame.name);
  protected mainFrameView = new BrowserView({
    webPreferences: {
      preload: join(__dirname, './preload-main.js'),
    },
  });
  openDevTools = generateOpenDevToolsForWebView(this.mainFrameView);

  constructor(
    protected windowDelegate: WindowDelegate,
    protected window: BrowserWindow,
    protected extraUI: ExtraUI,
    protected target: Target,
    private translationStore: TranslationStore,
    protected openHome: () => Promise<void>
  ) {
    super(window, extraUI, target, windowDelegate);
  }

  protected async onChangeTranslation(
    params: ChangeTranslationParams
  ): Promise<void> {
    this.translationStore.changeTranslationForLocation(
      this.target.host,
      params
    );
    this.target.setOverwrittenTranslations(
      this.translationStore.getOverwrittenTranslationsForLocation(
        this.target.host
      )
    );
  }

  protected async onRevertTranslation(
    params: RevertTranslationParams
  ): Promise<void> {
    this.translationStore.revertTranslationForLocation(
      this.target.host,
      params
    );
    this.target.setOverwrittenTranslations(
      this.translationStore.getOverwrittenTranslationsForLocation(
        this.target.host
      )
    );
  }

  protected async onRevertAllTranslations(): Promise<void> {
    this.translationStore.revertAllTranslationsForLocation(this.target.host);
    this.target.setOverwrittenTranslations(
      this.translationStore.getOverwrittenTranslationsForLocation(
        this.target.host
      )
    );
  }

  init() {
    ipcMainByView.handle(
      this.view,
      'fromTl8App:importWIP',
      async (_, config: TargetApplicationConfig) => {
        const result = await dialog.showOpenDialog(this.window, {
          filters: [{ name: 'TL8 files', extensions: ['tl8'] }],
        });
        if (result.canceled) {
          return;
        }
        this.openImportWIPProcessDialog(
          config,
          JSON.parse(readFileSync(result.filePaths[0]).toString())
        );
      }
    );

    return super.init();
  }

  private async openImportWIPProcessDialog(
    targetApplicationConfig: TargetApplicationConfig,
    wip: WorkInProgress
  ) {
    const result = await this.extraUI.openModal<
      WorkInProgressDialogOutput,
      WorkInProgressDialogInput
    >({
      modalId: 'importWIP',
      data: {
        targetApplicationConfig,
        wip,
        currentTargetHost: this.target.host,
        localTranslations:
          this.translationStore.getOverwrittenTranslationsForLocation(
            this.target.host
          ),
      },
    });
    if (!result) {
      return;
    }
    if (typeof result === 'string') {
      this.target.loadUrl(result);
      return;
    }

    this.translationStore.setOverwrittenTranslationsForLocation(
      this.target.host,
      result.translations
    );
    this.setOverwrittenTranslations(result.translations);
    this.target.setOverwrittenTranslations(result.translations);
  }
}
