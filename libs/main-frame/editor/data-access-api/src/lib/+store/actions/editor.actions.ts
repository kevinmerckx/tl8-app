import { createAction, props } from '@ngrx/store';
import { NavigationStateMessage } from '@tl8/api';
import { ChangeTranslationMessage } from '@tl8/collaboration/interfaces';
import { TargetApplicationConfig, WebAppOverwrittenTranslations } from 'tl8';
import { EditorMode } from '../../editor-mode';

export const setOverwrittenTranslations = createAction(
  '[Editor] Set Overwritten Translations',
  props<{ overwrittenTranslations: WebAppOverwrittenTranslations }>()
);
export const changeTranslation = createAction(
  '[Editor] Change Translation',
  props<{
    lang: string;
    key: string;
    value: string;
    withoutEffect?: boolean;
  }>()
);
export const revertTranslation = createAction(
  '[Editor] Revert Translation',
  props<{
    lang: string;
    key: string;
  }>()
);
export const revertAllTranslations = createAction(
  '[Editor] Revert all translations'
);
export const setCurrentAppTranslations = createAction(
  '[Editor] Set current app translations',
  props<{ translations: any }>()
);
export const navigateTo = createAction(
  '[Webview] Navigate to',
  props<{ url: string }>()
);
export const setTargetApplicationConfig = createAction(
  '[Editor] Set target application config',
  props<{ config: TargetApplicationConfig }>()
);
export const setCurrentLanguage = createAction(
  '[Editor] Set current language',
  props<{ value: string }>()
);
export const setCurrentVisibleKeys = createAction(
  '[Editor] Set current visible keys',
  props<{ keys: string[] }>()
);
export const selectLanguage = createAction(
  '[Editor] Set current language',
  props<{ value: string }>()
);
export const back = createAction('[Webview] Go back');
export const refresh = createAction('[Webview] refresh');
export const forward = createAction('[Webview] Go forward');
export const setNavigationState = createAction(
  '[Webview] Set Navigation State',
  props<{ navigationStateMessage: NavigationStateMessage }>()
);
export const toggleSideMenu = createAction('[Editor] Toggle Side Menu');
export const showSideMenu = createAction('[Editor] Show Side Menu');
export const focusOnTranslation = createAction(
  '[Editor] Focus on translation',
  props<{ key: string }>()
);
export const setSearchQuery = createAction(
  '[Editor] Set search query',
  props<{ searchQuery: string }>()
);
export const setEditorMode = createAction(
  '[Editor] Set Mode',
  props<{ editorMode: EditorMode }>()
);
export const setTranslation = createAction(
  '[Editor] Set Translation',
  props<{ change: ChangeTranslationMessage }>()
);
