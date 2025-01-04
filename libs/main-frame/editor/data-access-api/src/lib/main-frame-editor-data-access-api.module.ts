import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DownloadEffect } from './+store/effects/download.effect';
import { EditorEffects } from './+store/effects/editor.effects';
import { ExtraUIEffects } from './+store/effects/extra-ui.effects';
import { FeedbackDialogEffects } from './+store/effects/feedback-dialog.effects';
import { collaborationReducer } from './+store/reducers/collaboration.reducer';
import { editorReducer } from './+store/reducers/editor.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('editor', editorReducer),
    StoreModule.forFeature('collaboration', collaborationReducer),
    EffectsModule.forFeature([
      DownloadEffect,
      FeedbackDialogEffects,
      ExtraUIEffects,
      EditorEffects,
    ]),
  ],
})
export class MainFrameEditorDataAccessApiModule {}
