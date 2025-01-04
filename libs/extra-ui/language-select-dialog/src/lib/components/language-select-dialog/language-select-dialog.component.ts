import { Component } from '@angular/core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '@tl8/extra-ui/modal';
import { LanguageSelectDialogData } from '../../language-select-dialog-data';

@Component({
  selector: 'tl8-language-select-dialog',
  templateUrl: './language-select-dialog.component.html',
  styleUrls: ['./language-select-dialog.component.scss'],
})
export class LanguageSelectDialogComponent {
  get data(): LanguageSelectDialogData {
    return this.modal.input as LanguageSelectDialogData;
  }

  icons = {
    selected: faCheck,
  };

  constructor(private modal: ModalService) {}

  selectLanguage(lang: string): void {
    this.modal.closeWithData(lang);
  }
}
