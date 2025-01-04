import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MainFrameApi } from '@tl8/main-frame/webview-api';
import { filter, tap } from 'rxjs/operators';
import {
  back,
  changeTranslation,
  navigateTo,
  refresh,
  revertAllTranslations,
  revertTranslation,
} from '../actions/editor.actions';

@Injectable()
export class EditorEffects {
  constructor(private actions$: Actions) {}

  navigateToEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(navigateTo),
        tap(({ url }) => MainFrameApi().navigate(url))
      );
    },
    { dispatch: false }
  );

  goBackEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(back),
        tap(() => MainFrameApi().goBack())
      );
    },
    { dispatch: false }
  );

  refreshEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(refresh),
        tap(() => MainFrameApi().refresh())
      );
    },
    { dispatch: false }
  );

  changeTranslationEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(changeTranslation),
        filter((e) => !e.withoutEffect),
        tap((translation) => MainFrameApi().changeTranslation(translation))
      );
    },
    { dispatch: false }
  );

  revertTranslationEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(revertTranslation),
        tap((translation) => MainFrameApi().revertTranslation(translation))
      );
    },
    { dispatch: false }
  );

  revertAllTranslationsEffect = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(revertAllTranslations),
        tap(() => MainFrameApi().revertAllTranslations())
      );
    },
    { dispatch: false }
  );
}
