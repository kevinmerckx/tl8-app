import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EditorState } from '../reducers/editor.reducer';
import {
  uniqueStrings,
  getValueAtPath,
  getTranslationsAtPath,
} from '@tl8/private/utils';
import { ModifiedTranslations } from '@tl8/private/interfaces';
import { NavigationState } from '@tl8/api';

export const editor = createFeatureSelector<EditorState>('editor');

export const selectNavigationState = createSelector(
  editor,
  ({ navigationState }) => navigationState
);

export const selectCurrentUrl = createSelector(
  selectNavigationState,
  ({ url }) => url
);

export const isCurrentWebsiteCompatible = createSelector(
  editor,
  ({ targetApplicationConfig }) => targetApplicationConfig !== null
);

export const selectHost = createSelector(selectCurrentUrl, (url) => {
  try {
    return new URL(url).origin;
  } catch (error) {
    return '';
  }
});

export const currentTargetOverwrittenTranslations = createSelector(
  editor,
  ({ overwrittenTranslations }) => overwrittenTranslations
);

export const currentAppTranslations = createSelector(
  editor,
  ({ currentAppTranslations }) => currentAppTranslations
);

export const selectModifiedTranslations = createSelector(
  editor,
  currentTargetOverwrittenTranslations,
  currentAppTranslations,
  (
    { targetApplicationConfig },
    overwrittenTranslations,
    currentAppTranslations
  ): ModifiedTranslations => {
    if (!targetApplicationConfig) {
      return [];
    }
    return targetApplicationConfig.langs
      .map((lang) => lang.lang)
      .map((lang) => {
        const ngxTranslations = currentAppTranslations[lang];
        const translations = getOverwrittenObject(
          ngxTranslations,
          overwrittenTranslations[lang] || {}
        );
        return {
          lang,
          translations: translations,
        };
      });
  }
);

export const numberOfChanges = createSelector(
  currentTargetOverwrittenTranslations,
  (currentHostTranslations) => {
    return Object.keys(currentHostTranslations).reduce(
      (prev, curr) => Object.keys(currentHostTranslations[curr]).length + prev,
      0
    );
  }
);

function getOverwrittenObject(
  obj: any,
  overwrittenValues: { [key: string]: string }
): any {
  return Object.keys(overwrittenValues).reduce(
    (prev, curr) =>
      getModifiedObject(prev, curr.split('.'), overwrittenValues[curr]),
    obj || {}
  );
}

function getModifiedObject(obj: any, path: string[], value: string): any {
  if (path.length === 0) {
    return value;
  }
  return {
    ...obj,
    [path[0]]: getModifiedObject(obj[path[0]] || {}, path.slice(1), value),
  };
}

export const selectLangs = createSelector(
  editor,
  (editor) => editor.targetApplicationConfig?.langs
);

export const selectTargetApplicationConfig = createSelector(
  editor,
  ({ targetApplicationConfig }) => targetApplicationConfig
);

export const selectCurrentLanguage = createSelector(
  editor,
  (editor) => editor.currentLanguage
);

export const currentLanguageLabel = createSelector(
  selectCurrentLanguage,
  selectTargetApplicationConfig,
  (currentLanguage, config) => {
    return config?.langs.find((l) => l.lang === currentLanguage)?.label;
  }
);

export const selectIsSideMenuVisible = createSelector(
  editor,
  ({ isSideMenuVisible }) => isSideMenuVisible
);

export const canNotGoBack = createSelector(
  selectNavigationState,
  ({ canGoBack }) => !canGoBack
);

export const canRefresh = createSelector(
  selectNavigationState,
  ({ url }) => !!url
);

export const currentVisibleKeyValues = createSelector(
  editor,
  selectCurrentLanguage,
  currentAppTranslations,
  selectModifiedTranslations,
  (editor, currentLanguage, currentAppTranslations, modifiedTranslations) => {
    if (!currentLanguage) {
      return [];
    }
    const current = modifiedTranslations.find(
      (item) => item.lang === currentLanguage
    );
    if (!current) {
      return [];
    }
    return uniqueStrings(editor.currentVisibleKeys)
      .filter((key) => !!key)
      .map((key) => ({
        key,
        value: getValueAtPath(current.translations, key.split('.')) || '',
        originalValue:
          getValueAtPath(
            currentAppTranslations[currentLanguage as string] || {},
            key.split('.')
          ) || '',
      }));
  }
);

export const selectSearchQuery = createSelector(
  editor,
  ({ searchQuery }) => searchQuery
);

export const normalizedKeyValues = createSelector(
  currentVisibleKeyValues,
  (keyValues) =>
    keyValues.map((item) => ({
      item,
      searchable: [item.key.toLowerCase(), String(item.value).toLowerCase()],
    }))
);

export const selectKeyValuesFilteredBySearchQuery = createSelector(
  normalizedKeyValues,
  selectSearchQuery,
  (normalized, searchQuery) => {
    const normalizedQuery = searchQuery.toLowerCase();
    if (!normalizedQuery) {
      return normalized.map(({ item }) => item);
    }
    return normalized
      .filter(({ searchable }) =>
        searchable.some((searchableItem) =>
          searchableItem.includes(normalizedQuery)
        )
      )
      .map(({ item }) => item);
  }
);

export const selectEditorMode = createSelector(
  editor,
  ({ editorMode }) => editorMode
);

export const selectTranslation = (params: { key: string; lang: string }) => {
  return createSelector(
    selectModifiedTranslations,
    currentAppTranslations,
    (modifiedTranslations, currentAppTranslations) =>
      getCurrentTranslationInfo(
        params,
        modifiedTranslations,
        currentAppTranslations
      )
  );
};

export const selectAllTranslationKeysUnderNode = (path: string) =>
  createSelector(
    selectModifiedTranslations,
    selectLangs,
    currentAppTranslations,
    (modifiedTranslations, langs, currentAppTranslations) => {
      return getTranslationsAtPath(modifiedTranslations, path).reduce(
        (prev, key) => {
          return [
            ...prev,
            ...(langs || []).reduce(
              (langPrev, { lang }) => [
                ...langPrev,
                getCurrentTranslationInfo(
                  { key, lang },
                  modifiedTranslations,
                  currentAppTranslations
                ),
              ],
              [] as TranslationInfo[]
            ),
          ];
        },
        [] as TranslationInfo[]
      );
    }
  );

export const selectNumberOfEmptyTranslationsUnderNode = (path: string) =>
  createSelector(
    selectAllTranslationKeysUnderNode(path),
    (translations) => translations.filter(({ value }) => !value).length
  );

export interface TranslationInfo {
  key: string;
  lang: string;
  value: string;
  originalValue: string;
}

function getCurrentTranslationInfo(
  params: { key: string; lang: string },
  modifiedTranslations: ModifiedTranslations,
  currentAppTranslations: { [lang: string]: any }
): TranslationInfo {
  const langTranslations = modifiedTranslations.find(
    (item) => item.lang === params.lang
  );
  return {
    key: params.key,
    lang: params.lang,
    value:
      getValueAtPath(
        langTranslations?.translations || {},
        params.key.split('.')
      ) || '',
    originalValue:
      getValueAtPath(
        currentAppTranslations[params.lang] || {},
        params.key.split('.')
      ) || '',
  };
}
