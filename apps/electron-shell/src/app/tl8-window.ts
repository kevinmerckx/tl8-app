import { Logger } from '@nestjs/common';
import { Author } from '@tl8/api';
import { WindowMemorizer } from '@tl8/electron-utils';
import { HomeDialogInput } from '@tl8/extra-ui-interfaces';
import { dialog } from 'electron';
import { environment } from '../environments/environment';
import { IAppDelegate } from './app-delegate.interface';
import { DEFAULT_CONFIG } from './config.default';
import { ExtraUI } from './extra-ui/extra-ui';
import { ipcMainByView } from './ipc-main-by-view';
import { MainFrame } from './main-frame/main-frame';
import { TranslationStore } from './store/translation-store';
import { UserStoreManager } from './store/user-store.manager';
import { Target } from './target/target';
import { ITl8Window } from './tl8-window.interface';
import { WindowDelegate } from './window-delegate.interface';

export class TL8Window implements ITl8Window, WindowDelegate {
  private logger = new Logger(TL8Window.name);
  private windowMemorizer = new WindowMemorizer();
  private mainWindow = this.windowMemorizer.start(DEFAULT_CONFIG);
  private extraUI = new ExtraUI(
    this.appDelegate,
    this,
    {
      getUser: async () => this.userStoreManager.getUser(),
      setUser: async (user: Author) => {
        return this.userStoreManager.setUser(user);
      },
      clearUser: async () => {
        return this.userStoreManager.clearUser();
      },
    },
    this.mainWindow
  );
  private target = new Target({
    onNavigated: (navigationState) =>
      this.mainFrame.setNavigationState(navigationState),
    onFocusOnTranslation: (key) => this.mainFrame.focusOnTranslation(key),
    forwardToMainFrame: (channel, args) =>
      this.mainFrame.sendMessage(channel, args),
    onTargetReady: async (config) => {
      const overwrittenTranslations =
        this.translationStore.getOverwrittenTranslationsForLocation(
          this.target.host
        );
      this.mainFrame.setOverwrittenTranslations(overwrittenTranslations);
      return overwrittenTranslations;
    },
  });
  private mainFrame = new MainFrame(
    this,
    this.mainWindow,
    this.extraUI,
    this.target,
    this.translationStore,
    () => this.openHome()
  );

  constructor(
    private appDelegate: IAppDelegate,
    private translationStore: TranslationStore,
    private userStoreManager: UserStoreManager,
    private host: string
  ) {}

  openTargetView(): void {
    this.mainWindow.addBrowserView(this.target.view);
  }

  closeTargetView(): void {
    this.mainWindow.removeBrowserView(this.target.view);
  }

  async bootstrap(): Promise<void> {
    try {
      await this.createBrowser();
      this.target.loadUrl(this.host);
    } catch (error) {
      this.logger.error(error);
      dialog.showErrorBox('Initialization Error', JSON.stringify(error));
    }
  }

  destroy() {
    this.mainWindow.destroy();
    this.extraUI.destroy();
    this.target.destroy();
    this.mainFrame.destroy();
  }

  private async createBrowser(): Promise<void> {
    this.mainWindow.addBrowserView(this.mainFrame.view);
    this.mainWindow.addBrowserView(this.target.view);

    ipcMainByView.handle(this.mainFrame.view, 'getUser', () => {
      return this.userStoreManager.getUser();
    });

    ipcMainByView.handle(
      this.mainFrame.view,
      'setUser',
      (_, user: { name: string; id: string }) => {
        return this.userStoreManager.setUser({
          name: user.name,
          userId: user.id,
        });
      }
    );

    this.mainFrame.resizeToFillWindow();

    if (!environment.production) {
      // this.mainFrame.openDevTools();
      // this.extraUI.openDevTools();
      // this.target.openDevTools();
    }

    await this.mainFrame.init();
    await this.extraUI.init();
  }

  private async openHome() {
    const homeDialogInput: HomeDialogInput = {
      currentHost: this.target.host,
    };
    this.extraUI.openModal({
      modalId: 'home',
      data: homeDialogInput,
    });
  }
}
