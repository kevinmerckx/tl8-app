import { TargetApplicationConfig, WebAppOverwrittenTranslations } from 'tl8';

export interface Collaboration {
  id: string;
  host: string;
  work: {
    [lang: string]: Work[];
  };
}

export type ActiveTranslationItem = {
  author: Author;
  key: string;
  lang: string;
};

export type ActiveTranslations = ActiveTranslationItem[];

export type ActiveUsers = Author[];

export type ConnectionStatus = 'connected' | 'disconnected';

export interface Work {
  key: string;
  history: [WorkItem, ...WorkItem[]];
}

export interface WorkItem {
  value: string;
  author?: Author;
  comments: Comment[];
}

export interface Comment {
  content: string;
  author: Author;
}

export interface Author {
  name: string;
  userId: string;
}

export interface CreateCollaborativeProjectParams {
  host: string;
}

export interface JoinCollaborativeProjectParams {
  collaborationId: Collaboration['id'];
  asUser: Author;
}

export interface WorkInProgress {
  targetHost: string;
  translations: WebAppOverwrittenTranslations;
}

export interface WorkInProgressDialogInput {
  currentTargetHost: string;
  targetApplicationConfig: TargetApplicationConfig;
  wip: WorkInProgress;
  localTranslations: WebAppOverwrittenTranslations;
}

export type WorkInProgressDialogOutput =
  | {
      translations: WebAppOverwrittenTranslations;
    }
  | string;

export interface UserAPIGateway {
  getUser(): Promise<Author>;
  setUser(user: Author): Promise<void>;
  clearUser(): Promise<void>;
}

export interface ProjectAPIGateway {
  getAll(): Promise<Project[]>;
  openLocalProject(project: LocalProject): void;
  joinCollaborativeProject(params: JoinCollaborativeProjectParams): void;
  getLocalProjectOverwrittenTranslations(
    project: LocalProject
  ): Promise<WebAppOverwrittenTranslations>;
}

export type Project = LocalProject | CollaborativeProject;

export type LocalProject = {
  host: string;
};

export type CollaborativeProject = {
  id: Collaboration['id'];
  host: string;
};

export interface ChangeTranslationParams {
  lang: string;
  key: string;
  value: string;
}

export interface RevertTranslationParams {
  lang: string;
  key: string;
}

export function changeTranslation(
  overwrittenTranslations: WebAppOverwrittenTranslations,
  params: ChangeTranslationParams
): WebAppOverwrittenTranslations {
  return {
    ...overwrittenTranslations,
    [params.lang]: {
      ...(overwrittenTranslations[params.lang] || {}),
      [params.key]: params.value,
    },
  };
}

export function revertTranslation(
  overwrittenTranslations: WebAppOverwrittenTranslations,
  params: RevertTranslationParams
): WebAppOverwrittenTranslations {
  const forLang = {
    ...(overwrittenTranslations[params.lang] || {}),
  };
  delete forLang[params.key];
  return {
    ...overwrittenTranslations,
    [params.lang]: forLang,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revertAllTranslations(
  overwrittenTranslations: WebAppOverwrittenTranslations
): WebAppOverwrittenTranslations {
  return {};
}

export interface NavigationState {
  state: 'loaded' | 'error' | 'loading';
  url: string;
  canGoBack: boolean;
  canGoForward: boolean;
}

export interface NavigationStateMessage {
  state: NavigationState;
  inPage: boolean;
}
