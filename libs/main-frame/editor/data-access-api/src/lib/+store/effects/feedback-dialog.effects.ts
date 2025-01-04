import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MainFrameApi } from '@tl8/main-frame/webview-api';
import { tap } from 'rxjs/operators';
import { openFeedbackDialog } from '../actions/user-settings.actions';

@Injectable()
export class FeedbackDialogEffects {
  openModal = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openFeedbackDialog),
        tap(() => MainFrameApi().openModal({ modalId: 'feedback' }))
      ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
