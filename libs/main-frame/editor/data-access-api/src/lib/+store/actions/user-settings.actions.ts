import { createAction } from '@ngrx/store';

export const openFeedbackDialog = createAction('[Editor] Open Feedback Dialog');
export const closeFeedbackDialog = createAction(
  '[Editor] Close Feedback Dialog'
);
export const donate = createAction('[User Settings] Donate');
export const feedback = createAction('[User Settings] Feedback');
