import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { createAction } from '@ngrx/store';
import { WorkInProgress } from '@tl8/api';
import { DownloadDialogOutput } from '@tl8/extra-ui-interfaces';
import { MainFrameApi } from '@tl8/main-frame/webview-api';
import * as FileSaver from 'file-saver';
import * as JSZip from 'jszip';
import { from } from 'rxjs';
import { delay, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { TargetApplicationConfig } from 'tl8';
import {
  downloadFinalTranslations,
  downloadWIPTranslations,
  openDownloadModal,
  startImportWIPProcess,
} from '../actions/app.actions';
import { openFeedbackDialog } from '../actions/user-settings.actions';
import { MainFrameDataAccessService } from '../main-frame-data-access.service';

@Injectable()
export class DownloadEffect {
  importWIP = createEffect(
    () =>
      this.actions$.pipe(
        ofType(startImportWIPProcess),
        withLatestFrom(
          this.mainFrameDataAccessService.targetApplicationConfig$
        ),
        switchMap(([, config]) =>
          from(MainFrameApi().importWIP(config as TargetApplicationConfig))
        )
        // map((importResult) => {
        //   if (importResult === 'cancel') {
        //     return createAction('noop');
        //   }
        //   return importWIP({ wip: importResult });
        // })
      ),
    { dispatch: false }
  );

  openDownloadModal = createEffect(() =>
    this.actions$.pipe(
      ofType(openDownloadModal),
      switchMap(() =>
        from(
          MainFrameApi().openModal<DownloadDialogOutput>({
            modalId: 'download',
          })
        )
      ),
      map((output) => {
        if (output === 'final') {
          return downloadFinalTranslations();
        }
        if (output === 'wip') {
          return downloadWIPTranslations();
        }
        return createAction('noop')();
      })
    )
  );

  downloadFinal = createEffect(
    () =>
      this.actions$.pipe(
        ofType(downloadFinalTranslations),
        withLatestFrom(this.mainFrameDataAccessService.modifiedTranslations$),
        tap(([, modified]) => downloadModifiedTranslations(modified))
      ),
    { dispatch: false }
  );

  downloadWIP = createEffect(
    () =>
      this.actions$.pipe(
        ofType(downloadWIPTranslations),
        withLatestFrom(
          this.mainFrameDataAccessService.currentTargetOverwrittenTranslations$,
          this.mainFrameDataAccessService.host$
        ),
        tap(([, wip, targetHost]) =>
          downloadWIP({ translations: wip, targetHost })
        )
      ),
    { dispatch: false }
  );

  askForFeedback = createEffect(() =>
    this.actions$.pipe(
      ofType(downloadFinalTranslations),
      delay(1000),
      map(() => openFeedbackDialog())
    )
  );

  constructor(
    private actions$: Actions,
    private mainFrameDataAccessService: MainFrameDataAccessService
  ) {}
}

async function downloadModifiedTranslations(
  modified: { lang: string; translations: any }[]
): Promise<void> {
  const zip = new JSZip();
  modified.forEach((tr) => {
    zip.file(tr.lang + '.json', JSON.stringify(tr.translations, null, 4));
  });
  const content = await zip.generateAsync({ type: 'blob' });
  FileSaver.saveAs(content, 'translations.zip');
}

function downloadWIP(wip: WorkInProgress) {
  const date = new Date();
  const filename = `wip-${new Date().toLocaleDateString()}-${date.getTime()}.tl8`;
  FileSaver.saveAs(
    new Blob([JSON.stringify(wip)], { type: 'text/plain;charset=utf-8' }),
    filename
  );
}
