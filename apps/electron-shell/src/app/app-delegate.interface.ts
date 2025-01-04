import { JoinCollaborativeProjectParams, LocalProject } from '@tl8/api';
import { WebAppOverwrittenTranslations } from 'tl8';
import { ITl8Window } from './tl8-window.interface';

export interface IAppDelegate {
  joinCollaborativeProject(
    params: JoinCollaborativeProjectParams,
    originWindow: ITl8Window
  ): Promise<void>;
  joinLocalProject(
    project: LocalProject,
    originWindow: ITl8Window
  ): Promise<void>;
  openNewLocalWindow(originWindow: ITl8Window): Promise<void>;
  getLocalProjectOverwrittenTranslations(
    project: LocalProject
  ): Promise<WebAppOverwrittenTranslations>;
}
