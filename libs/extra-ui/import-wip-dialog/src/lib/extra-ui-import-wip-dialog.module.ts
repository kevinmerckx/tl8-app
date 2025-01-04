import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrAccordionModule, ClrRadioModule } from '@clr/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExtraUiModalModule } from '@tl8/extra-ui/modal';
import { UiMessageModule } from '@tl8/ui/message';
import { UiMessageGroupModule } from '@tl8/ui/message-group';
import { ImportWipDialogComponent } from './components/import-wip-dialog/import-wip-dialog.component';
import { ImportWIPDialogRootComponent } from './components/root/root.component';

@NgModule({
  imports: [
    CommonModule,
    ExtraUiModalModule,
    UiMessageModule,
    FormsModule,
    ClrRadioModule,
    ClrAccordionModule,
    FontAwesomeModule,
    UiMessageGroupModule,
  ],
  declarations: [ImportWipDialogComponent, ImportWIPDialogRootComponent],
})
export class ExtraUiImportWipDialogModule {}
