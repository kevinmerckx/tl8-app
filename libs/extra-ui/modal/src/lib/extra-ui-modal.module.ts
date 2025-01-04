import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ModalComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [ModalComponent],
})
export class ExtraUiModalModule {}
