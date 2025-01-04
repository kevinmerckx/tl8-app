import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RootComponent } from './components/root/root.component';
import { ExtraUiModalModule } from '@tl8/extra-ui/modal';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UiMessageModule } from '@tl8/ui/message';
import { UiOrSeparationModule } from '@tl8/ui/or-separation';
import { UiCopyButtonModule } from '@tl8/ui/copy-button';
import { ClrInputModule } from '@clr/angular';

@NgModule({
  imports: [
    CommonModule,
    ExtraUiModalModule,
    FormsModule,
    UiMessageModule,
    UiOrSeparationModule,
    UiCopyButtonModule,
    ClrInputModule,
    RouterModule.forChild([{ path: '', component: RootComponent }]),
  ],
  declarations: [RootComponent],
})
export class ExtraUiHomeDialogModule {}
