import { Controller, Logger } from '@nestjs/common';
import { app, dialog, globalShortcut, ipcMain, shell } from 'electron';
import { environment } from '../environments/environment';
import { AppDelegate } from './app-delegate';
import { DevReloadSynchronizer } from './dev-reload-synchronizer';
import { ProjectsStoreManager } from './store/projects-store.manager';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);

  constructor(
    private appDelegate: AppDelegate,
    private reloadSynchronizer: DevReloadSynchronizer,
    private projectStoreManager: ProjectsStoreManager
  ) {
    app.on('ready', async () => {
      ipcMain.handle('project:getAll', () =>
        this.projectStoreManager.getAllProjects()
      );
      ipcMain.handle('openExternalLink', (_, url: string) =>
        shell.openExternal(url)
      );
      this.bootstrap();
    });
  }

  private async bootstrap(): Promise<void> {
    try {
      this.initializeEnvironment();
      await this.openNewWindow();
    } catch (error) {
      this.logger.error(error);
      dialog.showErrorBox('Initialization Error', JSON.stringify(error));
    }
  }

  private async initializeEnvironment(): Promise<void> {
    if (!environment.production) {
      globalShortcut.register('Alt+CommandOrControl+R', () => {
        this.reloadSynchronizer.triggerFullreload();
      });
    }
  }

  private async openNewWindow() {
    await this.appDelegate.openNewLocalWindow();
  }
}
