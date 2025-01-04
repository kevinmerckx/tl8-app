import { Component } from '@angular/core';
import { ModalService } from '@tl8/extra-ui/modal';

@Component({
  selector: 'tl8-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.sass'],
})
export class DownloadDialogComponent {
  constructor(private modal: ModalService) {}

  downloadFinalFiles() {
    this.modal.closeWithData('final');
  }

  downloadWIPFiles() {
    this.modal.closeWithData('wip');
  }
}
