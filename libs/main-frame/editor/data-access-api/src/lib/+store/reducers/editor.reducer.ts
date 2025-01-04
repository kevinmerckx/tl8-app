import { Action, createReducer, on } from '@ngrx/store';
import { NavigationState } from '@tl8/api';
import { TargetApplicationConfig, WebAppOverwrittenTranslations } from 'tl8';
import { EditorMode } from '../../editor-mode';
import {
  changeTranslation,
  revertAllTranslations,
  revertTranslation,
  setCurrentAppTranslations,
  setCurrentLanguage,
  setCurrentVisibleKeys,
  setEditorMode,
  setNavigationState,
  setOverwrittenTranslations,
  setSearchQuery,
  setTargetApplicationConfig,
  showSideMenu,
  toggleSideMenu,
} from '../actions/editor.actions';

export interface EditorState {
  overwrittenTranslations: WebAppOverwrittenTranslations;
  currentAppTranslations: { [lang: string]: any };
  targetApplicationConfig: TargetApplicationConfig | null;
  currentLanguage: string | null;
  navigationState: NavigationState;
  isSideMenuVisible: boolean;
  editorMode: EditorMode;
  currentVisibleKeys: string[];
  searchQuery: string;
}

const reducer = createReducer<EditorState>(
  {
    isSideMenuVisible: true,
    overwrittenTranslations: {},
    currentAppTranslations: {},
    targetApplicationConfig: null,
    currentLanguage: null,
    currentVisibleKeys: [],
    searchQuery: '',
    editorMode: 'wysiwyg',
    navigationState: {
      state: 'loaded',
      url: '',
      canGoBack: false,
      canGoForward: false,
    },
  },
  on(setNavigationState, (state, { navigationStateMessage }) => ({
    ...state,
    navigationState: navigationStateMessage.state,
    ...(navigationStateMessage.inPage
      ? {}
      : {
          currentAppTranslations: {},
          currentLanguage: null,
          targetApplicationConfig: null,
          currentVisibleKeys: [],
        }),
  })),
  on(setCurrentVisibleKeys, (state, { keys }) => ({
    ...state,
    currentVisibleKeys: keys,
  })),
  on(toggleSideMenu, (state) => ({
    ...state,
    isSideMenuVisible: !state.isSideMenuVisible,
  })),
  on(showSideMenu, (state) => ({
    ...state,
    isSideMenuVisible: true,
  })),
  on(setOverwrittenTranslations, (state, { overwrittenTranslations }) => ({
    ...state,
    overwrittenTranslations,
  })),
  on(revertTranslation, (state, { key, lang }) => {
    const forLanguage = {
      ...(state.overwrittenTranslations[lang] || {}),
    };
    delete forLanguage[key];
    return {
      ...state,
      overwrittenTranslations: {
        ...state.overwrittenTranslations,
        [lang]: forLanguage,
      },
    };
  }),
  on(changeTranslation, (state, { lang, key, value }) => {
    const forLanguage = state.overwrittenTranslations[lang] || {};
    return {
      ...state,
      overwrittenTranslations: {
        ...state.overwrittenTranslations,
        [lang]: {
          ...forLanguage,
          [key]: value,
        },
      },
    };
  }),
  on(revertAllTranslations, (state) => {
    return {
      ...state,
      overwrittenTranslations: {},
    };
  }),
  on(setCurrentAppTranslations, (state, action) => {
    return {
      ...state,
      currentAppTranslations: action.translations,
    };
  }),
  on(setTargetApplicationConfig, (state, action) => {
    return {
      ...state,
      targetApplicationConfig: action.config,
    };
  }),
  on(setCurrentLanguage, (state, action) => ({
    ...state,
    currentLanguage: action.value,
  })),
  on(setSearchQuery, (state, { searchQuery }) => ({
    ...state,
    searchQuery,
  })),
  on(setEditorMode, (state, { editorMode }) => ({
    ...state,
    editorMode,
  }))
);

export function editorReducer(
  state: EditorState | undefined,
  action: Action
): EditorState {
  return reducer(state, action);
}

function createProperUrl(url: string): string {
  if (!url) {
    return url;
  }
  if (url.startsWith('http')) {
    return url;
  }
  return 'https://' + url;
}
