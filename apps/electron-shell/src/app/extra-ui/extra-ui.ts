import { Logger } from '@nestjs/common';
import { Author, JoinCollaborativeProjectParams, LocalProject } from '@tl8/api';
import {
  generateOpenDevToolsForWebView,
  resizeViewToFitWindow,
} from '@tl8/electron-utils';
import { ConfirmParams, ModalParams } from '@tl8/extra-ui-interfaces';
import { BrowserView, BrowserWindow, dialog } from 'electron';
import { join } from 'path';
import { cwd } from 'process';
import { environment } from '../../environments/environment';
import { IAppDelegate } from '../app-delegate.interface';
import { forwardBrowserLogs } from '../forward-browser-logs';
import { ipcMainByView } from '../ipc-main-by-view';
import { ITl8Window } from '../tl8-window.interface';

export class ExtraUI {
  private extraUiView = new BrowserView({
    webPreferences: {
      preload: join(__dirname, './preload-modal.js'),
    },
  });
  protected logger = new Logger(ExtraUI.name);

  constructor(
    private appDelegate: IAppDelegate,
    private tl8Window: ITl8Window,
    private callbacks: {
      getUser: () => Promise<Author | undefined>;
      setUser: (user: Author) => Promise<void>;
      clearUser: () => Promise<void>;
    },
    private window: BrowserWindow
  ) {}

  destroy() {
    if (!this.extraUiView.webContents.isDestroyed()) {
      (this.extraUiView.webContents as any).destroy();
    }
  }

  async init() {
    forwardBrowserLogs(this.logger, this.extraUiView);

    return new Promise((resolve, reject) => {
      ipcMainByView.handle(this.extraUiView, 'fromExtraUI:ready', resolve);

      ipcMainByView.handle(
        this.extraUiView,
        'project:joinCollaborativeProject',
        (_, params: JoinCollaborativeProjectParams) => {
          this.appDelegate.joinCollaborativeProject(params, this.tl8Window);
        }
      );

      ipcMainByView.handle(
        this.extraUiView,
        'project:openLocal',
        (_, project: LocalProject) => {
          this.appDelegate.joinLocalProject(project, this.tl8Window);
        }
      );

      ipcMainByView.handle(
        this.extraUiView,
        'project:getLocalProjectOverwrittenTranslations',
        (_, project: LocalProject) => {
          return this.appDelegate.getLocalProjectOverwrittenTranslations(
            project
          );
        }
      );

      ipcMainByView.handle(this.extraUiView, 'user:get', () => {
        return this.callbacks.getUser();
      });

      ipcMainByView.handle(this.extraUiView, 'user:clear', () => {
        return this.callbacks.clearUser();
      });

      ipcMainByView.handle(this.extraUiView, 'user:set', (_, user: Author) => {
        return this.callbacks.setUser(user);
      });

      this.load().catch(reject);
    });
  }

  async confirm(params: ConfirmParams): Promise<boolean> {
    const result = await dialog.showMessageBox(this.window, {
      message: params.message,
      title: params.title,
      buttons: [params.yes, params.no],
      defaultId: 1,
      cancelId: 1,
      type: 'warning',
    });
    return result.response === 0;
  }

  openModal<OutputType, InputType>(
    params: ModalParams<InputType>
  ): Promise<OutputType | undefined> {
    return new Promise<OutputType | undefined>((resolve) => {
      this.extraUiView.setBackgroundColor('#00000000');
      this.extraUiView.webContents.send('toModal:openModal', params);
      ipcMainByView.handleOnce(this.extraUiView, 'fromModal:ready', () => {
        this.window.addBrowserView(this.extraUiView);
        this.extraUiView.webContents.focus();
        const stopResizing = resizeViewToFitWindow(
          this.extraUiView,
          this.window
        );
        ipcMainByView.handleOnce(
          this.extraUiView,
          'fromModal:close',
          (_, output) => {
            this.window.removeBrowserView(this.extraUiView);
            stopResizing();
            return resolve(output);
          }
        );
      });
    });
  }

  private load() {
    if (environment.production) {
      return this.extraUiView.webContents.loadFile(
        join(__dirname, 'extra-ui/index.html')
      );
    } else {
      return this.extraUiView.webContents.loadFile(
        join(cwd(), 'dist/apps/extra-ui/index.html')
      );
    }
  }

  openDevTools = generateOpenDevToolsForWebView(this.extraUiView);
}
