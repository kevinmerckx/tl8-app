import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import {
  MarkdownDialogInput,
  MarkdownDialogOutput,
} from '@tl8/extra-ui-interfaces';
import { LanguageSelectDialogData } from '@tl8/extra-ui/language-select-dialog';
import { MainFrameApi } from '@tl8/main-frame/webview-api';
import { switchMap, tap, withLatestFrom } from 'rxjs/operators';
import {
  openHome,
  openLanguageSelect,
  openMarkdownEditor,
} from '../actions/extra-ui.actions';
import { MainFrameDataAccessService } from '../main-frame-data-access.service';

@Injectable()
export class ExtraUIEffects {
  openLanguageSelectModalEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openLanguageSelect),
        withLatestFrom(
          this.mainFrameDataAccessService.currentLanguage$,
          this.mainFrameDataAccessService.availableLanguages$
        ),
        switchMap(([, current, langs]) =>
          MainFrameApi().openModal<string>({
            modalId: 'language-select',
            data: {
              current,
              langs,
            } as LanguageSelectDialogData,
          })
        ),
        tap((value) => {
          if (value) {
            this.mainFrameDataAccessService.selectLanguage(value);
          }
        })
      ),
    { dispatch: false }
  );

  openHome = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openHome),
        tap(() => MainFrameApi().openHome())
      ),
    { dispatch: false }
  );

  openMarkdownEditorModalEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(openMarkdownEditor),
        concatLatestFrom((params) =>
          this.mainFrameDataAccessService.observeTranslation(params)
        ),
        tap(([params]) => {
          this.mainFrameDataAccessService.onUserFocusedOnTranslation(params);
        }),
        switchMap(([params, translationKeyValue]) =>
          MainFrameApi()
            .openModal<MarkdownDialogOutput, MarkdownDialogInput>({
              modalId: 'markdown',
              data: translationKeyValue,
            })
            .finally(() =>
              this.mainFrameDataAccessService.onUserBlurredOfTranslation(params)
            )
        ),
        tap((data) => {
          if (data) {
            this.mainFrameDataAccessService.changeTranslation(data);
          }
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private mainFrameDataAccessService: MainFrameDataAccessService
  ) {}
}
