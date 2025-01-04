import { Action, createReducer, on } from '@ngrx/store';
import { ActiveTranslations, ActiveUsers, Collaboration } from '@tl8/api';
import {
  setActiveTranslations,
  setActiveUsers,
  setCollaboration,
} from '../actions/collaboration.actions';

export interface CollaborationState {
  collaboration: Collaboration | undefined;
  activeUsers: ActiveUsers;
  activeTranslations: ActiveTranslations;
}

const reducer = createReducer<CollaborationState>(
  {
    collaboration: undefined,
    activeTranslations: [],
    activeUsers: [],
  },
  on(setActiveUsers, (state, { activeUsers }) => ({
    ...state,
    activeUsers,
  })),
  on(setActiveTranslations, (state, { activeTranslations }) => ({
    ...state,
    activeTranslations,
  })),
  on(setCollaboration, (state, { collaboration }) => ({
    ...state,
    collaboration,
  }))
);

export function collaborationReducer(
  state: CollaborationState | undefined,
  action: Action
): CollaborationState {
  return reducer(state, action);
}
