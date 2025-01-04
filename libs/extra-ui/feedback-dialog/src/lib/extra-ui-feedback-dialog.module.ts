import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExtraUiModalModule } from '@tl8/extra-ui/modal';
import { FeedbackDialogComponent } from './components/feedback-dialog/feedback-dialog.component';
import { FeedbackDialogConfiguration } from './feedback-dialog-configuration';
import { FEEDBACK_DIALOG_CONFIGURATION } from './feedback-dialog-configuration.token';

@NgModule({
  imports: [CommonModule, ExtraUiModalModule, FontAwesomeModule],
  declarations: [FeedbackDialogComponent],
  exports: [FeedbackDialogComponent],
})
export class ExtraUiFeedbackDialogModule {
  static forRoot(
    configuration: FeedbackDialogConfiguration
  ): ModuleWithProviders<ExtraUiFeedbackDialogModule> {
    return {
      ngModule: ExtraUiFeedbackDialogModule,
      providers: [
        {
          provide: FEEDBACK_DIALOG_CONFIGURATION,
          useValue: configuration,
        },
      ],
    };
  }
}
