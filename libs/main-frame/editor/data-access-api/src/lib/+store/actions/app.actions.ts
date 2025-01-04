import { createAction, props } from '@ngrx/store';
import { WorkInProgress } from '@tl8/api';

export const openDownloadModal = createAction('Open Download Modal');
export const downloadFinalTranslations = createAction(
  'Download Final Translations'
);
export const downloadWIPTranslations = createAction(
  'Download WIP Translations'
);
export const startImportWIPProcess = createAction('Start Import WIP Process');
export const importWIP = createAction(
  'Import WIP',
  props<{ wip: WorkInProgress }>()
);
