import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadDialogComponent } from './components/download-dialog/download-dialog.component';
import { ExtraUiModalModule } from '@tl8/extra-ui/modal';
import { UiOrSeparationModule } from '@tl8/ui/or-separation';

@NgModule({
  imports: [CommonModule, ExtraUiModalModule, UiOrSeparationModule],
  declarations: [DownloadDialogComponent],
})
export class ExtraUiDownloadDialogModule {}
