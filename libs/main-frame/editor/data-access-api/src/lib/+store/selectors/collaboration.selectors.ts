import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CollaborationState } from '../reducers/collaboration.reducer';

export const selectCollaboration =
  createFeatureSelector<CollaborationState>('collaboration');
export const selectCollaborationData = createSelector(
  selectCollaboration,
  ({ collaboration }) => collaboration
);

export const selectActiveUsers = createSelector(
  selectCollaboration,
  ({ activeUsers }) => activeUsers
);

export const selectActiveTranslations = createSelector(
  selectCollaboration,
  ({ activeTranslations }) => activeTranslations
);

export const selectWork = (params: { key: string; lang: string }) => {
  return createSelector(selectCollaborationData, (c) =>
    c?.work[params.lang].find(({ key }) => key === params.key)
  );
};

export const selectLastAuthorOfTranslation = (params: {
  key: string;
  lang: string;
}) => {
  return createSelector(
    selectCollaborationData,
    (c) =>
      c?.work[params.lang].find(({ key }) => key === params.key)?.history[0]
        ?.author
  );
};

export const selectActiveUsersOnTranslations = (params: {
  key: string;
  lang: string;
}) => {
  return createSelector(selectActiveTranslations, (activeTranslations) =>
    activeTranslations
      .filter(({ key, lang }) => {
        return key === params.key && lang === params.lang;
      })
      .map(({ author }) => author)
  );
};
