import { Injectable, NotFoundException } from '@nestjs/common';
import { JoinCollaborativeProjectParams, LocalProject } from '@tl8/api';
import { dialog } from 'electron';
import { WebAppOverwrittenTranslations } from 'tl8';
import { IAppDelegate } from './app-delegate.interface';
import { CollaborativeWindow } from './collaborative-window';
import { ProjectsStoreManager } from './store/projects-store.manager';
import { TranslationStore } from './store/translation-store';
import { UserStoreManager } from './store/user-store.manager';
import { TL8Window } from './tl8-window';
import { ITl8Window } from './tl8-window.interface';
import {
  CollaborationApiClient,
  UnknownError,
} from './collaboration-api.client';

@Injectable()
export class AppDelegate implements IAppDelegate {
  constructor(
    private userStoreManager: UserStoreManager,
    private projectStoreManager: ProjectsStoreManager,
    private translationStore: TranslationStore,
    private collaborationApiClient: CollaborationApiClient
  ) {}

  async getLocalProjectOverwrittenTranslations(
    project: LocalProject
  ): Promise<WebAppOverwrittenTranslations> {
    return this.translationStore.getOverwrittenTranslationsForLocation(
      project.host
    );
  }

  async joinCollaborativeProject(
    params: JoinCollaborativeProjectParams,
    originWindow?: ITl8Window
  ): Promise<void> {
    try {
      this.userStoreManager.setUser(params.asUser);
      const collaboration = await this.collaborationApiClient.getCollaboration(
        params.collaborationId
      );
      if (collaboration instanceof UnknownError) {
        throw collaboration;
      }
      if (collaboration instanceof NotFoundException) {
        dialog.showErrorBox(
          'Error',
          `Project with id "${params.collaborationId}" not found`
        );
        return;
      }
      await new CollaborativeWindow(
        this,
        collaboration,
        this.userStoreManager,
        this.projectStoreManager,
        params.asUser
      ).bootstrap();
      originWindow?.destroy();
    } catch (error) {
      dialog.showErrorBox(
        'Error',
        `Sorry, an error occured while joining the collaboration. Please try again.`
      );
    }
  }

  async joinLocalProject(
    project: LocalProject,
    originWindow?: ITl8Window
  ): Promise<void> {
    this.projectStoreManager.addLocalProject(project.host);
    await new TL8Window(
      this,
      this.translationStore,
      this.userStoreManager,
      project.host
    ).bootstrap();
    originWindow?.destroy();
  }

  async openNewLocalWindow(originWindow?: ITl8Window): Promise<void> {
    await new TL8Window(
      this,
      this.translationStore,
      this.userStoreManager,
      ''
    ).bootstrap();
    originWindow?.destroy();
  }
}
