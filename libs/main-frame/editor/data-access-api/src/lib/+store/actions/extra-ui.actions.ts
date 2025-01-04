import { createAction, props } from '@ngrx/store';

export const openLanguageSelect = createAction(
  '[Extra UI] Open Language Select'
);

export const openHome = createAction('[Extra UI] Open Home');

export const openMarkdownEditor = createAction(
  '[Extra UI] Open Markdown Editor',
  props<{ key: string; lang: string }>()
);
