import {
  ActiveTranslations,
  ActiveUsers,
  Author,
  ChangeTranslationParams,
  Collaboration,
} from '@tl8/api';
import { WebAppOverwrittenTranslations } from 'tl8';

export interface PresenceMessage {
  collaborationId: string;
  author: Author;
}

export interface ChangeTranslationMessage {
  params: ChangeTranslationParams;
  author: Author;
}

export interface TranslationChangedMessage {
  changeTranslationMessage: ChangeTranslationMessage;
  currentWork: Collaboration['work'];
}

export interface ActiveUsersMessage {
  activeUsers: ActiveUsers;
}

export type CollaborationUser = CollaborationUserData & {
  id: string;
};

export type CollaborationUserData = {
  name: string;
};

export interface CreateCollaborationPayload {
  host: string;
  webAppOverwrittenTranslations: WebAppOverwrittenTranslations;
}

export interface CreateCollaborationUserPayload {
  name: string;
}

export interface UserFocusedOnTranslationParams {
  key: string;
  lang: string;
}

export interface UserFocusedOnTranslationMessage {
  params: UserFocusedOnTranslationParams;
  author: Author;
}

export interface ActiveTranslationsMessage {
  activeTranslations: ActiveTranslations;
}
