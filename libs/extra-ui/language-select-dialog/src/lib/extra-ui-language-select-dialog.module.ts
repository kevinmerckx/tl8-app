import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExtraUiModalModule } from '@tl8/extra-ui/modal';
import { LanguageSelectDialogComponent } from './components/language-select-dialog/language-select-dialog.component';

@NgModule({
  imports: [CommonModule, ExtraUiModalModule, FontAwesomeModule],
  declarations: [LanguageSelectDialogComponent],
  exports: [LanguageSelectDialogComponent],
})
export class ExtraUiLanguageSelectDialogModule {}
