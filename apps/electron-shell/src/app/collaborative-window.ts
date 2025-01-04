import { Author, Collaboration } from '@tl8/api';
import { UserFocusedOnTranslationParams } from '@tl8/collaboration/interfaces';
import { WindowMemorizer } from '@tl8/electron-utils';
import { HomeDialogInput } from '@tl8/extra-ui-interfaces';
import { environment } from '../environments/environment';
import { IAppDelegate } from './app-delegate.interface';
import { CollaborativeMainFrame } from './collaborative-main-frame/collaborative-main-frame';
import { CollaborativeStore } from './collaborative-store';
import { DEFAULT_CONFIG } from './config.default';
import { ExtraUI } from './extra-ui/extra-ui';
import { ipcMainByView } from './ipc-main-by-view';
import { ProjectsStoreManager } from './store/projects-store.manager';
import { UserStoreManager } from './store/user-store.manager';
import { Target } from './target/target';

export class CollaborativeWindow {
  private windowMemorizer = new WindowMemorizer();
  private mainWindow = this.windowMemorizer.start(DEFAULT_CONFIG);
  private extraUI = new ExtraUI(
    this.appDelegate,
    this,
    {
      getUser: async () => {
        return this.user;
      },
      setUser: async (user: Author) => {
        this.user = user;
      },
      clearUser: async () => {
        this.user = undefined;
        this.appDelegate.openNewLocalWindow(this);
      },
    },
    this.mainWindow
  );
  private target = new Target({
    onNavigated: (url) => this.mainFrame.setNavigationState(url),
    onFocusOnTranslation: (key) => this.mainFrame.focusOnTranslation(key),
    forwardToMainFrame: (channel, args) =>
      this.mainFrame.sendMessage(channel, args),
    onTargetReady: async (config) => {
      const overwrittenTranslations =
        this.collaborativeStore.getOverwrittenTranslationsForLocation();
      this.mainFrame.setOverwrittenTranslations(overwrittenTranslations);
      this.mainFrame.setCollaboration(this.collaborativeStore.collaboration);
      this.mainFrame.setActiveUsers(this.collaborativeStore.activeUsers);
      this.mainFrame.setActiveTranslations(
        this.collaborativeStore.activeTranslations
      );
      return overwrittenTranslations;
    },
  });

  collaborativeStore = new CollaborativeStore(this.collaboration, {
    onTranslationChanged: (message) => {
      this.mainFrame.setCollaboration(this.collaborativeStore.collaboration);
      this.mainFrame.setTranslation(message.changeTranslationMessage);
      this.target.setOverwrittenTranslations(
        this.collaborativeStore.getOverwrittenTranslationsForLocation()
      );
    },
    onActiveUsersChanged: (message) => {
      this.mainFrame.setActiveUsers(message.activeUsers);
    },
    onActiveTranslationsChanged: (message) => {
      this.mainFrame.setActiveTranslations(message.activeTranslations);
    },
    onConnectionStatus: (status) => {
      this.mainFrame.setConnectionStatus(status);
    },
  });
  mainFrame = new CollaborativeMainFrame(
    this,
    this.collaborativeStore,
    this.mainWindow,
    this.extraUI,
    this.target,
    this.user,
    () => this.openHome()
  );

  private get user(): Author {
    if (this.withUser) {
      return this.withUser;
    }
    const storedUser = this.userStoreManager.getUser();
    if (!storedUser) {
      throw new Error('User is not defined.');
    }
    return storedUser;
  }

  private set user(user: Author | undefined) {
    if (this.withUser) {
      this.withUser = user;
      return;
    }
    if (!user) {
      this.userStoreManager.clearUser();
      return;
    }
    this.userStoreManager.setUser(user);
  }

  constructor(
    private appDelegate: IAppDelegate,
    private collaboration: Collaboration,
    private userStoreManager: UserStoreManager,
    private projectStoreManager: ProjectsStoreManager,
    private withUser?: Author
  ) {}

  openTargetView(): void {
    this.mainWindow.addBrowserView(this.target.view);
  }

  closeTargetView(): void {
    this.mainWindow.removeBrowserView(this.target.view);
  }

  async bootstrap(): Promise<void> {
    try {
      this.projectStoreManager.addCollaborativeProject(this.collaboration);
      await this.collaborativeStore.connectAsUser(this.user);
      await this.createBrowser();

      this.target.loadUrl(this.collaboration.host);
    } catch (error) {
      this.destroy();
      throw error;
    }
  }

  destroy() {
    this.collaborativeStore.destroy();
    this.mainWindow.destroy();
    this.extraUI.destroy();
    this.target.destroy();
    this.mainFrame.destroy();
  }

  private async createBrowser(): Promise<void> {
    this.mainWindow.addBrowserView(this.mainFrame.view);
    this.mainWindow.addBrowserView(this.target.view);

    if (!environment.production) {
      // this.mainFrame.openDevTools();
      // this.extraUI.openDevTools();
      // this.target.openDevTools();
    }

    ipcMainByView.handle(this.mainFrame.view, 'getUser', () => {
      return this.user;
    });

    ipcMainByView.handle(
      this.mainFrame.view,
      'setUser',
      (_, user: { name: string; id: string }) => {
        this.user = { name: user.name, userId: user.id };
      }
    );

    ipcMainByView.handle(
      this.mainFrame.view,
      'userBlurredOfTranslation',
      (_, params: UserFocusedOnTranslationParams) => {
        this.collaborativeStore.removeFromActiveTranslation(this.user, params);
      }
    );

    ipcMainByView.handle(
      this.mainFrame.view,
      'userFocusedOnTranslation',
      (_, params: UserFocusedOnTranslationParams) => {
        this.collaborativeStore.addToActiveTranslation(this.user, params);
      }
    );

    this.mainFrame.resizeToFillWindow();

    await this.mainFrame.init();
    await this.extraUI.init();
  }

  private async openHome() {
    const homeDialogInput: HomeDialogInput = {
      currentHost: this.collaboration.host,
      collaboration: this.collaboration,
    };
    this.extraUI.openModal({
      modalId: 'home',
      data: homeDialogInput,
    });
  }
}
