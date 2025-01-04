import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ClarityModule, ClrIconModule } from '@clr/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MessageComponent } from './components/message/message.component';

@NgModule({
  imports: [CommonModule, ClarityModule, ClrIconModule, FontAwesomeModule],
  declarations: [MessageComponent],
  exports: [MessageComponent],
})
export class UiMessageModule {}
