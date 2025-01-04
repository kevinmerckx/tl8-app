import { createAction, props } from '@ngrx/store';
import { ActiveTranslations, ActiveUsers, Collaboration } from '@tl8/api';
import { ChangeTranslationMessage } from '@tl8/collaboration/interfaces';

export const setCollaboration = createAction(
  '[Collaboration] Set Collaboration',
  props<{ collaboration: Collaboration }>()
);
export const setActiveUsers = createAction(
  '[Collaboration] Set Active Users',
  props<{ activeUsers: ActiveUsers }>()
);
export const setActiveTranslations = createAction(
  '[Collaboration] Set Active Translations',
  props<{ activeTranslations: ActiveTranslations }>()
);
export const setTranslation = createAction(
  '[Collaboration] Set Translation',
  props<{ change: ChangeTranslationMessage }>()
);
