import { Module } from '@nestjs/common';
import { AppDelegate } from './app-delegate';
import { AppController } from './app.controller';
import { CollaborationApiClient } from './collaboration-api.client';
import { DevReloadSynchronizer } from './dev-reload-synchronizer';
import { ProjectsStoreManager } from './store/projects-store.manager';
import { TranslationStore } from './store/translation-store';
import { UserStoreManager } from './store/user-store.manager';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppDelegate,
    TranslationStore,
    DevReloadSynchronizer,
    ProjectsStoreManager,
    UserStoreManager,
    CollaborationApiClient,
  ],
})
export class AppModule {}
