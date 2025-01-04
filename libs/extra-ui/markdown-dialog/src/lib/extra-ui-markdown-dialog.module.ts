import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExtraUiModalModule } from '@tl8/extra-ui/modal';
import { UiMessageModule } from '@tl8/ui/message';
import { MarkdownModule } from 'ngx-markdown';
import { MarkdownDialogComponent } from './components/markdown-dialog/markdown-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ExtraUiModalModule,
    FormsModule,
    MarkdownModule.forChild(),
    UiMessageModule,
    FontAwesomeModule,
  ],
  declarations: [MarkdownDialogComponent],
  exports: [MarkdownDialogComponent],
})
export class ExtraUiMarkdownDialogModule {}
